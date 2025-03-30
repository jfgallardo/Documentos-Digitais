"use client";

import { IconFileOff } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// ----------------------------------------------------------------------

export function NotFoundView() {
  const router = useRouter();
  const t = useTranslations("ErrorPage");

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 text-center">
      <IconFileOff className="w-16 h-16 text-red-500 mb-4" />

      <h1 className="text-2xl font-semibold text-gray-800">{t("title")}</h1>
      <p className="text-gray-600 mt-2">{t("description")}</p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        {t("button")}
      </button>
    </div>
  );
}
