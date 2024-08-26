import { VStack, Flex, Heading, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PageHeading } from "@/components/ui/page-heading";
import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { ArrowIcon } from "@/components/icons";
import { Alert } from "@/components/alerts/alert";

export function Me() {
  const { accountId, account, isLoggedIn } = useAuthWalletContext();

  if (!isLoggedIn || !accountId || !account) {
    return <div>Please login to view your account</div>;
  }

  return (
    <VStack spacing={4} pt={4}>
      <PageHeading
        title={account.display_name || "No-Name Profile"}
        titleSize="24px"
        description={accountId}
      />
      <WalletActions />
      <VStack width="100%" px={8} pb={4} spacing={8}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          textAlign="center"
          gap={4}
        >
          <Heading as="h3" color="white" fontFamily="mono" fontSize="16px">
            [ALERTS]
          </Heading>
          <Button
            variant="navigation"
            as={Link}
            to="/alerts"
            flexDirection="row"
            padding="4px 8px"
            maxWidth={"max-content"}
            width="100%"
            fontSize="xs"
            gap="8px"
          >
            <span>VIEW ALL</span>
            <ArrowIcon direction="right" width={8} height={8} />
          </Button>
        </Flex>
        <Alert />
      </VStack>
    </VStack>
  );
}
