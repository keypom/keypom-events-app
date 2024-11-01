import { VStack } from "@chakra-ui/react";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { JourneyCard } from "@/components/wallet/journeys/card";
import { useAccountData } from "@/hooks/useAccountData";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/wallet/collectibles/pagination";
import { Divider } from "./collectibles";

export default function Journeys() {
  const { data, isLoading, isError, error } = useAccountData();

  const journeys = data?.journeys || [];

  // Calculate total number of completed journeys
  const completedJourneys = journeys.filter((journey) => journey.completed);
  const completedCount = completedJourneys.length;
  const totalCount = journeys.length;

  // Pagination setup
  const itemsPerPage = 10;

  // Read `page` from URL query parameters
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSearchParams({ page: newPage.toString() }, { replace: true });
  };

  useEffect(() => {
    // Sync the `page` state with the URL parameter when it changes
    setSearchParams({ page: currentPage.toString() }, { replace: true });
  }, [currentPage, setSearchParams]);

  // Calculate the items to display on the current page
  const totalItems = journeys.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const journeysToShow = journeys.slice(startIndex, endIndex);

  return (
    <VStack spacing={4} p={4} alignItems="flex-start">
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
      {isError && <ErrorBox message={`Error: ${error.message}`} />}

      {!isLoading && journeysToShow.length > 0 && (
        <>
          <VStack width="100%" spacing={4}>
            {journeysToShow.map((journey) => (
              <JourneyCard
                key={journey.id}
                {...journey}
                tokenReward={journey.tokenReward}
              />
            ))}
          </VStack>

          <Divider />
          <Pagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            setPage={handlePageChange}
          />
        </>
      )}

      {!isLoading && journeysToShow.length === 0 && (
        <ErrorBox message="No journeys to display." />
      )}
    </VStack>
  );
}
