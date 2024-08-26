import { Box, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { Spinner } from "@/components/ui/spinner";
import { JourneyCard } from "@/components/wallet/journeys/card";
import { useQuery } from "@tanstack/react-query";

type Journey = {
  title: string;
  description: string;
  progress: number;
  bgColor: string;
};

const fetchJourneys: () => Promise<Journey[]> = async () => {
  const response = await fetch("https://example.com/journeys");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

export function Journeys() {
  const {
    data: journeys,
    error,
    isLoading,
  } = useQuery({ queryKey: ["journeys"], queryFn: fetchJourneys });

  const getProgressDescription = (journeys: Journey[]) => {
    const completed = journeys.filter(
      (journey) => journey.progress === 100,
    ).length;
    return `${completed}/${journeys.length} completed`;
  };

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Journeys"
        titleSize="24px"
        description={journeys ? getProgressDescription(journeys) : ""}
        showBackButton
        backUrl="/wallet"
      />
      {isLoading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <Spinner />
        </Box>
      )}
      {journeys && (
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
      )}
      {error && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1}
        >
          <div>Error: {error.message}</div>
        </Box>
      )}
    </VStack>
  );
}
