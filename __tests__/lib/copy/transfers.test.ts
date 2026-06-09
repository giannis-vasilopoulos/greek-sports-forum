import { describe, expect, it } from "vitest";

import { formatTransferFee } from "@/lib/copy/transfers";

describe("formatTransferFee", () => {
  it("maps API fee types to Greek labels", () => {
    expect(formatTransferFee("Free")).toBe("Ελεύθερος");
    expect(formatTransferFee("Loan")).toBe("Δανεισμός");
    expect(formatTransferFee("N/A")).toBe("Άγνωστο");
    expect(formatTransferFee("€ 5M")).toBe("€ 5M");
    expect(formatTransferFee(null)).toBe("—");
  });
});
