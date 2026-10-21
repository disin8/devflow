export const SITE_URL = "https://dev-flow.xyz";
export const SITE_NAME = "DevFlow";
export const SITE_BRAND = "DevFlow CLI";
export const SITE_TAGLINE = "Developer workflow setup for TypeScript, React, Node.js and monorepos";

export const NPM_PACKAGE = "create-devflow";
export const NPM_URL = `https://www.npmjs.com/package/${NPM_PACKAGE}`;
export const NPM_REGISTRY_URL = `https://registry.npmjs.org/${NPM_PACKAGE}`;

export const GITHUB_URL = "https://github.com/disin8/devflow";
export const GITHUB_API_URL = "https://api.github.com/repos/disin8/devflow";
export const GITHUB_ISSUES_URL = `${GITHUB_URL}/issues`;
export const GITHUB_RELEASES_URL = `${GITHUB_URL}/releases`;
export const GITHUB_BLOBS_URL = `${GITHUB_URL}/blob/main`;

export const INSTALL_COMMAND = "npx create-devflow";
export const DRY_RUN_COMMAND = "npx create-devflow --dry-run";

export const LICENSE = "MIT";
export const LICENSE_URL = `${GITHUB_BLOBS_URL}/LICENSE`;

export const REPO_OWNER = "disin8";
export const SUPPORT_EMAIL = "dmitry.sin8@gmail.com";

export const SOCIAL_PROFILES = {
  github: GITHUB_URL,
  npm: NPM_URL,
};

export const SUPPORTED_NODE_VERSIONS = [18, 20, 22];
export const SUPPORTED_PACKAGE_MANAGERS = ["npm", "pnpm", "yarn", "bun"];
export const SUPPORTED_OS = ["macOS", "Linux", "Windows (WSL2)"];

export const MODULE_COUNT = 50;
export const CATEGORY_COUNT = 10;

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
