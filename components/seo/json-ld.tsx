import type { JsonLd } from "@/lib/seo/json-ld";

interface JsonLdProps {
  data: JsonLd;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
