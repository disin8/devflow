import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { join } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { readFileSafe, writeFileSafe, fileExists, collectFiles } from '../core/fs-utils.js';
import { makeTempDir, removeDir, writeFile } from '../test/helpers.js';
import { setDryRun } from '../core/logger.js';

describe('readFileSafe', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); setDryRun(false); });
  afterEach(() => removeDir(dir));

  it('returns file content when file exists', () => {
    writeFile(dir, 'hello.txt', 'world');
    expect(readFileSafe(join(dir, 'hello.txt'))).toBe('world');
  });

  it('returns undefined when file is missing', () => {
    expect(readFileSafe(join(dir, 'nope.txt'))).toBeUndefined();
  });
});

describe('writeFileSafe', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); setDryRun(false); });
  afterEach(() => removeDir(dir));

  it('writes a file and creates intermediate directories', () => {
    const abs = join(dir, 'deep', 'nested', 'file.txt');
    writeFileSafe(abs, 'content');
    expect(readFileSync(abs, 'utf-8')).toBe('content');
  });

  it('in dry-run mode does NOT write', () => {
    setDryRun(true);
    const abs = join(dir, 'dry.txt');
    const written = writeFileSafe(abs, 'should-not-exist');
    expect(written).toBe(false);
    expect(existsSync(abs)).toBe(false);
    setDryRun(false);
  });
});

describe('fileExists', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); });
  afterEach(() => removeDir(dir));

  it('returns true when file is present', () => {
    writeFile(dir, 'exists.txt', '');
    expect(fileExists(dir, 'exists.txt')).toBe(true);
  });

  it('returns false when file is absent', () => {
    expect(fileExists(dir, 'missing.txt')).toBe(false);
  });
});

describe('collectFiles', () => {
  let dir: string;
  beforeEach(() => { dir = makeTempDir(); });
  afterEach(() => removeDir(dir));

  it('lists files recursively with relative paths', () => {
    writeFile(dir, 'a.ts', '');
    writeFile(dir, 'src/b.ts', '');
    writeFile(dir, 'src/sub/c.ts', '');
    const files = collectFiles(dir);
    expect(files.has('a.ts')).toBe(true);
    expect(files.has('src/b.ts')).toBe(true);
    expect(files.has('src/sub/c.ts')).toBe(true);
  });

  it('skips node_modules and .git directories', () => {
    writeFile(dir, 'src/index.ts', '');
    writeFile(dir, 'node_modules/dep/index.js', '');
    writeFile(dir, '.git/config', '');
    const files = collectFiles(dir);
    const arr = [...files];
    expect(arr.some((f) => f.includes('node_modules'))).toBe(false);
    expect(arr.some((f) => f.includes('.git'))).toBe(false);
  });

  it('returns empty set for non-existent directory', () => {
    expect(collectFiles(join(dir, 'does-not-exist'))).toEqual(new Set());
  });
});
