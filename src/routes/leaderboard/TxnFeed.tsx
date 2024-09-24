// TxnFeed.tsx
import React from "react";
import { VStack, HStack, Heading } from "@chakra-ui/react";
import { Redacted } from "@/components/icons";
import { TransactionType } from "./types"; // Adjust the import path accordingly
import { TransactionInFeed } from "./TransactonInFeed";

interface TxnFeedProps {
  recentTransactions: TransactionType[];
}

const TxnFeed: React.FC<TxnFeedProps> = ({ recentTransactions }) => {
  return (
    <VStack width={["100%", "100%", "60%"]} spacing={3}>
      <HStack spacing={16} alignSelf="flex-start" width="100%" pb={4}>
        <Redacted width="400px" height="100px" />
        <Heading
          as="h3"
          size={["lg", "xl", "4xl"]}
          color="white"
          fontWeight="400"
        >
          TX FEED
        </Heading>
      </HStack>
      {recentTransactions.map((tx, index) => (
        <TransactionInFeed key={index} tx={tx} index={index} />
      ))}
    </VStack>
  );
};

export default TxnFeed;
