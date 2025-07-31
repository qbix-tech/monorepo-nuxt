/* eslint-disable @typescript-eslint/no-explicit-any */

const DEFAULT_SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "key",
  "code",
  "pin",
  "otp",
  "auth",
  "credential",
  "totp",
];
const DEFAULT_WHITELIST_KEYS = ["postalCode", "postcode"];

export const sanitizeByObjectKeyRecurse = <T extends Record<string, any>>(
  obj: T,
  opts: {
    sensitiveKeys?: string[];
    whitelistKeys?: string[];
  } = {},
): T => {
  const sensitiveKeys = opts.sensitiveKeys || DEFAULT_SENSITIVE_KEYS;
  const whitelistKeys = opts.whitelistKeys || DEFAULT_WHITELIST_KEYS;

  if (!obj || typeof obj !== "object") {
    return obj;
  }

  const sanitized = Array.isArray(obj) ? [...obj] : { ...obj };

  for (const [key, value] of Object.entries(sanitized)) {
    // Check if the current key is sensitive
    const isSensitiveKey = whitelistKeys.some(
      (wKey) => wKey.toLowerCase() === key.toLowerCase(),
    )
      ? false
      : sensitiveKeys.some((sensitiveKey) =>
          key.toLowerCase().includes(sensitiveKey.toLowerCase()),
        );

    if (isSensitiveKey) {
      // Mask sensitive data
      if (typeof value === "string") {
        (sanitized as any)[key] = "***REDACTED***";
      } else if (typeof value === "number") {
        (sanitized as any)[key] = 0;
      } else if (typeof value === "boolean") {
        (sanitized as any)[key] = false;
      } else if (value === null || value === undefined) {
        // Keep as is
      } else {
        (sanitized as any)[key] = "***REDACTED***";
      }
    } else if (value !== null && typeof value === "object") {
      // Handle Date objects by converting to ISO string
      if (value instanceof Date) {
        (sanitized as any)[key] = value.toISOString();
      } else {
        // Recursively sanitize nested objects
        (sanitized as any)[key] = sanitizeByObjectKeyRecurse(value!, {
          sensitiveKeys,
          whitelistKeys,
        });
      }
    }
  }

  return sanitized as T;
};
