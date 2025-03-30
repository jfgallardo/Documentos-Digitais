"use client";
import { useEffect } from "react";
import { useDashboardContext } from "../hook/use-dashboard-context";
import LoadingScreen from "@/components/loading-screen/loading-screen";
import ListDocuments from "../list-documents";
import { CreateDocument } from "../create-document";
import { useAuthContext } from "@/auth/hooks";
import { useTranslations } from "next-intl";

export function DashboardView() {
  const { documents, loadingDocuments, getDocuments } = useDashboardContext();
  const { user, checkUserSession } = useAuthContext();
  const t = useTranslations("DashboardView");

  useEffect(() => {
    const handleInit = async () => {
      try {
        await checkUserSession();
      } catch (e) {
        console.error(e);
      }
    };
    handleInit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleInit = async (owner: string) => {
      try {
        await getDocuments?.(owner);
      } catch (e) {
        console.error(e);
      }
    };

    if (user?.id) {
      handleInit(user?.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  if (loadingDocuments) {
    return <LoadingScreen text="Preparando documentos para firma..." />;
  }

  return (
    <>
      <div className="flex flex-col space-y-2 xl:flex-row xl:justify-around items-center mb-7 w-full">
        <h1 className="text-xl sm:text-3xl font-bold text-center px-1.5">
          {t("title")}
        </h1>
        {user?.id && (
          <CreateDocument
            ownerId={user?.id}
            onUpload={() => getDocuments?.(user?.id)}
          />
        )}
      </div>
      {user?.id && (
        <ListDocuments
          documents={documents}
          onReset={() => getDocuments?.(user?.id)}
        />
      )}
    </>
  );
}
