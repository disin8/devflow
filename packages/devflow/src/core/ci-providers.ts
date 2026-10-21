import type { CIProvider } from "./types.js";

export const CI_PROVIDER_MODULES: Record<CIProvider, string[]> = {
  github: ["github-actions"],
  gitlab: ["gitlab-ci"],
  both: ["github-actions", "gitlab-ci"],
};

export const CI_PROVIDERS = Object.keys(CI_PROVIDER_MODULES) as CIProvider[];

export function isCiProvider(value: string): value is CIProvider {
  return Object.prototype.hasOwnProperty.call(CI_PROVIDER_MODULES, value);
}
