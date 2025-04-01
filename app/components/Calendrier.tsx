import React from "react";
import { monthIndex } from "~/datas/usefullData";
import { useEvenement } from "~/hooks/useEvenements";

export default function Calendrier() {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const evenement = [
    {
      name: "test",
      date: "2025-04-30",
    },
    {
      name: "test",
      date: "2025-03-21",
    },
  ];

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
      event: evenement.filter((event) => {
        const eventMonth = event.date.split("-")[1];
        const eventDay = event.date.split("-")[2];

        if (
          Number(eventMonth) === currentDate.getMonth() + 1 &&
          Number(eventDay) === i + 1
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

  const {} = useEvenement.getEvenement({ resultParams: [], filterParams: []})

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

  return (
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
            className={`calendrier-case ${(index < 14 && day.date > 14) || (index > 28 && day.date < 14)
                ? "calendrier-case-inactive"
                : ""
              }`}
            id={index}
            key={index}
          >
            {index < 28 && day.date === 1 ? (
              <div className="month">{monthIndex[currentDate.getMonth()]}</div>
            ) : null}
            <div className="day-number">{day.date}</div>

            {day.event.map((event) => (
              <div>{event.name}</div>
            ))}
          </div>
        ))}
      </section>
    </section>
  );
}
