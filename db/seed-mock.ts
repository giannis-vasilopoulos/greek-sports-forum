import "dotenv/config";

import { seedMockFixtures } from "./seed/mock";

seedMockFixtures()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
