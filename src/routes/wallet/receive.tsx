import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import QRCode from "react-qr-code";

import { PageHeading } from "@/components/ui/page-heading";
import { useAccountData } from "@/hooks/useAccountData";

export default function Receive() {
  const { data } = useAccountData();

  const { accountId, displayName } = data!;
  const qrValue = `${window.origin}/wallet/send?to=${accountId}`;

  return (
    <VStack p={4}>
      <PageHeading title="Receive" showBackButton />
        <Flex
          align="center"
          flexDir="column"
          p={{ base: "6", md: "8" }}
          pt={{ base: "12", md: "16" }}
        >
          <QRCode
            value={qrValue}
            bgColor="transparent"
            fgColor="var(--chakra-colors-brand-400)"
          />
          <VStack alignItems="center" p={4}>
            <Heading
              as="h3"
              fontSize="2xl"
              textAlign={"center"}
              color="white"
              noOfLines={1}
            >
              {displayName || "No Name Account"}
            </Heading>
            <Text
              fontFamily="mono"
              color="brand.400"
              textAlign={"center"}
              noOfLines={1}
            >
              {accountId}
            </Text>
          </VStack>
        </Flex>
    </VStack>
  );
}
