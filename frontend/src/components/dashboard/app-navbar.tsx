import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import SignOut from "../auth/sign-out";
import { auth } from "@/lib/auth";
import Image from "next/image";
import LocaleSwitcher from "../i18n/LocaleSwitcher";

export default async function AppNavbar() {
  const session = await auth();
  return (
    <NavigationMenu className="ml-auto p-5">
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className="flex items-center gap-2">
            <SignOut />
            {session?.user?.image && (
              <div className="flex items-center justify-center">
                <Image
                  src={session.user.image}
                  alt="user"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </div>
            )}
            <LocaleSwitcher />
          </div>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
