import { customType } from "drizzle-orm/pg-core";

export default customType<{
  data: Buffer;
  notNull: false;
  default: false;
}>({
  dataType() {
    return "bytea";
  },
});
