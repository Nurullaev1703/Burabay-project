import { createFileRoute } from "@tanstack/react-router";
import { UseGetFavorites } from "../../pages/favorites/favorites-util";
import { Loader } from "../../components/Loader";
import { Favorites } from "../../pages/favorites/Favorites";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isLoading } = UseGetFavorites();
  if (isLoading) return <Loader />;
  if (data) return <Favorites favoritesList={data} />;
}
