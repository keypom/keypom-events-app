import { Agenda } from "@/types/common";

export const fetchAgendas: () => Promise<Agenda[]> = async () => {
  const response = await fetch("https://example.com/agendas");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const agendas: Agenda[] = await response.json();
  return agendas;
};
