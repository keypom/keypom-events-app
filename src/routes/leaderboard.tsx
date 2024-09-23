import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Flex,
  Text,
  Heading,
  Spinner,
  HStack,
  Image,
} from "@chakra-ui/react";
import eventHelperInstance from "@/lib/event";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { ArrowIcon, Redacted, UserIcon } from "@/components/icons";
import { timeAgoShort } from "@/utils/date";
import KeypomLogo from "/assets/keypom-logo.webp";
import NearLogo from "/assets/near-logo.webp";

type AccountId = string;

interface ClaimTransaction {
  account_id: AccountId;
  reward: string | "NFT";
  timestamp: number;
}

interface TransferTransaction {
  sender_id: AccountId;
  receiver_id: AccountId;
  amount: string;
  timestamp: number;
}

interface TransactionType {
  Claim?: ClaimTransaction;
  Transfer?: TransferTransaction;
}

interface LeaderboardData {
  poap_leaderboard: Array<[AccountId, number]>;
  token_leaderboard: Array<[AccountId, string]>;
  recent_transactions: Array<TransactionType>;
  total_tokens_transferred: string;
  total_transactions: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] =
    useState<LeaderboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
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
      } catch (error) {
        setIsErr(true);
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
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

  // Format the timestamp to show short-form "time ago"
  const formatTimestamp = (transactionType: TransactionType) => {
    if (!transactionType) return;
    if (!transactionType.Claim && !transactionType.Transfer) return;

    // Get the correct timestamp (in nanoseconds)
    const timestamp = transactionType.Claim
      ? transactionType.Claim.timestamp
      : transactionType.Transfer!.timestamp;

    // Convert from nanoseconds to milliseconds (since JS Date uses milliseconds)
    const timestampInMs = timestamp / 1e6;

    // Use the timeAgoShort function
    return timeAgoShort(new Date(timestampInMs));
  };

  const getUsername = (accountId: string) => {
    return accountId.split(".")[0];
  };

  const TopEarner = (earner: [AccountId, string], index: number) => {
    return (
      <Box
        key={index}
        px={2}
        py={2}
        borderRadius="md"
        bg="rgba(0, 0, 0, 0.8)"
        display="flex"
        alignItems="center"
        width="100%"
      >
        <HStack width="100%" justifyContent="space-between" spacing={4}>
          {/* Claimed by account - Left justified */}
          <Flex alignItems="center" justifyContent="flex-start">
            <Box
              bg="brand.400"
              borderRadius="md"
              display="flex" // Use 'flex' for flexible centering
              alignItems="center" // Vertically center the index
              justifyContent="center" // Horizontally center the index
              p="8px"
              width="45px"
            >
              <Text
                color="bg.primary"
                fontSize="2xl"
                textAlign="center"
                fontFamily={"mono"}
                fontWeight={700}
              >
                {index + 1}
              </Text>
            </Box>
            <Text
              ml={2}
              fontFamily={"mono"}
              fontSize={"2xl"}
              fontWeight={700}
              textAlign={"left"}
              color={"white"}
            >
              @{getUsername(earner[0])}
            </Text>
          </Flex>

          {/* Text Section: Right justified */}
          <Flex minWidth="150px" alignItems="center" justifyContent="flex-end">
            <Text
              fontFamily={"mono"}
              fontSize={"xl"}
              fontWeight={700}
              textAlign={"center"}
              color={"brand.400"}
            >
              {eventHelperInstance.yoctoToNearWith2Decimals(earner[1])}
            </Text>
          </Flex>
        </HStack>
      </Box>
    );
  };

  const rewardMessage = (tx: TransactionType) => {
    if (tx.Claim !== undefined) {
      if (tx.Claim.reward === "NFT" || tx.Claim.reward === "Multichain POAP") {
        return "Collectible";
      }
      if (tx.Claim.reward === "Scavenger Piece") {
        return "Scavenger Piece";
      }
      return eventHelperInstance.yoctoToNearWith2Decimals(tx.Claim.reward);
    }

    return eventHelperInstance.yoctoToNearWith2Decimals(tx.Transfer!.amount);
  };

  const TransactionInFeed = (tx: TransactionType, index: number) => {
    // If it's a Claim transaction
    if (tx.Claim !== undefined) {
      return (
        <Box
          key={index}
          px={6}
          py={4}
          borderRadius="md"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          width="100%"
        >
          <HStack width="100%" justifyContent="space-between" spacing={4}>
            {/* Claimed by account - Left justified */}
            <Flex
              minWidth="150px"
              alignItems="center"
              justifyContent="flex-start"
            >
              <UserIcon color={"var(--chakra-colors-brand-400)"} width={20} />
              <Text
                ml={2}
                fontFamily={"mono"}
                fontSize={"sm"}
                fontWeight={700}
                textAlign={"left"}
                color={"white"}
              >
                @{getUsername(tx.Claim.account_id)} {/* Claimed by user */}
              </Text>
            </Flex>

            {/* Arrow and Reward Section: Centered */}
            <HStack flex="1" justifyContent="center">
              <Text
                fontFamily={"mono"}
                fontSize={"lg"}
                fontWeight={700}
                textAlign={"center"}
                color={"brand.400"}
              >
                {rewardMessage(tx)}
              </Text>
              <ArrowIcon color={"white"} width={20} />
              <Text fontWeight="700" color="brand.600">
                {formatTimestamp(tx)}
              </Text>
            </HStack>

            {/* Text Section: Right justified */}
            <Flex
              minWidth="150px"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Text
                mr={2}
                fontFamily={"mono"}
                fontSize={"sm"}
                fontWeight={700}
                textAlign={"right"}
                color={"white"}
              >
                Drop Claimed
              </Text>
            </Flex>
          </HStack>
        </Box>
      );
    }

    // If it's a Transfer transaction
    return (
      <Box
        key={index}
        px={6}
        py={4}
        borderRadius="md"
        bg="rgba(0, 0, 0, 0.5)"
        display="flex"
        alignItems="center"
        width="100%"
      >
        <HStack width="100%" justifyContent="space-between" spacing={4}>
          {/* Sender Section: Left justified */}
          <Flex
            minWidth="150px"
            alignItems="center"
            justifyContent="flex-start"
          >
            <UserIcon color={"var(--chakra-colors-brand-400)"} width={20} />
            <Text
              ml={2}
              fontFamily={"mono"}
              fontSize={"sm"}
              fontWeight={700}
              textAlign={"left"}
              color={"white"}
            >
              @{getUsername(tx.Transfer?.sender_id)}
            </Text>
          </Flex>

          {/* Arrow and Amount Section: Centered */}
          <HStack flex="1" justifyContent="center">
            <Text
              fontFamily={"mono"}
              fontSize={"lg"}
              fontWeight={700}
              textAlign={"center"}
              color={"brand.400"}
            >
              {rewardMessage(tx)}
            </Text>
            <ArrowIcon color={"white"} width={20} />
            <Text fontWeight="700" color="brand.600">
              {formatTimestamp(tx)}
            </Text>
          </HStack>

          {/* Receiver Section: Right justified */}
          <Flex minWidth="150px" alignItems="center" justifyContent="flex-end">
            <Text
              mr={2}
              fontFamily={"mono"}
              fontSize={"sm"}
              fontWeight={700}
              textAlign={"right"}
              color={"white"}
            >
              @{getUsername(tx.Transfer?.receiver_id)}
            </Text>
            <UserIcon color={"var(--chakra-colors-brand-400)"} width={20} />
          </Flex>
        </HStack>
      </Box>
    );
  };

  const txnFeed = () => {
    return (
      <VStack width="60%">
        <HStack spacing={10}>
          <Redacted width="400px" height="100px" />
          <Heading as="h3" size="4xl" color="white" fontWeight="400">
            TX FEED
          </Heading>
        </HStack>
        {leaderboardData?.recent_transactions.map((tx, index) =>
          TransactionInFeed(tx, index),
        )}
      </VStack>
    );
  };

  const globals = () => {
    return (
      <HStack spacing={10}>
        <VStack>
          {/* TXS section */}
          <Heading as="h3" size="lg" color="white" fontWeight="400">
            {leaderboardData?.total_transactions}
          </Heading>
          <HStack spacing={2} width="100%">
            <Box
              width="100px"
              height="5.25px"
              bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
            />
            <Text
              fontFamily="mono"
              fontSize="2xl"
              fontWeight="medium"
              color="brand.400"
              data-testid="token-symbol"
            >
              TXS
            </Text>
            <Box
              width="100px"
              height="5.25px"
              bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
            />
          </HStack>
        </VStack>

        <VStack>
          {/* SOV3 Transferred section */}
          <Heading as="h3" size="lg" color="white" fontWeight="400">
            {eventHelperInstance.yoctoToNearWith2Decimals(
              leaderboardData!.total_tokens_transferred,
            )}
          </Heading>

          {/* SOV3 TRNSFRRED text above the images */}

          {/* Images section */}

          <HStack
            spacing={2}
            justifyContent="center"
            position="relative"
            alignItems="center"
            width="100%"
          >
            {/* Background image box on the left */}
            <Box
              width="100px"
              height="5.25px"
              bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
              position="relative"
            />

            {/* Placeholder for spacing */}
            <Text
              fontFamily="mono"
              fontSize="2xl"
              fontWeight="medium"
              color="transparent"
              data-testid="token-symbol"
            >
              T
            </Text>

            {/* SOV3 TRNSFRRED text */}
            <Text
              fontFamily="mono"
              fontSize="2xl"
              fontWeight="medium"
              color="brand.400"
              width="300px !important"
              height="0px !important"
              position="absolute"
              textAlign="center"
              transform="translateY(-16px)"
            >
              SOV3 TRNSFRRED
            </Text>

            {/* Background image box on the right */}
            <Box
              width="100px"
              height="5.25px"
              bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
              position="relative"
            />
          </HStack>
        </VStack>
      </HStack>
    );
  };

  const leaderboard = () => {
    return (
      <VStack>
        <HStack alignItems="flex-end">
          {" "}
          {/* Align items to the bottom */}
          <Heading as="h3" size="2xl" color="white" fontWeight="400">
            Leaderboard
          </Heading>
          <Heading
            as="h3"
            size="md"
            color="brand.400"
            fontWeight="400"
            alignSelf="flex-end" // Ensure the smaller heading aligns with the bottom
          >
            TOP SOV3 EARNERS
          </Heading>
        </HStack>
        {leaderboardData?.token_leaderboard.map((earner, index) =>
          TopEarner(earner, index),
        )}
      </VStack>
    );
  };

  const leaderboardAndGlobals = () => {
    return (
      <VStack
        width="40%"
        height="100%"
        justifyContent="space-between"
        spacing={62}
      >
        {globals()}
        {leaderboard()}

        <HStack spacing={14} alignItems="center">
          <VStack spacing={6} alignItems="center">
            <Heading
              as="h3"
              size="md"
              color="brand.400"
              fontWeight="400"
              textAlign="center"
            >
              BUILT ON
            </Heading>
            <Image
              src={NearLogo}
              objectFit={"cover"}
              bgColor={"transparent"}
              position="relative"
              loading="eager"
              width="180px"
            />
          </VStack>

          <VStack spacing={6} alignItems="center">
            <Heading
              as="h3"
              size="md"
              color="brand.400"
              fontWeight="400"
              textAlign="center"
            >
              BUILT WITH
            </Heading>
            <Image
              src={KeypomLogo}
              objectFit={"cover"}
              bgColor={"transparent"}
              position="relative"
              loading="eager"
              width="180px"
            />
          </VStack>
        </HStack>
      </VStack>
    );
  };

  return (
    <Box
      bg={`linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/assets/custom-button-bg.webp)`}
      backgroundPosition="center"
      backgroundSize="200% 200%"
      backgroundRepeat="no-repeat"
      width="100%"
      height="100vh"
    >
      <HStack px={16} py={10} justifyContent="space-between">
        {txnFeed()}
        {leaderboardAndGlobals()}
      </HStack>
    </Box>
  );
}
