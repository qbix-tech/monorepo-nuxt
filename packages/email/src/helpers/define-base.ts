import type { EmailBaseProps } from "../types";
import { defu } from "defu";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DefuInput = Record<string, any>;

export const defineBase = (baseProps: EmailBaseProps) => {
  return {
    withBase: <T extends DefuInput>(data: T): EmailBaseProps & T =>
      defu(data, baseProps) as EmailBaseProps & T,
  };
};
