import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { type FormEvent } from "react";
import Navbar from "~/components/Navbar";
import { apiMembre } from "~/hooks/apiMembre";
import { useAccount } from "~/hooks/useAccount";
import { useAuth } from "~/hooks/useAuth";
import { useGetRole, type GetRoleType } from "~/hooks/useGetRole";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function About() {

  const {logout} = useAuth()

  const { account, updateEmail } = useAccount()

  const [wantUpdatePassword, setWantUpdatePassword] = React.useState(false);
  const [emailEnter, setEmailEnter] = React.useState(account.email || "");
  const [passwordEnter, setPasswordEnter] = React.useState({
    old: "",
    new: "",
  });
  const [error, setError] = React.useState({
    for: "",
    message: "",
  });


  const mutationEmail = useMutation({
    mutationFn: async () =>
      apiMembre.updateEmail({
        id: account.Id_Membre,
        newEmail: emailEnter,
      }),
    onSuccess: (data) => {
      updateEmail(emailEnter) 
      window.location.reload()
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  const mutationLogout = useMutation({
    mutationFn: async () =>
      apiMembre.logout({
        id: account.Id_Membre,
      }),
    onSuccess: (data) => {
      logout()
      window.location.reload()
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });


  const mutationPassword = useMutation({
    mutationFn: async () =>
      apiMembre.updatePassword({
        id: account.Id_Membre,
        old_password: passwordEnter.old,
        password: passwordEnter.new,
      }),
    onSuccess: (data) => {
      console.log("Updated", data);
      setPasswordEnter({old: "", new: ""})
      setWantUpdatePassword(false)
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  function handleModifyEmail(e: FormEvent) {
    if (emailRegex.test(emailEnter) === false) {
      setError({
        for: "email",
        message: "Veuillez renseigner une adresse email valide",
      });

      return;
    }

    mutationEmail.mutate();
  }

  function handleModifyPassword(e: FormEvent) {
    console.log(account.Id_Membre)

    if (passwordRegex.test(passwordEnter.old) === false) {
      setError({
        for: "password",
        message: "Veuillez renseigner votre ancien mot de passe",
      });

      return;
    }

    if (passwordRegex.test(passwordEnter.new) === false) {
      setError({
        for: "password",
        message: "Veuillez renseigner un nouveau mot de passe valid",
      });

      return;
    }

    mutationPassword.mutate();
  }


  React.useEffect(() => {
    setEmailEnter(account.email);
  }, [account]);

  const api = useQuery({
    queryKey: ["getNumberParticipation"],
    queryFn: async () =>
      useGetRole.getRoles({
        resultParams: ["id", "isvalid"],
        filterParams: [{ name: "Id_Membre", value: account.Id_Membre }],
        needFetch: false,
      }),
  });

  const participation = Array.isArray(api.data) ? api.data.filter((el: GetRoleType) => el.is_valid !== null).length : 0;

  return (
    <>
      <Navbar />
      <main className="user-page">
        <h2 className="user-page-title">Bonjours {account.firstname}</h2>

        <div className="user-information-global">
          <img
            className="user-information-global-image"
            src={account.image_url}
          />

          <div className="user-information-global-container">
            <FontAwesomeIcon icon={faMicrophone} />

            <div className="user-information-global-participation">
              <p className="user-information-global-participation-title">
                Nombre de participation
              </p>
              <p className="user-information-global-participation-number">
                {participation}
              </p>
            </div>
          </div>
        </div>

        <section className="user-information-personnel-container">
          <h2>Informations:</h2>

          <div className="user-information-personnel">
            <p className="user-information-personnel-title">Prenom</p>
            <p className="user-information-personnel-value">
              {account.firstname}
            </p>
          </div>

          <div className="user-information-personnel">
            <p className="user-information-personnel-title">Nom</p>
            <p className="user-information-personnel-value">
              {account.lastname}
            </p>
          </div>

          <div className="user-information-personnel reverse-column">
            <div className="user-information-personnel-mail-container">
              <p className="user-information-personnel-title">Email</p>
              <input
                value={emailEnter}
                onChange={(e) => setEmailEnter(e.target.value)}
                className="user-information-personnel-email-value"
              />
            </div>
            <button onClick={handleModifyEmail}>Modifier</button>
          </div>

          <div>
            {wantUpdatePassword ? (
              <>
                <input
                  type="password"
                  className="user-information-personnel-value-password"
                  placeholder="Ancien mot de passe"
                  value={passwordEnter.old}
                  onChange={(e) =>
                    setPasswordEnter({ ...passwordEnter, old: e.target.value })
                  }
                />
                <input
                  type="password"
                  className="user-information-personnel-value-password"
                  placeholder="Nouveau mot de passe"
                  value={passwordEnter.new}
                  onChange={(e) => setPasswordEnter({...passwordEnter, new: e.target.value})}
                />
              </>
            ) : null}
            <button
              onClick={(e) => {
                if (wantUpdatePassword === false) {
                  setWantUpdatePassword(true);
                } else {
                  handleModifyPassword(e);
                }
              }}
            >
              Modifier le mot de passe
            </button>
          </div>
        </section>

        <button onClick={() => mutationLogout.mutate()}>Se deconnecter</button>
      </main>
    </>
  );
}
