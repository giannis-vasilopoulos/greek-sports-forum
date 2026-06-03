import { syncStandings } from "@/lib/standings/sync";
import { runDbOrThrow } from "@/lib/db/run";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const result = await runDbOrThrow(() => syncStandings());
    return Response.json(result);
  } catch (e) {
    console.error(e);
    return Response.json({ error: "sync_failed" }, { status: 500 });
  }
}
