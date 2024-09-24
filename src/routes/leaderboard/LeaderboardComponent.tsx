// LeaderboardComponent.tsx
import React from "react";
import { VStack, HStack, Heading } from "@chakra-ui/react";
import { AccountId } from "./types"; // Adjust the import path accordingly
import { TopEarner } from "./TopEarner";

interface LeaderboardComponentProps {
  tokenLeaderboard: Array<[AccountId, string]>;
}

const LeaderboardComponent: React.FC<LeaderboardComponentProps> = ({
  tokenLeaderboard,
}) => {
  return (
    <VStack spacing={2}>
      <HStack alignItems="flex-end" spacing={4} pb={6}>
        <Heading as="h3" size="2xl" color="white" fontWeight="600">
          Leaderboard
        </Heading>
        <Heading
          as="h3"
          size="md"
          color="brand.400"
          fontWeight="600"
          alignSelf="flex-end"
        >
          TOP EARNERS
        </Heading>
      </HStack>
      {tokenLeaderboard.map((earner, index) => (
        <TopEarner key={index} earner={earner} index={index} />
      ))}
    </VStack>
  );
};

export default LeaderboardComponent;
