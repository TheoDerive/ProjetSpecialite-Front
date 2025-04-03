import React from "react";
import { useAppStore } from "~/datas/store";
import type { EvenementType } from "~/hooks/useEvenements";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";
import { formatDate } from "~/utils/formatDate";
import AskRole from "./AskRole";
import { useQuery } from "@tanstack/react-query";
import SetUserRole from "./Admin/setUserRole";
import { useAccount } from "~/hooks/useAccount";

export default function EvenementInformation({
  evenement,
  updateEvenementSelect,
  setDemanding,
}: {
  evenement: EvenementType;
  updateEvenementSelect: (value: EvenementType | false) => void;
  setDemanding: (value: boolean) => void;
}) {
  const [userDemand, setUserDemand] = React.useState<{name: string, value: GetRoleType[]}[]>([]);
  const [userCanDemand, setUserCanDemand] = React.useState(true);
  const [membresRoles, setMembresRoles] = React.useState([]);
  const containerRef = React.useRef<HTMLElement>(null);

  const { account } = useAccount()

  const date = new Date(evenement.date);

  const { data, error, isPending } = useQuery({
    queryKey: ["id", evenement],
    queryFn: async function () {
      const result = await useGetRole.getRoles({
        resultParams: [],
        filterParams: [{ name: "Id_Evenement", value: evenement.id }],
        needFetch: true,
      });
      return result;
    },
    enabled: Boolean(evenement?.id),
  });

  React.useEffect(() => {
    setMembresRoles(data || []);

    if (data !== undefined && account !== undefined) {
      const userHasDemand = data.filter(
        (d: GetRoleType) => d.is_valid === null
      );
      if (userHasDemand.length > 0) {
        const result = [] as { name: string; value: GetRoleType[] }[];

        userHasDemand.forEach((role: GetRoleType) => {
          // Cherche si un utilisateur existe déjà dans result
          const existingUser = result.find(
            (r) => r.name === `${role.membre.firstname} ${role.membre.lastname}`
          );

          if (existingUser) {
            // Si l'utilisateur existe, on ajoute le rôle dans 'value'
            existingUser.value.push(role);
          } else {
            // Si l'utilisateur n'existe pas, on crée un nouvel utilisateur dans result
            result.push({
              name: `${role.membre.firstname} ${role.membre.lastname}`,
              value: [role], // On met le premier rôle dans un tableau
            });
          }
        });
        setUserDemand(result);

      }

      const userDemand = data.filter((d: GetRoleType) => d.Id_Membre === account.Id_Membre)

      if(userDemand.length > 0) {
          setUserCanDemand(false)
      }

    }
  }, [data]);

  return (
    <section className="evenement-information-container" ref={containerRef}>
      <span className="close" onClick={() => updateEvenementSelect(false)}>
        close
      </span>
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
                {membreRole.roleName.name}
              </p>
            </article>
          ) : null
        )}

        {userDemand.map((user) => (
          <article className="evenement-information-membre">
            <img
              src={user.value[0].membre.image_url}
              className="evenement-information-membre-image"
            />
            <div>
              <p>
                {user.name} - En Attente
              </p>
              <p>{
                user.value.map(r => `${r.roleName.name} -`)
              }</p>
            </div>
            {
              account.is_admin !== null ? <SetUserRole getRoleInfo={user.value}  /> : null
            }
          </article>
        ))}

        {userCanDemand ? (
          <p onClick={() => setDemanding(true)}>Demander</p>
        ) : null}
      </section>
    </section>
  );
}
