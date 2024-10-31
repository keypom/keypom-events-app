import { VStack } from "@chakra-ui/react";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { JourneyCard } from "@/components/wallet/journeys/card";
import { useAccountData } from "@/hooks/useAccountData";

export default function Journeys() {
  const { data, isLoading, isError, error } = useAccountData();

  const journeys = data?.journeys || [];

  // Calculate total number of completed journeys
  const completedJourneys = journeys.filter((journey) => journey.completed);
  const completedCount = completedJourneys.length;
  const totalCount = journeys.length;

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Journeys"
        titleSize="24px"
        sendTo="/wallet"
        description={
          totalCount ? `${completedCount} / ${totalCount} completed` : ""
        }
        showBackButton
      />
      {isLoading && <LoadingBox />}
      {journeys.length > 0 && (
        <VStack width="100%" spacing={4}>
          {journeys.map((journey) => (
            <JourneyCard
              key={journey.id}
              {...journey}
              tokenReward={journey.tokenReward}
            />
          ))}
        </VStack>
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
