import { VStack } from "@chakra-ui/react";

import { LatestAlert } from "@/components/alerts/latest-alert";
import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { useAccountData } from "@/hooks/useAccountData";

export default function Me() {
  const { data, isLoading, isError, error } = useAccountData();

  const displayName = isLoading || isError ? "------" : data?.displayAccountId;

  if (isError) {
    console.error("Error loading account data: ", error);
  }

  return (
    <VStack spacing={4} pt={4}>
      <PageHeading
        title={`Welcome ${data?.userData ? data.userData.name : "Loading..."}`}
        titleSize="24px"
        description={`Username: @${displayName}`}
      />
      <WalletActions />
      <LatestAlert />
    </VStack>
  );
}
