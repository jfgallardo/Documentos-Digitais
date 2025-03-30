import { CONFIG } from '@/config-global';
import Error401 from '@/sections/error/401-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `401 Unauthorized! | Error - ${CONFIG.site.name}`,
};

export default function Page() {
  return <Error401 />;
}
