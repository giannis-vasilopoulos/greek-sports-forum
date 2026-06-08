import { fetchSlgr } from "@/lib/slgr/fetch";
import { parseSlgrLeagueLogo } from "@/lib/slgr/parse-league-logo";

export async function fetchSlgrLeagueLogo(): Promise<string | null> {
  const html = await fetchSlgr("/el/");
  return parseSlgrLeagueLogo(html);
}
