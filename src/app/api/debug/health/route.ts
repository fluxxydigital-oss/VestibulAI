import { NextRequest } from "next/server";
import { getPrisma } from "@/lib/prisma";

/**
 * GET /api/debug/health
 * Diagnostic endpoint — tests database connection and env vars.
 * REMOVE THIS IN PRODUCTION after debugging!
 */
export async function GET(request: NextRequest) {
  const diagnostics: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL_exists: !!process.env.DATABASE_URL,
      DATABASE_URL_preview: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.replace(/:[^@]+@/, ":***@")
        : "NOT SET",
      DIRECT_URL_exists: !!process.env.DIRECT_URL,
      JWT_SECRET_exists: !!process.env.JWT_SECRET,
      NEXTAUTH_SECRET_exists: !!process.env.NEXTAUTH_SECRET,
      NODE_ENV: process.env.NODE_ENV,
    },
    database: { status: "untested" },
  };

  try {
    const prisma = getPrisma();
    const userCount = await prisma.user.count();
    diagnostics.database = {
      status: "connected",
      userCount,
    };
  } catch (error: any) {
    diagnostics.database = {
      status: "error",
      message: error?.message || "Unknown error",
      code: error?.code || "N/A",
    };
  }

  return new Response(JSON.stringify(diagnostics, null, 2), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
