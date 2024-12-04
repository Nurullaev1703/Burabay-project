import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "../../pages/profile/Profile";
import { Loader } from "../../components/Loader";
import { useGetProfile } from "../../pages/profile/profile-util";
import { roleService } from "../../services/storage/Factory";
import { useTranslation } from "react-i18next";
import { ClientProfile } from "../../pages/client-profile/ClientProfile";
import { NoneProfile } from "../../pages/client-profile/NoneProfile";

export const Route = createFileRoute("/profile/")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const { t } = useTranslation();
  const role = roleService.getValue();
  const { data, isLoading } = useGetProfile();
  if (isLoading) return <Loader />;

  if (data) {
    switch (role) {
      case t("providerRole"):
        return <Profile user={data} />;
      case t("buyerRole"):
        return <ClientProfile user={data} />;
      case t("noneRole"):
        return <NoneProfile />;
    }
  }
}
