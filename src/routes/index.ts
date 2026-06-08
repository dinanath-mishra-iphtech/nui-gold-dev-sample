import { FastifyInstance } from "fastify";
import { userRoutes } from "../modules/users/user.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { uploadRoutes } from "../modules/upload/upload.routes";



export async function routes(app: FastifyInstance) {
  app.register(userRoutes, {
    prefix: "/api/users",
  });

  app.register(authRoutes, {
    prefix: "/api/auth",
  });

  app.register(uploadRoutes, {
    prefix: "/api/upload",
  });

}
