import { CONFIG } from '@/config-global';
import { NotFoundView } from '@/sections/error/not-found-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `404 page not found! | Error - ${CONFIG.site.name}`,
};

export default function Page() {
  return <NotFoundView />;
}
