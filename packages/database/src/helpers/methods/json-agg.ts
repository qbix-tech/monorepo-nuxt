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
 * Create a SQL query that builds JSON Aggregate.
 *
 * @param select Object mapping keys to columns for the JSON object
 * @param nullFilterColumn Optional column to check for NULL before building the object
 * @param sortBy Optional sort option
 * @returns SQL query that returns an array of objects.
 */
const jsonAgg = <T extends Record<string, AnyColumn>>(
  select: T,
  nullFilterColumn?: AnyColumn,
  sortBy?: { column?: AnyColumn; asc?: boolean },
) => {
  const chunks: SQL[] = [];

  Object.entries(select).forEach(([key, column], index) => {
    if (index > 0) chunks.push(sql`,`);
    chunks.push(
      sql.raw(`'${key}',`),
      column.columnType === "PgNumeric" ? sql`${column}::TEXT` : sql`${column}`,
    );
  });

  const baseAgg = sql`jsonb_build_object(${sql.join(chunks)})`;

  const sortedAgg = sortBy?.column
    ? sql`json_agg(${baseAgg} ORDER BY ${sortBy.column} ${sortBy.asc ? sql`ASC` : sql`DESC`})`
    : sql`json_agg(${baseAgg})`;

  if (nullFilterColumn) {
    return sql<Prettify<InferColumnsDataTypes<T>>[]>`
    coalesce(
      ${sortedAgg} FILTER (WHERE ${nullFilterColumn} IS NOT NULL),
      '[]'
    )
    `;
  }

  return sql<Prettify<InferColumnsDataTypes<T>>[]>`
    coalesce(
      ${sortedAgg},
      '[]'
    )
  `;
};

export default jsonAgg;
