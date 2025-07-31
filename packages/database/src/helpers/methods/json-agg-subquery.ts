import {
  type AnyColumn,
  type Table,
  type InferColumnsDataTypes,
  type SQL,
  sql,
} from "drizzle-orm";

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Create a SQL query that builds JSON Aggregate from a subquery.
 *
 * @param select Object mapping keys to columns for the JSON object
 * @param from Table to select from
 * @param condition WHERE condition for the subquery
 * @param sortBy Optional sort option
 * @returns SQL query that returns an array of objects from a subquery.
 */
const jsonAggSubquery = <T extends Record<string, AnyColumn>>(
  select: T,
  from: Table,
  condition: SQL,
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

  const jsonbBuildObj = sql`jsonb_build_object(${sql.join(chunks)})`;

  const sortedAgg = sortBy?.column
    ? sql`json_agg(${jsonbBuildObj} ORDER BY ${sortBy.column} ${sortBy.asc ? sql`ASC` : sql`DESC`})`
    : sql`json_agg(${jsonbBuildObj})`;

  const subquery = sql<Prettify<InferColumnsDataTypes<T>>[]>`
      (SELECT coalesce(
        ${sortedAgg},
        '[]'
      ) FROM ${from} WHERE ${condition})
      `;

  return subquery;
};

export default jsonAggSubquery;
