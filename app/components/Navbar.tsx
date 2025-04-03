import React from "react";
import { Link, useLocation } from "react-router";
import { useAppStore } from "~/datas/store";
import { useAccount } from "~/hooks/useAccount";

type OngletsActiveType = {
  calendar: boolean;
  user: boolean;
  admin: boolean;
};

export default function Navbar() {
  const [ongletsActive, setOngletsActive] = React.useState<OngletsActiveType>({
    calendar: true,
    user: false,
    admin: false,
  });

  const { account } = useAccount()

  const location = useLocation();


  React.useEffect(() => {
    let pathname = location.pathname.split("/")[1]

    if(pathname.length === 0){
      pathname = "calendar"
    }

    setOngletsActive({
      calendar: pathname === "calendar",
      user: pathname === "user",
      admin: pathname === "admin",
    })
  }, [location.pathname]);

  return (
    <header className="navbar">
      <img src={account.image_url} className="navbar-image" />

      <ul className="navbar-onglets-container">
        <Link
          to={"/"}
          className={`navbar-onglet ${ongletsActive.calendar ? "navbar-onglet-active" : ""
            }`}
        >
          <img src="/icons/calendar.svg" />
        </Link>

        <Link
          to={"/user"}
          className={`navbar-onglet ${ongletsActive.user ? "navbar-onglet-active" : ""
            }`}
        >
          <img src="/icons/user.svg" />
        </Link>

        {
          account.is_admin !== null ?

        <Link
          to={"/admin"}
          className={`navbar-onglet ${ongletsActive.admin ? "navbar-onglet-active" : ""
            }`}
        >
          <img src="/icons/admin.svg" />
        </Link>
        : null
        }
      </ul>
    </header>
  );
}
