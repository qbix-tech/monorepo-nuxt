import {
  type AnyColumn,
  type InferColumnsDataTypes,
  type SQL,
  type Table,
  sql,
} from "drizzle-orm";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Creates a SQL query that builds a JSON object from a subquery
 *
 * @param select - Object mapping keys to columns for the JSON object
 * @param from - Table to select from
 * @param condition - WHERE condition for the subquery
 * @param nullFilterColumn - Optional column to check for NULL before building the object
 * @returns SQL query that returns a JSON object or NULL
 */
const jsonBuildObjSubquery = <T extends Record<string, AnyColumn>>(
  select: T,
  from: Table,
  condition: SQL,
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

  const subquery = sql<Prettify<InferColumnsDataTypes<T>> | null>`
    (SELECT jsonb_build_object(${jsonBuildObjectSQL})
     FROM ${from}
     WHERE ${condition}
     LIMIT 1)
  `;

  return subquery;
};

export default jsonBuildObjSubquery;
