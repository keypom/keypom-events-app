import { VStack } from "@chakra-ui/react";

import { LatestAlert } from "@/components/alerts/latest-alert";
import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { useAccountData } from "@/hooks/useAccountData";

export default function Me() {
  const { data, isLoading, isError, error } = useAccountData();

  const accountId = isLoading || isError ? "------" : data?.accountId;

  if (isError) {
    console.error("Error loading account data: ", error);
  }

  return (
    <VStack spacing={4} pt={4}>
      <PageHeading
        title={"No-Name Profile"}
        titleSize="24px"
        description={`@${accountId}`}
      />
      <WalletActions />
      <LatestAlert />
    </VStack>
  );
}
