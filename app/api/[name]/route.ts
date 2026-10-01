// Jembatan tipis: menjalankan handler lama di /api/*.js (login, logout, stats)
// di dalam Next.js, tanpa mengubah isi file handler maupun lib/auth.js.
// Admin tetap memanggil URL yang sama: /api/login, /api/stats, /api/logout.
import type { NextRequest } from "next/server";
import detail from "../../../api/detail.js";
import login from "../../../api/login.js";
import logout from "../../../api/logout.js";
import pulse from "../../../api/pulse.js";
import stats from "../../../api/stats.js";
import toggle from "../../../api/toggle.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LegacyReq = {
  method: string;
  headers: Record<string, string>;
  query: Record<string, string>;
  body?: unknown;
};
type LegacyRes = {
  status(code: number): LegacyRes;
  setHeader(name: string, value: string): void;
  json(payload: unknown): void;
};
type LegacyHandler = (req: LegacyReq, res: LegacyRes) => unknown;

const handlers: Record<string, LegacyHandler> = { login, logout, stats, pulse, detail, toggle };

async function handle(
  request: NextRequest,
  ctx: { params: Promise<{ name: string }> },
) {
  const { name } = await ctx.params;
  if (!Object.hasOwn(handlers, name)) return new Response(null, { status: 404 });

  const req: LegacyReq = {
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    query: Object.fromEntries(request.nextUrl.searchParams.entries()),
  };
  if ((request.headers.get("content-type") ?? "").includes("json")) {
    try {
      req.body = await request.json();
    } catch {
      req.body = {};
    }
  }

  let statusCode = 200;
  let payload: unknown = {};
  const headers = new Headers();
  const res: LegacyRes = {
    status(code) {
      statusCode = code;
      return res;
    },
    setHeader(key, value) {
      headers.append(key, String(value));
    },
    json(body) {
      payload = body;
      headers.set("Content-Type", "application/json");
    },
  };

  try {
    await handlers[name](req, res);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error server." }, { status: 500 });
  }
  return new Response(JSON.stringify(payload), { status: statusCode, headers });
}

export { handle as GET, handle as POST };
