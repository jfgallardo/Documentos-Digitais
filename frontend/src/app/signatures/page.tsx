import { CONFIG } from "@/config-global";
import SignaturesView from "@/sections/signatures/view/signatures-view";

// ----------------------------------------------------------------------

export const metadata = { title: `Signatures - ${CONFIG.site.name}` };

export default function Page() {
  return <SignaturesView />;
}
