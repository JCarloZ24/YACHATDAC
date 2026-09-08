import { PageLoader } from "@/components/ui/PageLoader";

/**
 * The Living Work loading screen. The panel itself moved to
 * components/ui/PageLoader on 8 Sep 2026 so Wonder could share it; this is
 * the page's binding, nothing more.
 */
export function LivingWorkLoader() {
  return <PageLoader name="Living Work" />;
}
