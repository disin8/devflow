import type {
  DevFlowModule,
  ModuleAction,
  ProjectContext,
} from "../../core/types.js";
import { fileExists } from "../../core/fs-utils.js";

function buildDockerfile(ctx: ProjectContext): string {
  const pm = ctx.pm;
  const lockFile =
    pm === "pnpm"
      ? "pnpm-lock.yaml"
      : pm === "yarn"
        ? "yarn.lock"
        : pm === "bun"
          ? "bun.lockb"
          : "package-lock.json";
  const installCmd =
    pm === "pnpm"
      ? "corepack enable && pnpm install --frozen-lockfile"
      : pm === "yarn"
        ? "corepack enable && yarn install --frozen-lockfile"
        : pm === "bun"
          ? "bun install --frozen-lockfile"
          : "npm ci";
  // `bun build` is Bun's bundler, so the script has to be invoked explicitly.
  const buildCmd = pm === "npm" ? "npm run build" : `${pm} run build`;
  const prodInstall =
    pm === "pnpm"
      ? "corepack enable && pnpm install --frozen-lockfile --prod"
      : pm === "yarn"
        ? "corepack enable && yarn install --frozen-lockfile --production"
        : pm === "bun"
          ? "bun install --frozen-lockfile --production"
          : "npm ci --omit=dev";

  return `# ── Build stage ──────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ${lockFile} ./
RUN ${installCmd}

COPY . .
RUN ${buildCmd}

# ── Production stage ─────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \\
 && adduser  --system --uid 1001 appuser

COPY --from=builder /app/package.json /app/${lockFile} ./
RUN ${prodInstall}

COPY --from=builder /app/dist ./dist

USER appuser
EXPOSE 3000
CMD ["node", "dist/index.js"]
`;
}

const dockerfileModule: DevFlowModule = {
  id: "dockerfile",
  name: "Dockerfile",
  description: "Multi-stage Dockerfile optimised for Node.js",
  category: "docker",

  async detect(ctx) {
    const has = fileExists(ctx.root, "Dockerfile");
    return { applicable: true, alreadyConfigured: has };
  },

  async plan(ctx) {
    return [
      {
        type: "create-file" as const,
        path: "Dockerfile",
        content: buildDockerfile(ctx),
        skipIfExists: true,
      },
    ];
  },
};

export default dockerfileModule;
