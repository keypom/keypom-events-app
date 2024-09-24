// Globals.tsx
import React from "react";
import { VStack, HStack, Heading, Text, Box } from "@chakra-ui/react";
import eventHelperInstance from "@/lib/event";

interface GlobalsProps {
  totalTransactions: number;
  totalTokensTransferred: string;
}

const Globals: React.FC<GlobalsProps> = ({
  totalTransactions,
  totalTokensTransferred,
}) => {
  return (
    <HStack spacing={10} pt={4}>
      <VStack>
        {/* TXS section */}
        <Heading as="h3" size="lg" color="white" fontWeight="400">
          {totalTransactions.toLocaleString()}
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
        {/* Tokens Transferred section */}
        <Heading as="h3" size="lg" color="white" fontWeight="400">
          {eventHelperInstance.yoctoToNearWith2Decimals(totalTokensTransferred)}
        </Heading>

        <HStack
          spacing={2}
          justifyContent="center"
          position="relative"
          alignItems="center"
          width="100%"
        >
          <Box
            width="100px"
            height="5.25px"
            bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
            position="relative"
          />

          <Text
            fontFamily="mono"
            fontSize="2xl"
            fontWeight="medium"
            color="transparent"
            data-testid="token-symbol"
          >
            T
          </Text>

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

export default Globals;
