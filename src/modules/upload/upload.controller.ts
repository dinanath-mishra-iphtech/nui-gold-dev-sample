import { FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";
import { v4 as uuidv4 } from "uuid";

// ── Upload type configuration ────────────────────────────────────────
interface UploadTypeConfig {
  /** Allowed MIME types */
  allowedMimeTypes: string[];
  /** Allowed file extensions (lowercase, with dot) */
  allowedExtensions: string[];
  /** Max file size in bytes */
  maxFileSize: number;
  /** Sub-directory name inside uploads/ */
  directory: string;
}

const UPLOAD_TYPES: Record<string, UploadTypeConfig> = {
  signature_image: {
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
    maxFileSize: 1 * 1024 * 1024, // 1 MB
    directory: "signatures",
  },
  trading_document: {
    allowedMimeTypes: ["application/pdf"],
    allowedExtensions: [".pdf"],
    maxFileSize: 5 * 1024 * 1024, // 5 MB
    directory: "signed-trading-documents",
  },
  product_image: {
    allowedMimeTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"],
    allowedExtensions: [".png", ".jpg", ".jpeg", ".webp"],
    maxFileSize: 1 * 1024 * 1024, // 1 MB
    directory: "products",
  },
};

// Base upload directory (project root / uploads)
const UPLOADS_BASE = path.join(process.cwd(), "uploads");

export class UploadController {
  /**
   * POST /api/upload
   * Multipart form: { type: string, file: File }
   */
  static async upload(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({
        success: false,
        message: "No file uploaded. Please attach a file.",
      });
    }

    // ── Extract & validate the `type` field ───────────────────────────
    const typeField = data.fields.type;

    let uploadType: string | undefined;

    if (
      typeField &&
      "value" in typeField &&
      typeof typeField.value === "string"
    ) {
      uploadType = typeField.value;
    }

    if (!uploadType || !UPLOAD_TYPES[uploadType]) {
      return reply.status(400).send({
        success: false,
        message: `Invalid or missing upload type. Allowed types: ${Object.keys(UPLOAD_TYPES).join(", ")}`,
      });
    }

    const config = UPLOAD_TYPES[uploadType];

    // ── Validate MIME type ────────────────────────────────────────────
    if (!config.allowedMimeTypes.includes(data.mimetype)) {
      return reply.status(400).send({
        success: false,
        message: `Invalid file type "${data.mimetype}". Allowed: ${config.allowedMimeTypes.join(", ")}`,
      });
    }

    // ── Validate file extension ───────────────────────────────────────
    const ext = path.extname(data.filename).toLowerCase();
    if (!config.allowedExtensions.includes(ext)) {
      return reply.status(400).send({
        success: false,
        message: `Invalid file extension "${ext}". Allowed: ${config.allowedExtensions.join(", ")}`,
      });
    }

    // ── Ensure target directory exists ────────────────────────────────
    const targetDir = path.join(UPLOADS_BASE, config.directory);
    fs.mkdirSync(targetDir, { recursive: true });

    // ── Generate a unique filename ────────────────────────────────────
    const uniqueName = `${uuidv4()}${ext}`;
    const filePath = path.join(targetDir, uniqueName);

    // ── Stream file to disk ───────────────────────────────────────────
    await pipeline(data.file, fs.createWriteStream(filePath));

    // Check if the stream was truncated (file exceeded size limit)
    if (data.file.truncated) {
      // Clean up the partially written file
      fs.unlinkSync(filePath);
      return reply.status(400).send({
        success: false,
        message: `File too large. Maximum size for ${uploadType}: ${(config.maxFileSize / (1024 * 1024)).toFixed(0)} MB`,
      });
    }

    // Build the relative URL path for retrieval
    const fileUrl = `/uploads/${config.directory}/${uniqueName}`;

    return reply.status(200).send({
      success: true,
      message: "File uploaded successfully.",
      data: {
        type: uploadType,
        originalName: data.filename,
        fileName: uniqueName,
        fileUrl,
        mimeType: data.mimetype,
      },
    });
  }
}
