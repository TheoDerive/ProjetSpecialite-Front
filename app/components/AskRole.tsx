import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useAccount } from "~/hooks/useAccount";
import type { EvenementType } from "~/hooks/useEvenements";
import { useGetRole } from "~/hooks/useGetRole";

export default function AskRole({
  eventSelect,
  setDemanding
}: {
  eventSelect: EvenementType;
    setDemanding: (value: boolean) => void
}) {
  const [rolesDemand, setRolesDemand] = React.useState([
    {
      name: "Arbre",
      id: 1,
      selected: false,
    },
    {
      name: "Buisson",
      id: 2,
      selected: false,
    },
  ]);

  const { account } = useAccount()

  console.log(account)


  const mutation = useMutation({
    mutationFn: async () => {
      const role = rolesDemand.filter((role) => role.selected === true);
      const date = new Date();

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0"); 

      const formattedDate = `${year}-${month}-${day}`;

      role.forEach((r) => {
        useGetRole.addRoles({
          Id_Membre: account.Id_Membre,
          Id_roles: r.id,
          Id_Evenement: eventSelect.id,
          date: formattedDate,
          isvalid: null,
        });
      });
    },
    onSuccess: (data) => {
      setDemanding(false)
      window.location.reload()
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  const handleCheck = React.useCallback((id: number) => {
    const result = rolesDemand.map((role) => {
      let newRole = role;
      if (role.id === id) {
        newRole.selected = !role.selected;
        console.log(newRole);
      }
      return newRole;
    });

    setRolesDemand(result);
  }, []);

  return (
    <section className="userAsk">
      <span className="close" onClick={() => setDemanding(false)}>close</span>
      {rolesDemand.map((role) => (
        <div className="role-container">
          <input
            type="checkbox"
            onMouseDown={() => handleCheck(role.id)}
            checked={role.selected}
          />
          <p>{role.name}</p>
        </div>
      ))}

      <button onClick={() => mutation.mutate()}>Envoyer</button>
    </section>
  );
}
