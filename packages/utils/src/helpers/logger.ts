import { createConsola } from "consola";

let _consolaInstance: ReturnType<typeof createConsola> | null = null;

export const useLogger = (appName?: string) => {
  if (!_consolaInstance) {
    _consolaInstance = createConsola({
      level: process.env.NODE_ENV === "production" ? 3 : 4,
    }).withTag(appName ?? "");
  }
  return _consolaInstance;
};
