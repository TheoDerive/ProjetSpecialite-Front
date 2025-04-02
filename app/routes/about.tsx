import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { type FormEvent } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { useAppStore } from "~/datas/store";
import { apiMembre } from "~/hooks/apiMembre";
import { useGetRole } from "~/hooks/useGetRole";
import { getLocalhost } from "~/utils/getLocalHost";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function About() {
  const store = useAppStore();

  const [wantUpdatePassword, setWantUpdatePassword] = React.useState(false)
  const [emailEnter, setEmailEnter] = React.useState(store.user?.email || "")
  const [error, setError] = React.useState({
    for: "",
    message: ""
  })

  const mutation = useMutation({
    mutationFn: async () =>
      apiMembre.updateEmail({
        id: store.user.id,
        newEmail: emailEnter
      }),
    onSuccess: (data) => {
      let user = store.user
      user.email = emailEnter
      console.log("Updated", data)
      store.setUser(user)
      window.localStorage.setItem("user", JSON.stringify(store.user))
    },
    onError: (error) => {
      console.log("Login failed", error)
    }
  });

  function handleModifyEmail(e: FormEvent){
    if(emailRegex.test(emailEnter) === false){
      setError({
        for: "email",
        message: "Veuillez renseigner une adresse email valide",
      });

      return
    }


    mutation.mutate()
  }

  React.useEffect(() => {
    store.setUser(getLocalhost("user"));
  }, []);

  React.useEffect(() => {
    setEmailEnter(store.user?.email)
  }, [store.user])

  const api = useQuery({
    queryKey: ["getNumberParticipation"],
    queryFn: async () =>
      useGetRole.getRoles({
        resultParams: ["id"],
        filterParams: [{ name: "Id_Membre", value: store.user.id }],
        needFetch: false,
      }),
  });

  const participation = api.data ? api.data.length : 0;

  return (
    <>
      <Navbar />
      <main className="user-page">
        <h2 className="user-page-title">Bonjours {store.user?.firstname}</h2>

        <div className="user-information-global">
          <img
            className="user-information-global-image"
            src={store.user?.image_url}
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
              {store.user?.firstname}
            </p>
          </div>

          <div className="user-information-personnel">
            <p className="user-information-personnel-title">Nom</p>
            <p className="user-information-personnel-value">
              {store.user?.lastname}
            </p>
          </div>

          <div className="user-information-personnel reverse-column">
            <div className="user-information-personnel-mail-container">
              <p className="user-information-personnel-title">Email</p>
              <input value={emailEnter} onChange={(e) => setEmailEnter(e.target.value)} className="user-information-personnel-email-value" />
            </div>
            <button onClick={handleModifyEmail}>Modifier</button>
          </div>


          <div>
            {
              wantUpdatePassword ?
                <>
                  <input type="password" className="user-information-personnel-value-password" placeholder="Ancien mot de passe"/>
                  <input type="password" className="user-information-personnel-value-password" placeholder="Nouveau mot de passe"/>

                </>
                : null
            }
          <button onClick={() => {
              if(wantUpdatePassword === false){
                setWantUpdatePassword(true)
              }
            }}>Modifier le mot de passe</button>
          </div>
        </section>
      </main>
    </>
  );
}
