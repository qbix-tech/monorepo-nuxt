import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner";
import { useLogger } from "@org/utils";
import type { FileStorageService, FileUploadOptions } from "../../types";

const console = useLogger("#base").withTag("storage:s3");

export class S3FileStorage implements FileStorageService {
  private s3Client: S3Client;
  private s3ClientPublic: S3Client;
  private bucket: string;
  private s3PublicUrl: string;
  private type: "public" | "private";

  constructor(type: "public" | "private") {
    this.type = type;

    const s3Region = process.env[`S3_${type.toUpperCase()}_REGION`] as
      | string
      | undefined;
    const s3Endpoint = process.env[`S3_${type.toUpperCase()}_ENDPOINT`] as
      | string
      | undefined;
    const s3ForcePathStyle =
      process.env[`S3_${type.toUpperCase()}_FORCE_PATH_STYLE`] === "true";
    const s3AccessKeyId = process.env[
      `S3_${type.toUpperCase()}_ACCESS_KEY_ID`
    ] as string;
    const s3SecretAccessKey = process.env[
      `S3_${type.toUpperCase()}_SECRET_ACCESS_KEY`
    ] as string;
    this.bucket = process.env[`S3_${type.toUpperCase()}_BUCKET`] as string;
    this.s3PublicUrl = process.env[
      `S3_${type.toUpperCase()}_ACCESS_URL`
    ] as string;

    if (!s3AccessKeyId || !s3SecretAccessKey || !this.bucket) {
      throw new Error(
        `Missing S3 ${type} configuration. Please check your environment variables.`,
      );
    }

    if (s3Region) {
      this.s3Client = new S3Client({
        region: s3Region,
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        forcePathStyle: s3ForcePathStyle,
      });
      this.s3ClientPublic = this.s3Client; // they are the same
    } else if (s3Endpoint) {
      this.s3Client = new S3Client({
        region: "auto",
        endpoint: s3Endpoint,
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        forcePathStyle: s3ForcePathStyle,
      });
      // FIXME: a workaround patch to use this client for signing object on public URLs
      this.s3ClientPublic = new S3Client({
        region: "auto",
        endpoint: this.s3PublicUrl.replace("/" + this.bucket, ""),
        credentials: {
          accessKeyId: s3AccessKeyId,
          secretAccessKey: s3SecretAccessKey,
        },
        forcePathStyle: s3ForcePathStyle,
      });
    } else {
      throw new Error(
        `Must have at least S3_${type.toUpperCase()}_REGION or S3_${type.toUpperCase()}_ENDPOINT configuration. Please check your environment variables.`,
      );
    }
  }

  async upload({ key, file }: FileUploadOptions): Promise<string> {
    let body: Buffer | string;
    if (file instanceof Blob) {
      body = Buffer.from(await file.arrayBuffer());
    } else if (Buffer.isBuffer(file)) {
      body = file;
    } else if (typeof file === "string") {
      body = file;
    } else {
      throw new Error("Unsupported data type for upload");
    }

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ACL: this.type === "public" ? "public-read" : undefined,
    });

    try {
      await this.s3Client.send(command);
      return key;
    } catch (error) {
      console.error("Error uploading file to S3", error);
      throw new Error(`Failed to upload file of key ${key}`);
    }
  }

  async delete(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    try {
      await this.s3Client.send(command);
    } catch (error) {
      console.error("Error deleting file:", error);
      throw new Error(`Failed to delete file of key ${key}`);
    }
  }

  async getSignedUrlForRead(
    key: string,
    expiresInSeconds: number = 60 * 60 * 1, // defaults 1 hour
  ): Promise<string> {
    try {
      const url = await getS3SignedUrl(
        this.s3ClientPublic,
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        { expiresIn: expiresInSeconds },
      );
      return url;
    } catch (error) {
      console.error("Error generating signed URL for read:", error);
      throw new Error(`Failed to generate signed URL for reading ${key}`);
    }
  }

  getPublicUrl(key: string) {
    return `${this.s3PublicUrl}/${key}`;
  }
}
