import { createFileRoute } from "@tanstack/react-router";
import { Profile } from "../pages/profile/Profile";
import { useGetProfile } from "../pages/profile/profile-util";
import { Loader } from "../components/Loader";

export const Route = createFileRoute("/")({
    component: ProfileRoute
});

function ProfileRoute() {
    const { data, isLoading } = useGetProfile()

    if (isLoading) return <Loader />

    if (data)
        return <Profile user={data} />
}

