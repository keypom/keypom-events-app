// TopEarner.tsx
import React from "react";
import { Box, HStack, Flex, Text } from "@chakra-ui/react";
import { getUsername } from "./helpers"; // Adjust the import path accordingly
import { AccountId } from "./types"; // Adjust the import path accordingly
import eventHelperInstance from "@/lib/event";

interface TopEarnerProps {
  earner: [AccountId, string];
  index: number;
}

export const TopEarner: React.FC<TopEarnerProps> = React.memo(
  ({ earner, index }) => {
    return (
      <Box
        key={index}
        px={2}
        py={2}
        borderRadius="md"
        bg="rgba(0, 0, 0, 0.95)"
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
              display="flex"
              alignItems="center"
              justifyContent="center"
              width="40px"
              mr={1}
            >
              <Text
                color="bg.primary"
                fontSize="3xl"
                textAlign="center"
                fontFamily="mono"
                fontWeight={500}
              >
                {index + 1}
              </Text>
            </Box>
            <Text
              ml={2}
              fontFamily="mono"
              fontSize="3xl"
              fontWeight={600}
              textAlign="left"
              color="white"
            >
              @{getUsername(earner[0])}
            </Text>
          </Flex>

          {/* Amount Section: Right justified */}
          <Flex minWidth="150px" alignItems="center" justifyContent="flex-end">
            <Text
              fontFamily="mono"
              fontSize="3xl"
              fontWeight={500}
              textAlign="center"
              color="brand.400"
            >
              {eventHelperInstance.yoctoToNearWith2Decimals(earner[1])}
            </Text>
          </Flex>
        </HStack>
      </Box>
    );
  },
);
