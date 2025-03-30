"use client";

import { IconExclamationCircle } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Error401() {
  const router = useRouter();
  const t = useTranslations("Error401");

  useEffect(() => {
    const timer = setTimeout(async () => {
      await handleLogout();
    }, 3000);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <IconExclamationCircle className="w-16 h-16 text-red-600" />
      <h1 className="text-4xl font-bold text-red-600 mt-4">{t("title")}</h1>
      <p className="mt-4 text-lg">{t("description")}</p>
      <p className="mt-2 text-sm text-gray-500">{t("redirect")}</p>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {t("button")}
      </button>
    </div>
  );
}
