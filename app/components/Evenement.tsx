import type { EvenementType } from "~/hooks/useEvenements";

export default function Evenement({evenement, updateEventSelect}: {evenement: EvenementType, updateEventSelect: (event: EvenementType | null) => void}){

  return <article onClick={() => updateEventSelect(evenement)} className={`evenement ${evenement.type_eventName}`}>{evenement.name}</article>
}
