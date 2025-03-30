import PublicLayout from '@/layouts/public/layout';

type Props = {
  children: React.ReactNode;
};

export default async function Layout({ children }: Props) {
  return <PublicLayout>{children}</PublicLayout>;
}
