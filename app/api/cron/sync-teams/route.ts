// Αν χρησιμοποιείς Vercel Cron ή παρόμοιο:
// app/api/cron/sync-teams/route.ts
import { seed } from "@/db/seed";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  await seed();
  return Response.json({ ok: true });
}
