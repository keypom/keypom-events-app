import { Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { AlertItem } from "@/components/alerts/alert-item";
import { ArrowIcon } from "@/components/icons";
import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import { fetchAlerts } from "@/lib/api/alerts";
import { useQuery } from "@tanstack/react-query";

export function Me() {
  // TODO: We may want to get the most recent alert in a better way, this can be cached.
  // We'll want to subscribe, and not have it rely on rerender.
  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
  });

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
      <VStack width="100%" p={4} spacing={8}>
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
        {alerts && alerts.length > 0 && <AlertItem {...alerts[0]} />}
      </VStack>
    </VStack>
  );
}
