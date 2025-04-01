import Calendrier from "~/components/Calendrier";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Projet Specialiter" },
  ];
}

export default function Home() {
  return <>
    <Calendrier />
  </>;
}
