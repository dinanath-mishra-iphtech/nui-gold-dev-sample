import { FastifyInstance } from "fastify";
import { UploadController } from "./upload.controller";
import { uploadFileSchema } from "./upload.schema";

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/", { schema: uploadFileSchema }, UploadController.upload);
}
