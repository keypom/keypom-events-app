import { VStack } from "@chakra-ui/react";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { JourneyCard } from "@/components/wallet/journeys/card";
import { fetchJourneys, Journey } from "@/lib/api/journeys";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export function Journeys() {
  const {
    data: journeys,
    error,
    isError,
    isLoading,
  } = useQuery({ queryKey: ["journeys"], queryFn: fetchJourneys });

  const isJourneyCompleted = (journey: Journey) => {
    return journey.steps.every(step => step.completed);
  };

  const completedJourneys = useMemo(() => (journeys ? journeys.filter((it) => isJourneyCompleted(it)) : []), [journeys]);

  const getProgressDescription = (journeys: Journey[]) => {
    const completed = completedJourneys.length;
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
      {isLoading && <LoadingBox />}
      {journeys && (
        <VStack width="100%" spacing={4}>
          {journeys.map((journey, index) => (
            <JourneyCard key={index} {...journey} />
          ))}
        </VStack>
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
