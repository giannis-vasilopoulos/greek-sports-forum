/** SEO spec: seo/pages/privacy.md */
import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { buildWebPageJsonLd } from "@/lib/seo/json-ld";
import { buildPrivacyMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPrivacyMetadata();

const CONTACT_EMAIL = "privacy@kerkida.gr";

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={buildWebPageJsonLd({
          name: "Πολιτική απορρήτου | ΚΕΡΚΙΔΑ",
          description:
            "Πώς η ΚΕΡΚΙΔΑ συλλέγει και προστατεύει τα προσωπικά σας δεδομένα.",
          path: "/privacy",
        })}
      />
      <div className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
        <header className="mb-10 space-y-3">
          <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            Πολιτική απορρήτου
          </h1>
          <p className="text-sm text-muted-foreground">
            Τελευταία ενημέρωση: 30 Μαΐου 2026
          </p>
        </header>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-foreground">
          <section className="space-y-3">
            <h2 className="text-xl font-medium">1. Ποιοι είμαστε</h2>
            <p className="text-muted-foreground">
              Η ΚΕΡΚΙΔΑ («εμείς», «η πλατφόρμα») είναι μια ελληνική διαδικτυακή
              κοινότητα φιλάθλων. Η παρούσα πολιτική εξηγεί πώς συλλέγουμε,
              χρησιμοποιούμε και προστατεύουμε τα προσωπικά σας δεδομένα όταν
              χρησιμοποιείτε τον ιστότοπό μας.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">2. Δεδομένα που συλλέγουμε</h2>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                Στοιχεία λογαριασμού (όνομα, email, όνομα χρήστη) όταν
                εγγράφεστε ή συνδέεστε.
              </li>
              <li>
                Περιεχόμενο που δημοσιεύετε (threads, απαντήσεις, προτιμήσεις
                ομάδων).
              </li>
              <li>
                Τεχνικά δεδομένα (διεύθυνση IP, τύπος browser, συσκευή) για
                ασφάλεια και λειτουργία.
              </li>
              <li>
                Δεδομένα cookies και παρόμοια τεχνολογίες, σύμφωνα με τις
                επιλογές σας στο banner cookies.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">3. Cookies και κατηγορίες</h2>
            <p className="text-muted-foreground">
              Χρησιμοποιούμε cookies για να λειτουργεί ο ιστότοπος και, με τη
              συγκατάθεσή σας, για αναλυτικά στοιχεία και διαφημίσεις.
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
              <li>
                <strong className="text-foreground">Απαραίτητα:</strong>{" "}
                απαιτούνται για σύνδεση, ασφάλεια και βασική λειτουργία.
              </li>
              <li>
                <strong className="text-foreground">Αναλυτικά:</strong> βοηθούν
                στην κατανόηση της χρήσης του ιστότοπου (π.χ. Google Analytics),
                μόνο με τη συγκατάθεσή σας.
              </li>
              <li>
                <strong className="text-foreground">Διαφημίσεις:</strong>{" "}
                επιτρέπουν την εμφάνιση διαφημίσεων (π.χ. Google AdSense), μόνο
                με τη συγκατάθεσή σας.
              </li>
            </ul>
            <p className="text-muted-foreground">
              Μπορείτε να αλλάξετε τις προτιμήσεις σας ανά πάσα στιγμή μέσω του
              κουμπιού «Cookies» στο κάτω μέρος της οθόνης.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">4. Διαφημιστικοί συνεργάτες</h2>
            <p className="text-muted-foreground">
              Για την προβολή διαφημίσεων ενδέχεται να συνεργαζόμαστε με τον
              Google AdSense. Ο Google ενδέχεται να χρησιμοποιεί cookies και
              παρόμοια τεχνολογίες για την εμφάνιση και μέτρηση διαφημίσεων.
              Διαφημίσεις φορτώνονται μόνο αφού δώσετε συγκατάθεση στην
              κατηγορία «Διαφημίσεις».
            </p>
            <p className="text-muted-foreground">
              Περισσότερες πληροφορίες:{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-4"
              >
                Πολιτική απορρήτου Google
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">5. Νομική βάση και σκοπός</h2>
            <p className="text-muted-foreground">
              Επεξεργαζόμαστε δεδομένα για την παροχή της υπηρεσίας (σύμβαση),
              έννομα συμφέροντα (ασφάλεια, βελτίωση πλατφόρμας) και, όπου
              απαιτείται, τη συγκατάθεσή σας (cookies marketing/analytics,
              GDPR).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">6. Διατήρηση δεδομένων</h2>
            <p className="text-muted-foreground">
              Διατηρούμε τα δεδομένα λογαριασμού όσο ο λογαριασμός σας είναι
              ενεργός. Τεχνικά logs διατηρούνται για περιορισμένο χρονικό
              διάστημα για ασφάλεια. Μπορείτε να ζητήσετε διαγραφή λογαριασμού
              επικοινωνώντας μαζί μας.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">7. Τα δικαιώματά σας</h2>
            <p className="text-muted-foreground">
              Σύμφωνα με τον GDPR, έχετε δικαίωμα πρόσβασης, διόρθωσης,
              διαγραφής, περιορισμού, φορητότητας και εναντίωσης. Μπορείτε
              επίσης να ανακαλέσετε τη συγκατάθεση για cookies χωρίς να
              επηρεαστεί η νομιμότητα της προηγούμενης επεξεργασίας.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-medium">8. Επικοινωνία</h2>
            <p className="text-muted-foreground">
              Για ερωτήσεις σχετικά με την προστασία δεδομένων, επικοινωνήστε
              στο{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-primary underline underline-offset-4"
              >
                {CONTACT_EMAIL}
              </a>{" "}
              ή μέσω της{" "}
              <Link
                href="/contact"
                className="text-primary underline underline-offset-4"
              >
                σελίδας επικοινωνίας
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
