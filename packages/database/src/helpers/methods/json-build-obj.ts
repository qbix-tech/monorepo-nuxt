import {
  type AnyColumn,
  type InferColumnsDataTypes,
  type SQL,
  sql,
} from "drizzle-orm";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Create a SQL query that builds JSON object.
 *
 * @param select Object mapping keys to columns for the JSON object
 * @param nullFilterColumn Optional column to check for NULL before building the object
 * @returns SQL query that returns a JSON object or NULL
 */
const jsonBuildObj = <T extends Record<string, AnyColumn>>(
  select: T,
  nullFilterColumn?: AnyColumn,
) => {
  const chunks: SQL[] = [];

  Object.entries(select).forEach(([key, column], index) => {
    if (index > 0) chunks.push(sql`,`);
    chunks.push(
      sql.raw(`'${key}',`),
      column.columnType === "PgNumeric" ? sql`${column}::TEXT` : sql`${column}`,
    );
  });

  const jsonBuildObjectSQL = sql.join(chunks);

  if (nullFilterColumn) {
    return sql<Prettify<InferColumnsDataTypes<T>> | null>`
      CASE 
        WHEN ${nullFilterColumn} IS NULL THEN NULL 
        ELSE jsonb_build_object(${jsonBuildObjectSQL})
      END
    `;
  }

  return sql<Prettify<InferColumnsDataTypes<T>>>`
    jsonb_build_object(${jsonBuildObjectSQL})
  `;
};

export default jsonBuildObj;
