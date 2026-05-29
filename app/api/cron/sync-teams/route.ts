// Αν χρησιμοποιείς Vercel Cron ή παρόμοιο:
// app/api/cron/sync-teams/route.ts
import { seed } from "@/db/seed";
import { runDbOrThrow } from "@/lib/db/run";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    await runDbOrThrow(() => seed());
    return Response.json({ ok: true });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "sync_failed" }, { status: 500 });
  }
}
