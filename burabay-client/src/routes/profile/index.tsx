import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useGetProfile } from "../../pages/profile/profile-util";
import { Loader } from "../../components/Loader";
import { Profile } from "../../pages/profile/Profile";

export const Route = createFileRoute("/profile/")({
  component: ProfileRoute,
});

function ProfileRoute() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetProfile();
  if (isLoading) return <Loader />;

  if (data) {
        return <Profile user={data} />;
  }
}
