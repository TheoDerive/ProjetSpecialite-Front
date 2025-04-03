import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";

export default function SetUserRole({
  getRoleInfo,
}: {
  getRoleInfo: GetRoleType[];
}) {
  const [roleValid, setRoleValid] = React.useState(null);

  function handleChangeRole(e: Event) {
    if (!e.target) return;

    if (e.target.value === "Choississez le role a valider") {
      setRoleValid(null);
      return;
    }

    const value = e.target.value;

    const role = getRoleInfo.find((r) => r.roleName.name === value);

    if (role !== undefined) {
      setRoleValid(role.id);
    }
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const res = useGetRole.updateRole({id: roleValid});

      return res
    },
    onSuccess: (data) => {
      console.log("Login success", data);
      window.location.reload()
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });


  return (
    <section className="valid-role-container">
      <select onChange={handleChangeRole}>
        <option value={null}>Choississez le role a valider</option>
        {getRoleInfo.map((r) => (
          <option value={r.roleName.name}>{r.roleName.name}</option>
        ))}
      </select>
      <button onClick={()=> mutation.mutate()}>Valider</button>
    </section>
  );
}
