import Link from "next/link";

import { Button } from "@/components/ui/button";

export function JoinCtaSection() {
  return (
    <section
      aria-labelledby="join-cta-heading"
      className="overflow-hidden rounded-2xl bg-primary px-6 py-10 text-center text-primary-foreground shadow-md md:px-12 md:py-14"
    >
      <h2
        id="join-cta-heading"
        className="text-2xl font-bold tracking-tight md:text-3xl"
      >
        Έλα στην κερκίδα
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-base text-primary-foreground/85 md:text-lg">
        Δημιούργησε fan profile για κάθε league που σε ενδιαφέρει και μπες στη
        συζήτηση με χιλιάδες Έλληνες φιλάθλους.
      </p>
      <div className="mt-8 flex justify-center">
        <Button
          variant="cta"
          size="lg"
          asChild
          className="min-w-[200px] shadow-sm"
        >
          <Link href="/sign-up">Ξεκίνα δωρεάν</Link>
        </Button>
      </div>
    </section>
  );
}
