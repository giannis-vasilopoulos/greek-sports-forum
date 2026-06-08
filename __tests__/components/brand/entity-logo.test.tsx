import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test stub for next/image
    <img src={src} alt={alt} />
  ),
}));

import { EntityLogo } from "@/components/brand/entity-logo";

describe("EntityLogo", () => {
  it("renders fallback when src is missing", () => {
    render(<EntityLogo alt="Ομάδα" fallback="⚽" />);
    expect(screen.getByText("⚽")).toBeInTheDocument();
  });

  it("renders image when src is provided", () => {
    render(
      <EntityLogo
        src="https://cdn.test/teams/a.png"
        alt="Ομάδα"
        fallback="⚽"
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://cdn.test/teams/a.png",
    );
  });
});
