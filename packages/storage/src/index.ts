import type {
  FileStorageProvider,
  FileStorageProviderOptions,
  FileStorageService,
} from "./types";
import { S3FileStorage } from "./module/s3";

export * from "./types";
export { default as storageConfig } from "../storage.config";

export const useFileStorage = (
  provider: FileStorageProvider,
  options: FileStorageProviderOptions = {},
): FileStorageService => {
  if (!provider) provider = "S3";

  switch (provider) {
    case "S3":
      return new S3FileStorage(options.public ? "public" : "private");
    default:
      throw new Error(`Unsupported file storage provider: ${provider}`);
  }
};
