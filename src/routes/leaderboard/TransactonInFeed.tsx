// TopEarner.tsx
import React from "react";
import { Box, HStack, Flex, Text } from "@chakra-ui/react";
import { formatTimestamp, getUsername, rewardMessage } from "./helpers"; // Adjust the import path accordingly
import { ArrowIcon, UserIcon } from "@/components/icons";
import { TransactionType } from "./types";

interface TransactionInFeedProps {
  tx: TransactionType;
  index: number;
}

export const TransactionInFeed: React.FC<TransactionInFeedProps> = React.memo(
  ({ tx, index }) => {
    const isClaim = tx.Claim !== undefined;
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
              @
              {getUsername(
                isClaim ? tx.Claim!.account_id : tx.Transfer!.sender_id,
              )}
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
              {rewardMessage(tx)}
            </Text>
            <ArrowIcon color="white" width={20} />
            <Text fontWeight="700" color="brand.600">
              {formatTimestamp(tx)}
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
                  @{getUsername(tx.Transfer?.receiver_id)}
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
