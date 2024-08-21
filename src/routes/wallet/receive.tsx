import { Heading, VStack, Text } from "@chakra-ui/react";
import QRCode from "react-qr-code";

import { useAuthWalletContext } from "@/contexts/AuthWalletContext";

import { PageHeading } from "@/components/ui/page-heading";

export function Receive() {
  const { account, isLoggedIn } = useAuthWalletContext();
  return (
    <VStack p={4}>
      <PageHeading title="Receive" />
      {isLoggedIn ? (
        <VStack p={4}>
          <QRCode
            value={account.account_id}
            bgColor="transparent"
            fgColor="var(--chakra-colors-brand-400)"
          />
          <VStack alignItems="center" p={4}>
            <Heading as="h3" fontSize="2xl" color="white" noOfLines={1}>
              {account.display_name || "No Name Account"}
            </Heading>
            <Text fontFamily="mono" color="brand.400" noOfLines={1}>
              {account.account_id}
            </Text>
          </VStack>
        </VStack>
      ) : (
        <Text>Please login to receive your account</Text>
      )}
    </VStack>
  );
}
