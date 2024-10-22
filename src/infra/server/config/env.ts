import "dotenv/config";

export default {
  mongoUrl: process.env.MONGO_URL ?? "mongodb://localhost:27017/app",
  pgUrl: process.env.MONGO_URL ?? "postgres://postgres:password@localhost:5432/producers",
  port: Number(process.env.APP_PORT ?? 3000),
};
