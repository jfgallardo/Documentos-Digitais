"use client";
import { signOut } from "next-auth/react";
import { Button } from "../ui/button";
import { IconLogout2 } from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";

export default function SignOut() {
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    redirect("/sign-in");
  };
  const t = useTranslations("SignOut");
  return (
    <div className="flex justify-center">
      <Button variant="ghost" onClick={handleSignOut}>
        {t("label")}
        <IconLogout2 />
      </Button>
    </div>
  );
}
