import { faCircleInfo, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import MembreInformation from "~/components/Admin/MembreInformation";
import Navbar from "~/components/Navbar";
import { apiMembre, type MembreType } from "~/hooks/apiMembre";
import { useEvenement, type EvenementType } from "~/hooks/useEvenements";

export default function AdminAnalistics() {
  const [membres, setMembres] = React.useState<MembreType[]>([]);
  const [evenements, setEvenements] = React.useState<EvenementType[]>([]);
  const [seeMembre, setSeeMembre] = React.useState<MembreType | null>(null)

  const MembreApi = useQuery({
    queryKey: ["membres", membres],
    queryFn: async () => {
      const res = await apiMembre.getMembres({
        resultParams: [],
        filterParams: [],
      });

      return res;
    },
  });

  React.useEffect(() => {
    setMembres(MembreApi.data || []);
  }, [MembreApi]);

  const EvenementApi = useQuery({
    queryKey: ["Event", evenements],
    queryFn: async () => {
      const res = await useEvenement.getEvenement({
        resultParams: [],
        filterParams: [],
      });

      return res;
    },
  });

  React.useEffect(() => {
    setEvenements(EvenementApi.data || []);
  }, [EvenementApi]);

  function getDate(value: string) {
    const splitDate = value.split("-");
    return `${splitDate[1]}/${splitDate[2].slice(0, 2)}`;
  }

  function getHour(value: string) {
    const splitDate = value.split("T");
    const time = splitDate[1].split(":");
    return `${time[0]}h${time[1]}`;
  }

  const deleteEvent = useMutation({
    mutationFn: async (id: number) => {
      const res = await useEvenement.deleteEvenement({ id });

      return res;
    },
    onSuccess: (data) => {
      console.log("Login success", data);
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  const deleteMembre = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiMembre.delete({ id });

      return res;
    },
    onSuccess: (data) => {
      console.log("Login success", data);
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  return (
    <>
      <Navbar />
      <main className="admin-panel">
        <h2>Administration</h2>

        <section className="admin-container">
          <section className="gerer-membres">
            <h3>Gerer les Membres</h3>
            {membres.map((membre) => (
              <article className="membre-container">
                <img className="membre-image" src={membre.image_url} />
                <p>
                  {membre.firstname} {membre.lastname} -{" "}
                  {membre.is_admin ? "Admin" : "Membre"}
                </p>
                <FontAwesomeIcon icon={faCircleInfo} className="info" onClick={() => setSeeMembre(membre)} />
                {membre.is_admin ? null : (
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="trash"
                    onClick={() => deleteMembre.mutate(membre.id)}
                  />
                )}
              </article>
            ))}
          </section>

          <section className="gerer-evenements">
            <h3>Evenements a venir</h3>
            {evenements.map((event) => (
              <article className="evenement-info">
                <p>{event.name}</p>
                <p>{getDate(event.date)}</p>
                <p>{getHour(event.date)}</p>
                <FontAwesomeIcon
                  className="trash"
                  icon={faTrash}
                  onClick={() => deleteEvent.mutate(event.id)}
                />
              </article>
            ))}
          </section>
        </section>

        {
          seeMembre ? <MembreInformation membre={seeMembre} setSeeMembre={setSeeMembre} /> : null
        }
      </main>
    </>
  );
}
