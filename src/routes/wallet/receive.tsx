import { Heading, Text, VStack } from "@chakra-ui/react";
import QRCode from "react-qr-code";

import { PageHeading } from "@/components/ui/page-heading";

export default function Receive() {
  const account = {
    account_id: "anybody.testnet", // TODO: need to modify
    display_name: "No Name Account", // TODO: need to modify
  };

  return (
    <VStack p={4}>
      <PageHeading title="Receive" showBackButton />
      <VStack p={4}>
        <QRCode
          value={account.account_id}
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
            {account.display_name || "No Name Account"}
          </Heading>
          <Text
            fontFamily="mono"
            color="brand.400"
            textAlign={"center"}
            noOfLines={1}
          >
            {account.account_id}
          </Text>
        </VStack>
      </VStack>
    </VStack>
  );
}
