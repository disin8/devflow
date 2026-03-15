import type { DevFlowModule, ModuleAction } from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

const dockerComposeModule: DevFlowModule = {
  id: "docker-compose",
  name: "Docker Compose",
  description: "docker-compose.yml for local development",
  category: "docker",

  async detect(ctx) {
    const has =
      fileExists(ctx.root, "docker-compose.yml") ||
      fileExists(ctx.root, "docker-compose.yaml") ||
      fileExists(ctx.root, "compose.yml") ||
      fileExists(ctx.root, "compose.yaml");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan() {
    return [
      {
        type: "create-file" as const,
        path: "docker-compose.yml",
        content: `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
    restart: unless-stopped

  # Uncomment to add a database
  # db:
  #   image: postgres:16-alpine
  #   environment:
  #     POSTGRES_USER: app
  #     POSTGRES_PASSWORD: secret
  #     POSTGRES_DB: app
  #   ports:
  #     - "5432:5432"
  #   volumes:
  #     - db-data:/var/lib/postgresql/data

# volumes:
#   db-data:
`,
        skipIfExists: true,
      },
    ];
  },
};

export default dockerComposeModule;
