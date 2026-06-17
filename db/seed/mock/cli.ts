import "dotenv/config";
import { pathToFileURL } from "node:url";

function isDirectExecution(metaUrl: string): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return metaUrl === pathToFileURL(entry).href;
  } catch {
    return false;
  }
}

export function runSeedCli(metaUrl: string, seedFn: () => Promise<unknown>) {
  if (!isDirectExecution(metaUrl)) return;
  seedFn()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
