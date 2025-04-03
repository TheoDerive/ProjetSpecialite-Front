import React, { type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiMembre, type MembreType } from "~/hooks/apiMembre";
import { useAppStore } from "~/datas/store";
import { Link, useNavigate } from "react-router";
import { useAuth, type Me } from "~/hooks/useAuth";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function Login() {
  const [show, setShow] = React.useState(false);

  const [log, setLogin] = React.useState({
    firstname: "",
    lastname: "",
    image_url: "/",
    email: "",
    password: "",
  });
  const [error, setError] = React.useState({
    for: "",
    message: "",
  });

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  const { login } = useAuth()
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: async () =>
      apiMembre.signIn({
        firstname: log.firstname,
        lastname: log.lastname,
        email: log.email,
        password: log.password,
      }),
    onSuccess: (data) => {
      const newUser: Me = {
        Id_Membre: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        is_admin: data.is_admin,
        image_url: data.image_url,
        email: data.email,
      };

      login(newUser)
      navigate("/")
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  async function handleLogin(e: FormEvent) {
    e.preventDefault();

    if (!emailInputRef.current || !passwordInputRef.current) return;

    setError({ for: "", message: "" });

    // Handle Error
    if (log.firstname === "") {
      setError({
        for: "firstname",
        message: "Veuillez renseigner votre prenom",
      });

      return;
    }
    if (log.lastname === "") {
      setError({
        for: "lastname",
        message: "Veuillez renseigner votre nom",
      });

      return;
    }

    if (log.email === "") {
      setError({
        for: "email",
        message: "Veuillez renseigner votre adresse email",
      });

      return;
    } else if (emailRegex.test(log.email) === false) {
      setError({
        for: "email",
        message: "Veuillez renseigner une adresse email valide",
      });

      return;
    }

    if (log.password.length < 8) {
      setError({
        for: "password",
        message: "Veuillez renseigner un mot de passe de 8 charactere minimum",
      });

      return;
    } else if (passwordRegex.test(log.password) === false) {
      setError({
        for: "password",
        message:
          "Votre mot de passe doit contenir au moins: \n - 8 caracteres \n - Une lettre majuscule \n - Une lettre minuscule \n - Un chiffre \n - Et peu contenir des caracteres speciaux",
      });

      return;
    }

    try {
      mutation.mutate();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <main>
      <section className="form-container" style={{ height: "50%"}}>
        <form className="login-form" onSubmit={handleLogin}>
          <label>
            {error.for === "firstname" ? <p>{error.message}</p> : null}
            <input
              ref={emailInputRef}
              className="firstname-input"
              placeholder="Prenom"
              type="text"
              value={log.firstname}
              onChange={(e) => {
                setLogin({
                  ...log,
                  firstname: e.target.value,
                });
              }}
            />
          </label>

          <label>
            {error.for === "lastname" ? <p>{error.message}</p> : null}
            <input
              ref={emailInputRef}
              className="lastname-input"
              placeholder="Nom"
              type="text"
              value={log.lastname}
              onChange={(e) => {
                setLogin({
                  ...log,
                  lastname: e.target.value,
                });
              }}
            />
          </label>

          <label>
            {error.for === "email" ? <p>{error.message}</p> : null}
            <input
              ref={emailInputRef}
              className="email-input"
              placeholder="Email"
              type="email"
              value={log.email}
              onChange={(e) => {
                setLogin({
                  ...log,
                  email: e.target.value,
                });
              }}
            />
          </label>

          <label>
            {error.for === "password" ? <p>{error.message}</p> : null}
            <input
              ref={passwordInputRef}
              className="email-input"
              placeholder="Mot de passe"
              type={show ? "text" : "password"}
              value={log.password}
              onChange={(e) => {
                setLogin({
                  ...log,
                  password: e.target.value,
                });
              }}
            />
            <FontAwesomeIcon icon={faEye} onClick={() => setShow(!show)} />
          </label>

          <button className="form-submit" type="submit">
            Se connecter
          </button>
        </form>
        <Link to={"/login"}>Se connecter</Link>
      </section>
    </main>
  );
}
