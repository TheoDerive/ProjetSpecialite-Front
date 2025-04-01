import React from "react";
import type { EvenementType } from "~/hooks/useEvenements";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";
import { formatDate } from "~/utils/formatDate";

export default function EvenementInformation({
  evenement,
  updateEvenementSelect
}: {
  evenement: EvenementType;
    updateEvenementSelect: (value: EvenementType | false) => void
}) {
  const containerRef = React.useRef<HTMLElement>(null)

  const date = new Date(evenement.date);

  const { data, error, isPending } = useGetRole.getEvenement({
    resultParams: [],
    filterParams: [{ name: "Id_Evenement", value: evenement.id }],
  });
  const membresRoles: GetRoleType[] = data || [];

  function handleClick(event: MouseEvent) {
    if(containerRef && !containerRef.current?.contains(event.target as Node)){
      containerRef.current.classList.add("remove")

      setTimeout(()=> {
        updateEvenementSelect(false)
      }, 500)
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleClick)

    return () => document.removeEventListener("click", handleClick)
  }, [])

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
          {formatDate(date.getDay() - 1)}/{formatDate(date.getMonth() + 1)} -{" "}
          {date.getHours()}h{formatDate(date.getMinutes())}
        </p>
        <p className="evenement-information-adresse">{evenement.adresse}</p>
      </section>

      <p className="evenement-information-description">{evenement.desc}</p>

      <section className="evenement-information-membres-container">
        <h3>Membres</h3>
        {membresRoles.map((membreRole) =>
          membreRole.is_valid ?
          <article className="evenement-information-membre">
            <img src={membreRole.membre.image_url} className="evenement-information-membre-image" />
              <p>{membreRole.membre.firstname} {membreRole.membre.lastname} - {membreRole.Id_roles}</p>
          </article>
          : null
        )}
      </section>
    </section>
  );
}
