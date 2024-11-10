// Import statements remain the same
import { useState, useEffect } from "react";
import { Box, VStack, Flex, Spinner } from "@chakra-ui/react";
import eventHelperInstance from "@/lib/event";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import TxnFeed from "./TxnFeed"; // Adjust the import path accordingly
import LeaderboardAndGlobals from "./LeaderboardAndGlobals"; // Adjust the import path accordingly
import { LeaderboardData, TopTokenEarnerData, TransactionType } from "./types"; // Adjust the import path accordingly
import { BLACKLISTED_LEADERBOARD_USERNAMES } from "@/constants/common";

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
        eventHelperInstance.debugLog(`Leaderboard data: ${data}`, "log");

        // **Updated Code Starts Here**

        // Filter out blacklisted accounts from the token_leaderboard
        const filteredTokenLeaderboard = data.token_leaderboard.filter(
          (earner: TopTokenEarnerData) => {
            const username = earner[0].split(".")[0];
            return !BLACKLISTED_LEADERBOARD_USERNAMES.includes(username);
          },
        );

        // Limit the filtered leaderboard to at most 5 entries
        const topFiveLeaderboard = filteredTokenLeaderboard.slice(0, 5);

        // Prepare placeholders if the leaderboard has fewer than 5 entries
        const leaderboard: Array<TopTokenEarnerData | null> = [
          ...topFiveLeaderboard,
          ...Array(5 - topFiveLeaderboard.length).fill(null),
        ];

        // Similarly, limit and prepare recent transactions
        const recentTransactions = data.recent_transactions.reverse();
        const transactions: Array<TransactionType | null> =
          recentTransactions.length < 10
            ? [
                ...recentTransactions,
                ...Array(10 - recentTransactions.length).fill(null),
              ]
            : recentTransactions.slice(0, 10);

        // Set the state with the prepared data
        setLeaderboardData({
          ...data,
          token_leaderboard: leaderboard,
          poap_leaderboard: data.poap_leaderboard.reverse(),
          recent_transactions: transactions,
        });

        // **Updated Code Ends Here**

        setIsLoading(false);
      } catch (e: any) {
        eventHelperInstance.debugLog(e, "error");
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
