import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { detectProject } from '../core/context.js';
import { makeTempDir, removeDir, writeFile, writePackageJson, writeLockFile } from '../test/helpers.js';

describe('detectProject – package manager detection', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); writePackageJson(dir); });
  afterEach(() => removeDir(dir));

  it('detects pnpm via pnpm-lock.yaml', () => {
    writeLockFile(dir, 'pnpm');
    expect(detectProject(dir).pm).toBe('pnpm');
  });

  it('detects yarn via yarn.lock', () => {
    writeLockFile(dir, 'yarn');
    expect(detectProject(dir).pm).toBe('yarn');
  });

  it('detects bun via bun.lockb', () => {
    writeLockFile(dir, 'bun');
    expect(detectProject(dir).pm).toBe('bun');
  });

  it('falls back to npm when no lock file', () => {
    expect(detectProject(dir).pm).toBe('npm');
  });

  it('respects forced pm over lock file', () => {
    writeLockFile(dir, 'pnpm');
    expect(detectProject(dir, 'yarn').pm).toBe('yarn');
  });

  it('detects pm from packageManager field', () => {
    writePackageJson(dir, { packageManager: 'pnpm@9.0.0' });
    expect(detectProject(dir).pm).toBe('pnpm');
  });
});

describe('detectProject – TypeScript detection', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); writePackageJson(dir); });
  afterEach(() => removeDir(dir));

  it('hasTypeScript=true when tsconfig.json present', () => {
    writeFile(dir, 'tsconfig.json', '{}');
    expect(detectProject(dir).hasTypeScript).toBe(true);
  });

  it('hasTypeScript=false when tsconfig.json absent', () => {
    expect(detectProject(dir).hasTypeScript).toBe(false);
  });
});

describe('detectProject – stack detection', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); });
  afterEach(() => removeDir(dir));

  it('detects react stack', () => {
    writePackageJson(dir, { dependencies: { react: '^18' } });
    expect(detectProject(dir).stack).toBe('react');
  });

  it('detects nextjs stack (takes priority over react)', () => {
    writePackageJson(dir, { dependencies: { next: '^14', react: '^18' } });
    expect(detectProject(dir).stack).toBe('nextjs');
  });

  it('detects vue stack', () => {
    writePackageJson(dir, { dependencies: { vue: '^3' } });
    expect(detectProject(dir).stack).toBe('vue');
  });

  it('detects nestjs via @nestjs/core', () => {
    writePackageJson(dir, { dependencies: { '@nestjs/core': '^10' } });
    expect(detectProject(dir).stack).toBe('nestjs');
  });

  it('detects node stack as fallback (no known framework)', () => {
    writePackageJson(dir, { dependencies: { express: '^4' } });
    expect(detectProject(dir).stack).toBe('node');
  });
});

describe('detectProject – monorepo detection', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); writePackageJson(dir); });
  afterEach(() => removeDir(dir));

  it('detects nx from nx.json', () => {
    writeFile(dir, 'nx.json', '{}');
    const ctx = detectProject(dir);
    expect(ctx.repoType).toBe('monorepo');
    expect(ctx.monorepoTool).toBe('nx');
  });

  it('detects turborepo from turbo.json', () => {
    writeFile(dir, 'turbo.json', '{}');
    const ctx = detectProject(dir);
    expect(ctx.repoType).toBe('monorepo');
    expect(ctx.monorepoTool).toBe('turborepo');
  });

  it('detects custom monorepo from package.json workspaces array', () => {
    writePackageJson(dir, { workspaces: ['packages/*', 'apps/*'] });
    const ctx = detectProject(dir);
    expect(ctx.repoType).toBe('monorepo');
    expect(ctx.workspacePatterns).toContain('packages/*');
  });

  it('detects pnpm workspaces from pnpm-workspace.yaml', () => {
    writePackageJson(dir, {});
    writeFile(dir, 'pnpm-workspace.yaml', "packages:\n  - 'packages/*'\n  - 'apps/*'\n");
    const ctx = detectProject(dir);
    expect(ctx.repoType).toBe('monorepo');
    expect(ctx.workspacePatterns).toContain('packages/*');
  });

  it('single repo when no monorepo markers', () => {
    expect(detectProject(dir).repoType).toBe('single');
  });
});

describe('detectProject – no package.json', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); });
  afterEach(() => removeDir(dir));

  it('hasPackageJson=false', () => {
    expect(detectProject(dir).hasPackageJson).toBe(false);
  });

  it('stack is undefined', () => {
    expect(detectProject(dir).stack).toBeUndefined();
  });
});
