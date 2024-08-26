
export interface Step {
  description: string;
  completed: boolean;
}

export interface Journey {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  steps: Step[];
  bgColor: string;
}

export const fetchJourneys: () => Promise<Journey[]> = async () => {
  const response = await fetch("https://example.com/journeys");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export const fetchJourneyById: (id: string) => Promise<Journey> = async (id) => {
  const response = await fetch(`https://example.com/journeys/${id}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}