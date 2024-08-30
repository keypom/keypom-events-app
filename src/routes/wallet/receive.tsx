import { Heading, VStack, Text } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { useSearchParams } from "react-router-dom";

import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import { PageHeading } from "@/components/ui/page-heading";

export function Receive() {
  const { account, isLoggedIn } = useAuthWalletContext();

  const [params] = useSearchParams();
  const backUrl = params.get("backUrl");

  return (
    <VStack p={4}>
      <PageHeading title="Receive" showBackButton backUrl={backUrl || "/"} />
      {isLoggedIn ? (
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
      ) : (
        <Text>Please login to receive to your account</Text>
      )}
    </VStack>
  );
}
