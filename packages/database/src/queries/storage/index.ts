import type { DrizzlePGDatabase, DrizzlePGTransaction } from "../..";
import type { BucketConfig, useFileStorage } from "@org/storage";
import { useLogger } from "@org/utils";
import { dbs } from "../..";
import { defu } from "defu";
import { eq, and } from "drizzle-orm";

const console = useLogger().withTag("database:queries:storage");

export class StorageService {
  constructor(
    private readonly db: DrizzlePGDatabase,
    private readonly storage: typeof useFileStorage,
    private readonly getBucketConfig: (bucketName: string) => BucketConfig,
    private readonly createError: (options: {
      statusCode: number;
      statusMessage: string;
      message?: string;
    }) => Error,
  ) {}

  /**
   * Uploads a file to the specified storage bucket and records its metadata in the database.
   *
   * @param {File} file The file to be uploaded.
   * @param {Object} options Configuration options for the upload.
   * @param {string} options.name The name of the file.
   * @param {string} options.bucket The name of the storage bucket.
   * @param {string} [options.owner] (Optional) The ID of the user who owns the file.
   * @param {Record<string, any>} [options.metadata] (Optional) Additional metadata to be associated with the file.
   * @param {string} [options.sessionId] (Optional) The session ID of the uploader.
   * @param {Promise<void> | void} [options.postUploadCallback] (Optional) A callback function to be executed after file is uploaded. Thrown error from this callback will rollback file upload.
   *
   * @returns The record of the uploaded file from the database.
   *
   * @throws Will throw an error if the upload or database transaction fails.
   */
  async upload(
    file: File,
    options: {
      name: string;
      bucket: string;
      owner?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata?: Record<string, any>;
      sessionId?: string | null;
      resourceId?: string | null;
      staledAt?: Date | null;
      postUploadCallback?: (
        object: typeof dbs.storage.object.$inferSelect,
      ) => Promise<void> | void;
    },
    tx?: DrizzlePGTransaction,
  ) {
    const db = tx || this.db;

    try {
      const bucketConfig = this.getBucketConfig(options.bucket);

      const record = await db.transaction(async (tx) => {
        const key = `${options.bucket}/${options.name}`;

        const [object] = await tx
          .insert(dbs.storage.object)
          .values({
            key: key,
            bucket: options.bucket,
            name: options.name,
            owner: options.owner,
            metadata: defu(options.metadata, {
              size: file.size,
              type: file.type,
              name: file.name,
              lastModified: file.lastModified,
            }),
            sessionId: options.sessionId,
            resourceId: options.resourceId,
            staledAt: options.staledAt,
          })
          .returning();

        if (!object) throw new Error("Failed to create object record");

        await this.storage("S3", {
          public: bucketConfig.public,
        }).upload({
          key,
          file,
        });

        if (options.postUploadCallback) {
          try {
            await options.postUploadCallback(object);
          } catch (error) {
            // rollback
            await this.delete(key, tx);
            throw error;
          }
        }

        return object;
      });

      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retreive the object record from the database by its key.
   *
   * @param key The key of the object.
   */
  async get(key: string, tx?: DrizzlePGTransaction) {
    const db = tx || this.db;
    try {
      const [object] = await db
        .select()
        .from(dbs.storage.object)
        .where(eq(dbs.storage.object.key, key));
      return object ?? null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Update an object
   *
   * @param key The key of the object.
   * @param data The data of the object to update.
   * @returns A promise that resolve to the updated object record.
   */
  async update(
    key: string,
    data: Partial<typeof dbs.storage.object.$inferSelect>,
    tx?: DrizzlePGTransaction,
  ) {
    const db = tx || this.db;
    try {
      const [object] = await db
        .update(dbs.storage.object)
        .set(data)
        .where(eq(dbs.storage.object.key, key))
        .returning();
      if (!object) {
        throw new Error("Failed to update object");
      }
      return object;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Deletes the object from the storage service and its record in database.
   *
   * @param key The key of the object to be deleted.
   * @returns The deleted object record.
   * @throws Will throw an error if the deletion process fails.
   */
  async delete(key: string, tx?: DrizzlePGTransaction) {
    const db = tx || this.db;

    try {
      const bucket = key.split("/")[0];
      if (!bucket) throw new Error("Bucket not found");

      const bucketConfig = this.getBucketConfig(bucket);

      const record = await db.transaction(async (tx) => {
        const [object] = await tx
          .delete(dbs.storage.object)
          .where(eq(dbs.storage.object.key, key))
          .returning();

        if (!object) throw new Error("Failed to delete object record");

        await this.storage("S3", { public: bucketConfig.public }).delete(key);

        return object;
      });

      return record;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Mark an object as not stale in the database.
   *
   * @param key The key of the object.
   * @returns A promise that resolve to the updated object record.
   */
  async unstaleObject(key: string, tx?: DrizzlePGTransaction) {
    const db = tx || this.db;
    try {
      const [object] = await db
        .update(dbs.storage.object)
        .set({
          staledAt: null,
        })
        .where(eq(dbs.storage.object.key, key))
        .returning();
      return object;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Retrieves the public URL for a given key from the storage service.
   *
   * @param key The key representing the file in the storage service.
   * @returns The public URL of the file.
   * @throws Will throw an error if the bucket is not public or if any other error occurs.
   */
  getPublicUrl(key: string): string {
    try {
      const bucket = key.split("/")[0];
      if (!bucket) throw new Error("Bucket not found");

      const bucketConfig = this.getBucketConfig(bucket);

      if (!bucketConfig.public) {
        throw this.createError({
          statusCode: 403,
          statusMessage: "Forbidden",
        });
      }

      return this.storage("S3", { public: true }).getPublicUrl(key);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Asynchronously retrieves a signed URL for reading a file from storage.
   *
   * @param key The key or path of the file in the storage bucket.
   * @param [expiresInSeconds=3600] (Optional) The number of seconds the signed URL is valid for.
   * @returns A promise that resolves to the signed URL for reading the file.
   * @throws Will throw an error if there is an issue generating the signed URL.
   */
  async getSignedUrl(
    key: string,
    expiresInSeconds = 60 * 60 * 1,
  ): Promise<string> {
    try {
      const bucket = key.split("/")[0];
      if (!bucket) throw new Error("Bucket not found");

      const bucketConfig = this.getBucketConfig(bucket);

      return await this.storage("S3", {
        public: bucketConfig.public,
      }).getSignedUrlForRead(key, expiresInSeconds);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * Checks if the owner of the object is the specified identifier.
   *
   * @param key The key of the object.
   * @param identifier The identifier of the owner.
   * @returns A promise that resolves to true if the user is the owner, false otherwise.
   */
  async isOwner(
    key: string,
    identifier: string,
    tx?: DrizzlePGTransaction,
  ): Promise<boolean> {
    const db = tx || this.db;

    try {
      const [record] = await db
        .select()
        .from(dbs.storage.object)
        .where(eq(dbs.storage.object.key, key));

      if (!record) {
        return false;
      }

      return record.owner === identifier;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Checks if the session ID associate with the object is the uploader's current session.
   *
   * @param key The key of the object.
   * @param sessionId The identifier of the session.
   * @returns A promise that resolves to true if the session ID matches, false otherwise.
   */
  async isSameSession(
    key: string,
    sessionId: string,
    tx?: DrizzlePGTransaction,
  ): Promise<boolean> {
    const db = tx || this.db;

    try {
      const [record] = await db
        .select()
        .from(dbs.storage.object)
        .where(eq(dbs.storage.object.key, key));

      if (!record) {
        return false;
      }

      return record.sessionId === sessionId;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Retrieves all objects owned by a specific user in a given bucket.
   *
   * @param bucket The name of the storage bucket.
   * @param identifier The identifier of the owner.
   * @returns An array of objects owned by the user.
   */
  async getObjectsByOwner(
    bucket: string,
    identifier: string,
    tx?: DrizzlePGTransaction,
  ) {
    const db = tx || this.db;

    try {
      const records = await db
        .select()
        .from(dbs.storage.object)
        .where(
          and(
            eq(dbs.storage.object.bucket, bucket),
            eq(dbs.storage.object.owner, identifier),
          ),
        );

      return records;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Retrieves all objects associated with a specific session ID in a given bucket.
   *
   * @param bucket The name of the storage bucket.
   * @param sessionId The session ID associated with the objects.
   * @returns An array of objects associated with the session ID.
   */
  async getObjectsBySessionId(
    bucket: string,
    sessionId: string,
    tx?: DrizzlePGTransaction,
  ) {
    const db = tx || this.db;

    try {
      const records = await db
        .select()
        .from(dbs.storage.object)
        .where(
          and(
            eq(dbs.storage.object.bucket, bucket),
            eq(dbs.storage.object.sessionId, sessionId),
          ),
        );

      return records;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Retrieves all objects associated with a specific resource ID in a given bucket.
   *
   * @param bucket The name of the storage bucket.
   * @param resourceId The resource ID associated with the objects.
   * @returns An array of objects associated with the session ID.
   */
  async getObjectsByResourceId(
    bucket: string,
    resourceId: string,
    tx?: DrizzlePGTransaction,
  ) {
    const db = tx || this.db;

    try {
      const records = await db
        .select()
        .from(dbs.storage.object)
        .where(
          and(
            eq(dbs.storage.object.bucket, bucket),
            eq(dbs.storage.object.resourceId, resourceId),
          ),
        );

      return records;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
