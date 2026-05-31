import { GoogleAnalytics } from "@next/third-parties/google";

import { getGa4MeasurementId } from "@/lib/ads/config";

export function Ga4Analytics() {
  const gaId = getGa4MeasurementId();
  if (!gaId) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}
