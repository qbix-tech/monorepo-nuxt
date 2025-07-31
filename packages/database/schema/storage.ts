import { pgSchema, uniqueIndex, index } from "drizzle-orm/pg-core";

export const schema = pgSchema("storage");

export const object = schema.table(
  "object",
  (t) => ({
    /**
     * The key of the storage object, identified as `${bucket}/${name}`
     */
    key: t.text().primaryKey(),
    createdAt: t.timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    /**
     * The bucket where the object is stored.
     */
    bucket: t.text().notNull(),
    /**
     * The object name.
     */
    name: t.text().notNull(),
    /**
     * Metadata associated with the object, stored as a JSONB type.
     */
    metadata: t.jsonb().notNull().default({}),
    /**
     * An optional owner identifier for the object, which can be used for access control or tracking.
     */
    owner: t.text(),
    /**
     * An optional resource identifier for the object, which can be used for access control or tracking.
     */
    resourceId: t.text(),
    /**
     * An optional session identifier for the object, which can be used for access control or tracking.
     */
    sessionId: t.text(),
    /**
     * An optional timestamp indicating when the object was last considered stale or no longer in use.
     */
    staledAt: t.timestamp({ withTimezone: true }),
  }),
  (table) => [
    uniqueIndex("unique_storage_object_bucket_name").on(
      table.bucket,
      table.name,
    ),
    index("idx_storage_object_owner").using("btree", table.owner),
    index("idx_storage_object_resource_id").using("btree", table.resourceId),
    index("idx_storage_object_session_id").using("btree", table.sessionId),
    index("idx_storage_object_staled_at").using("btree", table.staledAt),
  ],
);
