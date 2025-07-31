const FILESIZE_UNITS = ["B", "KB", "MB", "GB"] as const;
type PowOf2 = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
type SizeUnit = (typeof FILESIZE_UNITS)[number];
type FileSizeUnit = (typeof FILESIZE_UNITS)[number];

export type BlobSize = `${PowOf2}${SizeUnit}`;
export type BlobType =
  | "image"
  | "video"
  | "audio"
  | "pdf"
  | "text"
  | "blob"
  | MimeTypeArray;

export interface BlobEnsureOptions {
  maxSize?: BlobSize;
  mimeTypes?: BlobType[];
}

/**
 * Converts a file size string to bytes.
 * @param input - The file size string (e.g., "1KB", "2MB").
 * @returns The size in bytes.
 * @throws Will throw an error if the input format is invalid.
 */
function fileSizeToBytes(input: string): number {
  const regex = new RegExp(
    `^(\\d+(?:\\.\\d+)?)\\s*(${FILESIZE_UNITS.join("|")})$`,
    "i",
  );
  const match = input.match(regex);

  if (!match) {
    throw new Error(`Invalid file size format: ${input}`);
  }

  const sizeValue = Number.parseFloat(match[1] as string);
  const sizeUnit = (match[2] as string).toUpperCase() as FileSizeUnit;

  if (!FILESIZE_UNITS.includes(sizeUnit)) {
    throw new Error(`Invalid file size unit: ${sizeUnit}`);
  }
  if (!sizeValue || (sizeValue !== 1 && sizeValue % 2 !== 0)) {
    throw new Error(`Invalid file size value: ${sizeValue}`);
  }

  const bytes = sizeValue * Math.pow(1024, FILESIZE_UNITS.indexOf(sizeUnit));
  return Math.floor(bytes);
}

/**
 * Ensures a Blob meets specified criteria. Supported only for node environment.
 * @param blob - The Blob object to validate.
 * @param options - The validation options.
 * @throws Will throw an error if the Blob does not meet the specified criteria.
 */
export function validateBlob(
  blob: Blob,
  options: BlobEnsureOptions = {},
): void {
  const { maxSize, mimeTypes } = options;

  if (!maxSize && (!mimeTypes || !mimeTypes.length)) {
    throw new Error(
      "validateBlob() requires at least one of maxSize or types to be set.",
    );
  }

  if (maxSize) {
    const maxFileSizeBytes = fileSizeToBytes(maxSize);
    if (blob.size > maxFileSizeBytes) {
      throw new Error(`File size must be less than ${maxSize}`);
    }
  }

  if (mimeTypes && mimeTypes.length) {
    const blobShortType1 = blob.type.split("/")[0];
    const blobShortType2 = blob.type.split("/")[1];
    const isValidType =
      mimeTypes.includes(blob.type as BlobType) ||
      mimeTypes.includes(blobShortType1 as BlobType) ||
      mimeTypes.includes(blobShortType2 as BlobType);

    if (!isValidType) {
      throw new Error(`File type is invalid, must be: ${mimeTypes.join(", ")}`);
    }
  }
}

/**
 * Ensures a File meets specified criteria. Supported only for browser environment.
 * @param blob - The File to validate.
 * @param options - The validation options.
 * @throws Will throw an error if the File does not meet the specified criteria.
 */
export function validateFile(file: File, options: BlobEnsureOptions = {}) {
  const { maxSize, mimeTypes } = options;
  if (!maxSize && (!mimeTypes || !mimeTypes.length)) {
    throw new Error(
      "validateFile() requires at least one of maxSize or types to be set.",
    );
  }
  if (maxSize) {
    const maxFileSizeBytes = fileSizeToBytes(maxSize);
    if (file.size > maxFileSizeBytes) {
      throw new Error(`File size must be less than ${maxSize}`);
    }
  }
  if (mimeTypes && mimeTypes.length) {
    const fileShortType1 = file.type.split("/")[0];
    const fileShortType2 = file.type.split("/")[1];
    const isValidType =
      mimeTypes.includes(file.type as BlobType) ||
      mimeTypes.includes(fileShortType1 as BlobType) ||
      mimeTypes.includes(fileShortType2 as BlobType);

    if (!isValidType) {
      throw new Error(`File type is invalid, must be: ${mimeTypes.join(", ")}`);
    }
  }
}
