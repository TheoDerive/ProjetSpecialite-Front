import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { useAppStore } from "~/datas/store";
import { apiCategory, type Category } from "~/hooks/apiCategory";
import { apiTypeEvent, type TypeEvent } from "~/hooks/apiTypeEvent";
import { useEvenement } from "~/hooks/useEvenements";
import { formatDate } from "~/utils/formatDate";

export default function CreateEvent({ date }: { date: [number, number] }) {
  const [typeEvents, setTypeEvents] = React.useState<TypeEvent[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [eventInfo, setEventInfo] = React.useState({
    title: "",
    type: null,
    category: null,
    hour: null,
    minute: null,
    date,
    adresse: "",
    description: "",
  });
  const store = useAppStore();

  const mutation = useMutation({
    mutationFn: async () => {
      const dateSetup = new Date();
      dateSetup.setDate(date[0]);
      dateSetup.setMonth(date[1] - 1); 
      dateSetup.setHours(eventInfo.hour!);
      dateSetup.setMinutes(eventInfo.minute!);

      const returnDate = dateSetup.toISOString();
      console.log(returnDate)

      const result = await useEvenement.addEvenement({
        Name: eventInfo.title,
        date: returnDate,
        Id_Category: eventInfo.category!,
        Id_type_event: eventInfo.type!,
        desc_: eventInfo.description,
        adresse: eventInfo.adresse,
      });

      return result;
    },
    onSuccess: (data) => {
      store.setEvent([])

      window.location.reload()

      console.log("Login success", data);
    },
    onError: (error) => {
      console.log("Login failed", error);
    },
  });

  function close() {
    store.setEvent([]);
  }

  const typeEventApi = useQuery({
    queryKey: ["typeEvents", typeEvents],
    queryFn: async () => {
      const res = await apiTypeEvent.getTypeEvent({
        resultParams: [],
        filterParams: [],
      });

      return res;
    },
  });

  React.useEffect(() => {
    if (typeEventApi.data) {
      setTypeEvents(typeEventApi.data);
    }
  }, [typeEventApi.data]);

  const CategoryApi = useQuery({
    queryKey: ["categories", categories],
    queryFn: async () => {
      const res = await apiCategory.getCategory({
        resultParams: [],
        filterParams: [],
      });

      return res;
    },
  });

  React.useEffect(() => {
    if (CategoryApi.data) {
      setCategories(CategoryApi.data);
    }
  }, [CategoryApi.data]);

  React.useEffect(() => {
    console.log(eventInfo)
  }, [eventInfo]);

  React.useEffect(() => {
    console.log(eventInfo);
  }, [eventInfo]);

  function handleSend() {
    const { title, description, adresse, type, category, minute, hour } =
      eventInfo;
    if (
      title === "" ||
      description === "" ||
      adresse === "" ||
      type === null ||
      category === null ||
      minute === null ||
      hour === null
    )
      return;

    console.log("padd")
    mutation.mutate();
  }

  return (
    <section className="create-event-container">
      <span className="close" onClick={close}>
        close
      </span>

      <div className="event-information">
        <input
          className="title-input"
          placeholder="Titre"
          onChange={(e) =>
            setEventInfo({ ...eventInfo, title: e.target.value })
          }
        />
        <p className="date">
          {formatDate(date[0])}/{formatDate(date[1])}{" "}
          <input
            className="hour-input"
            type="number"
            onChange={(e) =>
              setEventInfo({ ...eventInfo, hour: Number(e.target.value) })
            }
          />
          h
          <input
            className="minute-input"
            type="number"
            onChange={(e) =>
              setEventInfo({ ...eventInfo, minute: Number(e.target.value) })
            }
          />
        </p>
        <input
          className="adresse-input"
          placeholder="Adresse"
          onChange={(e) =>
            setEventInfo({ ...eventInfo, adresse: e.target.value })
          }
        />
      </div>
      <textarea
        className="description-input"
        placeholder="Description..."
        rows={5}
        cols={33}
        onChange={(e) =>
          setEventInfo({ ...eventInfo, description: e.target.value })
        }
      />

      <select
        className="type-selection"
        onChange={(e) =>
          setEventInfo({ ...eventInfo, type: Number(e.target.value) || null })
        }
      >
        <option>Choississez une category</option>
        {typeEvents.map((type: TypeEvent) => (
          <option value={type.id}>{type.name}</option>
        ))}
      </select>
      <select
        className="category-selection"
        onChange={(e) =>
          setEventInfo({
            ...eventInfo,
            category: Number(e.target.value) || null,
          })
        }
      >
        <option>Choississez une category</option>
        {categories.map((category: Category) => (
          <option value={category.id}>{category.name}</option>
        ))}
      </select>

      <button onClick={handleSend}>Cree</button>
    </section>
  );
}
