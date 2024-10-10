import React, { useState, useEffect } from "react";
import { Box, HStack, Flex, Text } from "@chakra-ui/react";
import { formatTimestamp, getUsername, rewardMessage } from "./helpers";
import { ArrowIcon, UserIcon } from "@/components/icons";
import { TransactionType } from "./types";

interface TransactionInFeedProps {
  tx: TransactionType | null;
  index: number;
}

export const TransactionInFeed: React.FC<TransactionInFeedProps> = React.memo(
  ({ tx, index }) => {
    const [timeAgo, setTimeAgo] = useState<string | undefined>();

    // Check if the transaction is a claim or transfer
    const isClaim = tx?.Claim !== undefined;

    useEffect(() => {
      let intervalId: NodeJS.Timeout | undefined;

      const updateTimeAgo = () => {
        const formattedTime = tx ? formatTimestamp(tx) : "-----";
        setTimeAgo(formattedTime);

        // Check if the time difference is now >= 60 seconds
        const timestamp = isClaim
          ? tx?.Claim?.timestamp
          : tx?.Transfer?.timestamp;
        if (!timestamp) return;

        const timestampInMs = timestamp / 1e6;
        const now = Date.now();
        const diffMs = now - timestampInMs;
        const diffSeconds = Math.floor(diffMs / 1000);

        if (diffSeconds >= 60 && intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      };

      updateTimeAgo(); // Initial call

      // Set up interval if the transaction is less than 60 seconds old
      const timestamp = isClaim
        ? tx?.Claim?.timestamp
        : tx?.Transfer?.timestamp;
      if (!timestamp) return;

      const timestampInMs = timestamp / 1e6;
      const now = Date.now();
      const diffMs = now - timestampInMs;
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 60) {
        intervalId = setInterval(updateTimeAgo, 1000);
      } else if (tx !== null) {
        setTimeAgo(formatTimestamp(tx)); // Set initial timeAgo for older transactions
      }

      // Clean up the interval when the component unmounts
      return () => {
        if (intervalId) {
          clearInterval(intervalId);
        }
      };
    }, [tx, isClaim]);

    // Default values in case tx or specific fields are missing
    const getSender = () => {
      if (!tx) return "-----";
      return tx.Transfer?.sender_id
        ? getUsername(tx.Transfer.sender_id)
        : getUsername(tx.Claim!.account_id);
    };
    const sender = getSender();
    const receiver = tx?.Transfer?.receiver_id
      ? `@${getUsername(tx.Transfer.receiver_id)}`
      : "-----";
    const message = tx ? rewardMessage(tx) : "-----";

    return (
      <Box
        key={index}
        px={6}
        py={4}
        borderRadius="md"
        bg="rgba(0, 0, 0, 0.7)"
        display="flex"
        alignItems="center"
        width="100%"
      >
        <HStack width="100%" justifyContent="space-between" spacing={4}>
          {/* Left Section */}
          <HStack>
            <UserIcon color={"var(--chakra-colors-brand-400)"} width={20} />
            <Text
              ml={2}
              fontFamily="mono"
              fontSize="lg"
              fontWeight={700}
              textAlign="left"
              color="white"
            >
              {sender}
            </Text>
          </HStack>

          {/* Center Section */}
          <HStack flex="1" justifyContent="center">
            <Text
              fontFamily="mono"
              fontSize="lg"
              fontWeight={700}
              textAlign="center"
              color="brand.400"
            >
              {message}
            </Text>
            <ArrowIcon color="white" width={20} />
            <Text fontWeight="700" color="brand.600">
              {timeAgo || "-----"}
            </Text>
          </HStack>

          {/* Right Section */}
          <Flex minWidth="150px" alignItems="center" justifyContent="flex-end">
            {isClaim ? (
              <HStack>
                <Text
                  mr={2}
                  fontFamily="mono"
                  fontSize="lg"
                  fontWeight={700}
                  textAlign="right"
                  color="white"
                >
                  Claim
                </Text>
                <UserIcon color="transparent" width={20} />
              </HStack>
            ) : (
              <HStack>
                <Text
                  mr={2}
                  fontFamily="mono"
                  fontSize="lg"
                  fontWeight={700}
                  textAlign="right"
                  color="white"
                >
                  {receiver}
                </Text>
                <UserIcon color={"var(--chakra-colors-brand-400)"} width={20} />
              </HStack>
            )}
          </Flex>
        </HStack>
      </Box>
    );
  },
);
