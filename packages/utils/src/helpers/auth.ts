import { argon2id, hash, verify } from "argon2";
import { customAlphabet } from "nanoid";
import { timingSafeEqual, createHash } from "node:crypto";
import { z } from "zod";

const ARGON_2_CONFIG = {
  type: argon2id,
  memoryCost: 2 ** 16,
  timeCost: 3,
  parellelism: 4,
} as const;

export const hashPasswordWithArgon = async (password: string) => {
  return hash(password, ARGON_2_CONFIG);
};

export const verifyPasswordWithArgon = async (
  hash: string,
  password: string,
) => {
  return verify(hash, password);
};

export const generateRandomPassword = (size: number = 41) => {
  return customAlphabet(
    "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    size,
  )(size);
};

export const validatePCKE = (challenge?: string, method?: string) => {
  if (!challenge) return;
  if (!method) method = "plain";

  if (method !== "S256") {
    z.string()
      .min(43)
      .max(128)
      .refine((val: string) => /[^\w.\-~]/.test(val) === false)
      .parse(challenge);
  } else {
    z.string().length(43).parse(challenge);
  }
};

export const checkPCKE = (
  verifier?: string | null,
  challenge?: string | null,
  method?: string | null,
) => {
  if (!challenge && !verifier) return;
  if (!method) method = "plain";

  try {
    let expected = z
      .string()
      .min(43)
      .max(128)
      .refine((val: string) => /[^\w.\-~]/.test(val) === false)
      .parse(verifier);

    if (method === "S256") {
      expected = createHash("sha256")
        .update(expected)
        .digest()
        .toString("base64url");
    }

    if (!constantEquals(challenge!, expected)) {
      throw new Error();
    }
  } catch {
    throw new Error("PKCE verification failed");
  }
};

const paddedBuffer = (s: string, length: number) => {
  const buffer = Buffer.alloc(length, undefined, "utf-8");
  buffer.write(s);
  return buffer;
};

export const constantEquals = (a: string, b: string, minComp: number = 0) => {
  if (!Number.isSafeInteger(minComp)) {
    throw new TypeError("minComp must be an Integer");
  }
  if (typeof a !== "string" || typeof b !== "string") {
    throw new TypeError("arguments must be strings");
  }
  const length = Math.max(a.length, b.length, minComp);
  return timingSafeEqual(paddedBuffer(a, length), paddedBuffer(b, length));
};
