import React from "react";
import ReactDom from "react-dom/client";
import { monthIndex } from "~/datas/usefullData";
import { useEvenement, type EvenementType } from "~/hooks/useEvenements";
import Evenement from "./Evenement";
import EvenementInformation from "./EvenementInformation";
import AskRole from "./AskRole";
import { useAppStore } from "~/datas/store";
import AddEvent from "./Admin/AddEvent";
import CreateEvent from "./Admin/CreateEvent";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "~/hooks/useAccount";

export default function Calendrier() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [eventSelect, setEventSelect] = React.useState<EvenementType | false>(
    false
  );
  const [demanding, setDemanding] = React.useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["dates"],
    queryFn: async () => {
      const res = await useEvenement.getEvenement({
        resultParams: [],
        filterParams: [],
      });
      return res;
    },
  });
  const store = useAppStore();
  const { account } = useAccount()

  const evenements = data || [];

  function updateEventSelect(event: EvenementType | false) {
    if (event !== false && eventSelect !== false) return;

    setEventSelect(event);
  }

  // Creation du calendrier
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getPreviousMonthDays = (
    year: number,
    month: number,
    firstDay: number
  ) => {
    const daysInPrevMonth = getDaysInMonth(year, month - 1);
    return Array.from({ length: firstDay }, (_, i) => ({
      date: daysInPrevMonth - firstDay + i + 1,
      event: [],
    }));
  };

  const getNextMonthDays = (remainingDays: number) => {
    return Array.from({ length: remainingDays }, (_, i) => ({
      date: i + 1,
      event: [],
    }));
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const prevMonthDays = getPreviousMonthDays(year, month, firstDay);
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => ({
      date: i + 1,
      event: evenements.filter((event) => {
        const evenementDate = new Date(event.date);

        if (
          evenementDate.getMonth() === currentDate.getMonth() &&
          evenementDate.getDate() === i + 1
        ) {
          return event;
        }
      }),
    }));
    const totalDays = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = getNextMonthDays(42 - totalDays);

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const days = generateCalendar();

  // Gestion de la date
  function handlePrevMonth() {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function handleNextMonth() {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  React.useEffect(() => {
    const days = document.querySelectorAll(".calendrier-case-inactive");

    const handleClick = (event: Event) => {
      const day = event.currentTarget as HTMLDivElement;

      if (
        Number(day.id) < 14 &&
        day.classList.contains("calendrier-case-inactive")
      ) {
        handlePrevMonth();
      } else if (
        Number(day.id) > 14 &&
        day.classList.contains("calendrier-case-inactive")
      ) {
        handleNextMonth();
      }
    };

    days.forEach((day) => {
      day.addEventListener("click", handleClick);
    });

    return () => {
      days.forEach((day) => {
        day.removeEventListener("click", handleClick);
      });
    };
  }, [currentDate]);

  function appendAddProject(day: number, e: MouseEvent, event: []) {
    e.preventDefault();

    if (account.is_admin === null) return;

    const htmlElement = e.target as HTMLElement;
    const container = document.createElement("div");
    container.classList.add("add-event-container");

    console.log(htmlElement.classList);

    if (
      htmlElement.contains(container) ||
      !htmlElement.classList.contains("evenements-container")
    )
      return;

    htmlElement.appendChild(container);

    const root = ReactDom.createRoot(container);

    root.render(
      <AddEvent eventData={[day, currentDate.getMonth() + 1]} events={event} />
    );
  }

  return (
    <>
      <section className="calendrier-container">
        <ul className="days">
          <li className="day">Lun</li>
          <li className="day">Mar</li>
          <li className="day">Mer</li>
          <li className="day">Jeu</li>
          <li className="day">Ven</li>
          <li className="day">Sam</li>
          <li className="day">Dim</li>
        </ul>

        <section className="calendrier">
          {days.map((day, index) => (
            <div
              onContextMenu={(e) => appendAddProject(day.date, e, day.event)}
              className={`calendrier-case ${
                (index < 14 && day.date > 14) || (index > 28 && day.date < 14)
                  ? "calendrier-case-inactive"
                  : ""
              }`}
              id={index}
              key={index}
            >
              {index < 28 && day.date === 1 ? (
                <div className="month">
                  {monthIndex[currentDate.getMonth()]}
                </div>
              ) : null}
              <div className="day-number">{day.date}</div>

              <section className="evenements-container">
                <div className="evenement-scroll-container">
                  {day.event.map((event, i) => (
                    <Evenement
                      updateEventSelect={updateEventSelect}
                      evenement={event}
                      key={i}
                    />
                  ))}
                </div>
              </section>
            </div>
          ))}
        </section>
        {eventSelect ? (
          <EvenementInformation
            evenement={eventSelect}
            updateEvenementSelect={updateEventSelect}
            setDemanding={setDemanding}
          />
        ) : null}

        {demanding ? (
          <section className="userAsk-container">
            <AskRole eventSelect={eventSelect} setDemanding={setDemanding} />
          </section>
        ) : null}
      </section>

      {store.newEvent.map((event) => (
        <CreateEvent date={event.date} />
      ))}
    </>
  );
}
