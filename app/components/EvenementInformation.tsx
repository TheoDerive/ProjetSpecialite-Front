import React from "react";
import { useAppStore } from "~/datas/store";
import type { EvenementType } from "~/hooks/useEvenements";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";
import { formatDate } from "~/utils/formatDate";

export default function EvenementInformation({
  evenement,
  updateEvenementSelect,
}: {
  evenement: EvenementType;
  updateEvenementSelect: (value: EvenementType | false) => void;
}) {
  const [userDemand, setUserDemand] = React.useState(false)
  const [userCanDemand, setUserCanDemand] = React.useState(true)
  const [membresRoles, setMembresRoles] = React.useState([])
  const containerRef = React.useRef<HTMLElement>(null);

  const store = useAppStore()

  const date = new Date(evenement.date);

  const { data, error, isPending } = useGetRole.getRoles({
    resultParams: [],
    filterParams: [{ name: "Id_Evenement", value: evenement.id }],
  });

  React.useEffect(() => {
    setMembresRoles(data || [])

    if(data !== undefined && store.user !== undefined){
      const userHasDemand = data.filter((d: GetRoleType) => d.Id_Membre === store.user.id && d.is_valid === null)
      console.log()
      if(userHasDemand.length > 0){
        setUserDemand(true)
        setUserCanDemand(false)
      }


      const userCanDemand = data.filter((d: GetRoleType) => d.Id_Membre === store.user.id && d.is_valid !== null)
    
      if(userCanDemand.length > 0){
        setUserCanDemand(false)
      }
    }
  }, [data])

  function handleClick(event: MouseEvent) {
    if (containerRef && !containerRef.current?.contains(event.target as Node)) {
      containerRef.current.classList.add("remove");

      setTimeout(() => {
        updateEvenementSelect(false);
      }, 500);
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <section className="evenement-information-container" ref={containerRef}>
      <div
        className={`evenement-information-category ${evenement.type_eventName}`}
      >
        {evenement.categoryName}
      </div>
      <section className="evenement-information">
        <h2
          className={`evenement-information-title ${evenement.type_eventName}`}
        >
          {evenement.name}
        </h2>
        <p className="evenement-information-date">
          {formatDate(date.getDate())}/{formatDate(date.getMonth() + 1)} -{" "}
          {date.getHours()}h{formatDate(date.getMinutes())}
        </p>
        <p className="evenement-information-adresse">{evenement.adresse}</p>
      </section>

      <p className="evenement-information-description">{evenement.desc}</p>

      <section className="evenement-information-membres-container">
        <h3>Membres</h3>
        {membresRoles.map((membreRole) =>
          membreRole.is_valid ? (
            <article className="evenement-information-membre">
              <img
                src={membreRole.membre.image_url}
                className="evenement-information-membre-image"
              />
              <p>
                {membreRole.membre.firstname} {membreRole.membre.lastname} -{" "}
                {membreRole.Id_roles}
              </p>
            </article>
          ) : null
        )}

        {
          userDemand ? 
            <article className="evenement-information-membre">
              <img
                src={store.user?.image_url}
                className="evenement-information-membre-image"
              />
              <p>
                {store.user?.firstname} {store.user?.lastname} - En Attente
              </p>
            </article>
            : null
        }

        {
          userCanDemand ? <p>Demander</p> : null
        }
      </section>
    </section>
  );
}
