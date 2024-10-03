// LeaderboardAndGlobals.tsx
import React from "react";
import { VStack, HStack, Image, Heading } from "@chakra-ui/react";
import Globals from "./Globals"; // Adjust the import path accordingly
import LeaderboardComponent from "./LeaderboardComponent"; // Adjust the import path accordingly
import NearLogo from "/assets/near-logo.webp";
import KeypomLogo from "/assets/keypom-logo.webp";
import { TopTokenEarnerData } from "./types"; // Adjust the import path accordingly

interface LeaderboardAndGlobalsProps {
  totalTransactions: number;
  totalTokensTransferred: string;
  tokenLeaderboard: Array<TopTokenEarnerData | null>;
}

const LeaderboardAndGlobals: React.FC<LeaderboardAndGlobalsProps> = ({
  totalTransactions,
  totalTokensTransferred,
  tokenLeaderboard,
}) => {
  return (
    <VStack
      width={["100%", "100%", "40%"]}
      height="100%"
      justifyContent="space-between"
      spacing={20}
      mt={[10, 10, 0]}
    >
      <Globals
        totalTransactions={totalTransactions}
        totalTokensTransferred={totalTokensTransferred}
      />
      <LeaderboardComponent tokenLeaderboard={tokenLeaderboard} />

      <HStack spacing={16} alignItems="center">
        <VStack spacing={4} alignItems="center">
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
            objectFit="cover"
            bgColor="transparent"
            position="relative"
            loading="eager"
            width={["120px", "150px", "180px"]}
          />
        </VStack>

        <VStack spacing={4} alignItems="center">
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
            objectFit="cover"
            bgColor="transparent"
            position="relative"
            loading="eager"
            width={["120px", "150px", "180px"]}
          />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default LeaderboardAndGlobals;
