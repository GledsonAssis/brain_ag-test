import { readdirSync } from "fs";
import { join } from "path";

export const setupRoutes = (): void => {
  readdirSync(join(__dirname, "../routes"))
    .filter((file) => !file.endsWith(".map"))
    .forEach(async (file) => {
      const Route = await import(`../routes/${file}`);
      new Route.default()
    });
};
