import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useAppStore } from "~/datas/store";
import { useEvenement, type EvenementType } from "~/hooks/useEvenements";

export default function AddEvent({
  eventData,
  events,
}: {
  eventData: [number, number];
  events: EvenementType[];
}) {
  const elementRef = React.useRef<HTMLParagraphElement>(null);

  const store = useAppStore()

  function handleClick(e: MouseEvent) {
    if (elementRef.current && !elementRef.current.contains(e.target as Node)) {
      elementRef.current.remove();
    }
  }

  React.useEffect(() => {
    if (!elementRef.current) return;

    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleClick);
    };
  }, [elementRef]);

  React.useEffect(() => {
    console.log(store.newEvent)
  }, [store.newEvent]);


  const addNewEvent = () => {
    if(!elementRef.current) return

    store.setEvent([{
      date: eventData
    }])

    elementRef.current.remove()
  }

  

  return (
    <>
      <section ref={elementRef} className="add-event">
        <p onClick={addNewEvent} style={{cursor: 'pointer'}}>Ajouter un evenement</p>
        {events.length > 0 && events.map((event) => <p onClick={async () => await useEvenement.deleteEvenement({ id: event.id})} style={{ cursor: "pointer"}}>Supprimer {event.name}</p>)}
      </section>
    </>
  );
}
