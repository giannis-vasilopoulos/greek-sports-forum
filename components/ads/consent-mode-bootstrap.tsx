import { CONSENT_MODE_DEFAULT_SCRIPT } from "@/lib/ads/consent-mode";

export function ConsentModeBootstrap() {
  return (
    <script
      id="consent-mode-default"
      dangerouslySetInnerHTML={{ __html: CONSENT_MODE_DEFAULT_SCRIPT }}
    />
  );
}
