import { AuthProvider } from "@/auth/context/auth-provider";
import AppNavbar from "@/components/dashboard/app-navbar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardProvider } from "@/sections/dashboard/context";
import { SignaturesProvider } from "@/sections/signatures/context";
import { cookies } from "next/headers";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function PublicLayout({ children }: Props) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarTrigger />
      <main className="w-full">
        <AppNavbar />
        <AuthProvider>
          <DashboardProvider>
            <SignaturesProvider>{children}</SignaturesProvider>
          </DashboardProvider>
        </AuthProvider>
      </main>
    </SidebarProvider>
  );
}
