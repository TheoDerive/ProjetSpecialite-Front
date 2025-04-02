import Calendrier from "~/components/Calendrier";
import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { useAppStore } from "~/datas/store";
import React from "react";
import { getLocalhost } from "~/utils/getLocalHost";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Projet Specialiter" }];
}

export default function Home() {
  const store = useAppStore();

  React.useEffect(() => {
    store.setUser(getLocalhost("user"))
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Calendrier />
      </main>
    </>
  );
}
