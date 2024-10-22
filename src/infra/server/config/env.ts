import "dotenv/config";

export default {
  pgUrl: process.env.POSTGRES_CONNECTION_STRING ?? "postgres://postgres:password@localhost:5432/producers",
  port: Number(process.env.APP_PORT ?? 3000),
};
