import { VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { JourneyCard } from "@/components/wallet/journeys/card";

type Journey = {
  title: string;
  description: string;
  progress: number;
  bgColor: string;
};

const journeys: Journey[] = [
  {
    title: "NEAR Sponsor Scavenger Hunt",
    description: "4 of 4 found",
    progress: 100,
    bgColor: "#0282A2",
  },
  {
    title: "NEAR Purple Scavenger Hunt",
    description: "2 of 4 found",
    progress: 50,
    bgColor: "#7269E1",
  },
  {
    title: "Chain Abstraction Adventure",
    description: "0 of 4 found",
    progress: 0,
    bgColor: "#F44738",
  },
  {
    title: "Another Adventure",
    description: "0 of 4 found",
    progress: 0,
    bgColor: "#62EBE4",
  },
];

export function Journeys() {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Journeys"
        titleSize="24px"
        description="1/4 completed"
        showBackButton
        backUrl="/wallet"
      />
      <VStack width="100%" spacing={4}>
        {journeys.map((journey, index) => (
          <JourneyCard
            key={index}
            title={journey.title}
            description={journey.description}
            progress={journey.progress}
            bgColor={journey.bgColor}
            id={index.toString()}
          />
        ))}
      </VStack>
    </VStack>
  );
}
