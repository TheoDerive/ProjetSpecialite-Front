import {
  faComment,
  faMicrophone,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import type { MembreType } from "~/hooks/apiMembre";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";

export default function MembreInformation({ membre, setSeeMembre }: { membre: MembreType, setSeeMembre: (value: MembreType | null) => void }) {
  const [participationsInfo, setParticipationsInfo] = React.useState<
    GetRoleType[]
  >([]);
  const [demandes, setDemandes] = React.useState<number>(0);
  const [participations, setParticipations] = React.useState<number>(0);

  const containerRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSeeMembre(null)
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const { data } = useQuery({
    queryKey: ["participation", participationsInfo],
    queryFn: async () => {
      const res = await useGetRole.getRoles({
        resultParams: [],
        filterParams: [
          {
            name: "Id_Membre",
            value: membre.id,
          },
        ],
        needFetch: true,
      });

      return res as GetRoleType[];
    },
  });

  React.useEffect(() => {
    if (!data) return;
    console.log(data);

    setParticipationsInfo(data || []);

    setDemandes(data.length);

    const demandesValid = data.filter((d) => d.is_valid !== null);
    setParticipations(demandesValid.length);
  }, [data]);

  function getDate(value: string) {
    const splitDate = value.split("-");
    return `${splitDate[1]}/${splitDate[2].slice(0, 2)}`;
  }

  function getHour(value: string) {
    const splitDate = value.split("T");
    const time = splitDate[1].split(":");
    return `${time[0]}h${time[1]}`;
  }

  return (
    <section className="membre-information-container" ref={containerRef}>
      <section className="membre-main-information">
        <img src={membre.image_url} className="membre-main-information-image" />
        <div>
          <p>
            {membre.firstname} {membre.lastname}
          </p>
          <p>{membre.email}</p>
        </div>
      </section>
      <div className="participation-info">
        <article className="participation">
          <FontAwesomeIcon icon={faMicrophone} />

          <div className="user-information-global-participation">
            <p className="user-information-global-participation-title">
              Nombre de participation
            </p>
            <p className="user-information-global-participation-number">
              {participations}
            </p>
          </div>
        </article>

        <article className="demandes">
          <FontAwesomeIcon icon={faComment} />

          <div className="user-information-global-participation">
            <p className="user-information-global-participation-title">
              Nombre de demandes
            </p>
            <p className="user-information-global-participation-number">
              {demandes}
            </p>
          </div>
        </article>
      </div>

      <h3>Precidentes participations:</h3>
      <div className="participations-container">
        {participationsInfo.map((p) => (
          <article className="evenement-info">
            <p>{p.evenement.name}</p>
            <p>{getDate(p.evenement.date)}</p>
            <p>{getHour(p.evenement.date)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
