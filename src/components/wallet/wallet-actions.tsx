import { ArrowIcon, ScanIcon } from "@/components/icons";
import { useAccountData } from "@/hooks/useAccountData";
import { useConferenceData } from "@/hooks/useConferenceData";
import { Box, Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function WalletActions() {
  const { data, isLoading, isError } = useAccountData();
  const { data: conferenceData } = useConferenceData();

  const balance = isLoading || isError ? "-----" : data?.balance;

  const symbol = conferenceData?.tokenInfo.symbol || "---";

  return (
    <>
      <VStack spacing={2} width={"100%"}>
        <Heading
          fontFamily="mono"
          fontSize="64px"
          color="white"
          fontWeight="400"
          textAlign="center"
          data-testid="wallet-balance"
        >
          {balance}
        </Heading>
        <HStack spacing={2}>
          <Box
            width="115px"
            height="5.25px"
            bg="url(/redacted-wallet.webp) 100% / cover no-repeat"
          />
          <Text
            fontFamily="mono"
            fontSize="2xl"
            fontWeight="medium"
            color="brand.400"
            data-testid="token-symbol"
          >
            ${symbol}
          </Text>
          <Box
            width="115px"
            height="5.25px"
            bg="url(/redacted-wallet.webp) 100% / cover no-repeat"
          />
        </HStack>
      </VStack>
      <HStack
        spacing={2}
        width="100%"
        p={4}
        bg="url(/redacted-button.webp) 50% / cover no-repeat"
      >
        <Button variant="navigation" as={Link} to={`/wallet/send`}>
          <ArrowIcon width={24} height={24} direction="up" />
          <span>Send</span>
        </Button>
        <Button variant="navigation" as={Link} to={`/wallet/receive`}>
          <ArrowIcon width={24} height={24} direction="down" />
          <span>Receive</span>
        </Button>
        <Button variant="navigation" as={Link} to="/scan">
          <ScanIcon width={24} height={24} />
          <span>Scan</span>
        </Button>
      </HStack>
    </>
  );
}
