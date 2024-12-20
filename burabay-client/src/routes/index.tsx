import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "../pages/init/WelcomePage";

export const Route = createFileRoute("/")({
    component: WelcomePage
});


