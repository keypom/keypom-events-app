import { useState, useEffect } from "react";
import { Box, VStack, Flex, Spinner } from "@chakra-ui/react";
import eventHelperInstance from "@/lib/event";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import TxnFeed from "./TxnFeed"; // Adjust the import path accordingly
import LeaderboardAndGlobals from "./LeaderboardAndGlobals"; // Adjust the import path accordingly
import { LeaderboardData } from "./types"; // Adjust the import path accordingly

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    // Function to fetch leaderboard data
    const fetchLeaderboardData = async () => {
      try {
        const data = await eventHelperInstance.viewCall({
          methodName: "get_leaderboard_information",
          args: {},
        });
        console.log("Leaderboard data: ", data);
        setLeaderboardData({
          ...data,
          poap_leaderboard: data.poap_leaderboard.reverse(),
          recent_transactions: data.recent_transactions.reverse(),
        });
        setIsLoading(false);
      } catch (e: any) {
        console.log(e);
        setIsErr(true);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchLeaderboardData();

    // Set up interval to refetch every 10 seconds
    const intervalId = setInterval(fetchLeaderboardData, 10000); // 10000 ms = 10 seconds

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  if (isErr) {
    return (
      <NotFound404
        cta="Back"
        header="Account Unauthorized"
        subheader="Check the signed-in account and try again later."
        onClick={() => {
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        bg="bg.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  return (
    <Box
      bg={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/assets/custom-button-bg.webp)`}
      backgroundPosition="center"
      backgroundSize="150% 150%"
      backgroundRepeat="no-repeat"
      width="100%"
      minHeight="100vh"
    >
      <VStack px={[4, 8, 16]} py={10} spacing={10}>
        <Flex
          direction={["column", "column", "row"]}
          justifyContent="space-between"
          width="100%"
        >
          <TxnFeed recentTransactions={leaderboardData!.recent_transactions} />
          <LeaderboardAndGlobals
            totalTransactions={leaderboardData!.total_transactions}
            totalTokensTransferred={leaderboardData!.total_tokens_transferred}
            tokenLeaderboard={leaderboardData!.token_leaderboard}
          />
        </Flex>
      </VStack>
    </Box>
  );
}
