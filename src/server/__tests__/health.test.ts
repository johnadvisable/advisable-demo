// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn, ChildProcess } from 'node:child_process';
import path from 'node:path';
import * as axios from 'axios';

const TEST_PORT = 4010;
const BASE_URL = `http://localhost:${TEST_PORT}`;

let serverProc: ChildProcess | null = null;
let serverExited: { code: number | null; signal: NodeJS.Signals | null } | null = null;

async function waitForHealth(timeoutMs = 15000) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await axios.default.get(`${BASE_URL}/api/health`, { validateStatus: () => true });
      if (res.status === 200 && res.data?.ok) return true;
    } catch {
      // ignore until timeout
    }
    if (serverExited) return false; // child died
    if (Date.now() - start > timeoutMs) return false;
    await new Promise(r => setTimeout(r, 200));
  }
}

describe('Server health check', () => {
  beforeAll(async () => {
    const serverPath = path.resolve(process.cwd(), 'server.js');
    serverProc = spawn(process.execPath, [serverPath], {
      env: {
        ...process.env,
        NODE_ENV: 'test',
        PORT: String(TEST_PORT),
        FRONTEND_URL: 'http://localhost:8080',
        // Provide safe dummy SMTP to avoid connection attempts to real servers
        SMTP_HOST: process.env.SMTP_HOST || 'localhost',
        SMTP_PORT: process.env.SMTP_PORT || '2525',
        SMTP_USERNAME: process.env.SMTP_USERNAME || 'user',
        SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'pass',
        RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || 'test-secret',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    serverProc.stdout?.on('data', (d) => {
      process.stdout.write(`[server] ${d}`);
    });
    serverProc.stderr?.on('data', (d) => {
      process.stderr.write(`[server-err] ${d}`);
    });
    serverProc.on('exit', (code, signal) => {
      serverExited = { code, signal };
      process.stderr.write(`[server-exit] code=${code} signal=${String(signal)}\n`);
    });

    const healthy = await waitForHealth(20000);
    expect(healthy).toBe(true);
  }, 30000);

  afterAll(async () => {
    if (serverProc && !serverProc.killed) {
      serverProc.kill();
      await new Promise(r => setTimeout(r, 200));
    }
  });

  it('GET /api/health should return 200 with ok=true', async () => {
    const res = await axios.default.get(`${BASE_URL}/api/health`);
    expect(res.status).toBe(200);
    expect(res.data).toMatchObject({ ok: true });
    expect(typeof res.data.time).toBe('string');
  });
});
