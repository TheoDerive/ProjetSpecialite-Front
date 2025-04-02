import React, { type FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiMembre, type MembreType } from "~/hooks/apiMembre";
import { useAppStore } from "~/datas/store";
import { useNavigate } from "react-router";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

export default function Login() {
  const [show, setShow] = React.useState(false);

  const [login, setLogin] = React.useState({
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

  const store = useAppStore();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async () =>
      apiMembre.signIn({
        firstname: login.firstname,
        lastname: login.lastname,
        email: login.email,
        password: login.password,
      }),
    onSuccess: (data) => {
      console.log("Login success", data);
      const newUser: MembreType = {
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        is_admin: data.is_admin,
        image_url: data.image_url,
        email: data.email,
      };
      store.setUser(newUser);
      window.localStorage.setItem("user", JSON.stringify(newUser));

      navigate("/");
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
    if (login.firstname === "") {
      setError({
        for: "firstname",
        message: "Veuillez renseigner votre prenom",
      });

      return;
    }
    if (login.lastname === "") {
      setError({
        for: "lastname",
        message: "Veuillez renseigner votre nom",
      });

      return;
    }

    if (login.email === "") {
      setError({
        for: "email",
        message: "Veuillez renseigner votre adresse email",
      });

      return;
    } else if (emailRegex.test(login.email) === false) {
      setError({
        for: "email",
        message: "Veuillez renseigner une adresse email valide",
      });

      return;
    }

    if (login.password.length < 8) {
      setError({
        for: "password",
        message: "Veuillez renseigner un mot de passe de 8 charactere minimum",
      });

      return;
    } else if (passwordRegex.test(login.password) === false) {
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
      <section className="form-container">
        <form className="login-form" onSubmit={handleLogin}>
          <label>
            {error.for === "firstname" ? <p>{error.message}</p> : null}
            <input
              ref={emailInputRef}
              className="firstname-input"
              placeholder="Prenom"
              type="text"
              value={login.firstname}
              onChange={(e) => {
                setLogin({
                  ...login,
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
              value={login.lastname}
              onChange={(e) => {
                setLogin({
                  ...login,
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
              value={login.email}
              onChange={(e) => {
                setLogin({
                  ...login,
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
              value={login.password}
              onChange={(e) => {
                setLogin({
                  ...login,
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
      </section>
    </main>
  );
}
