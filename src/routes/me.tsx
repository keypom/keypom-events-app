import { VStack } from "@chakra-ui/react";

import { LatestAlert } from "@/components/alerts/latest-alert";
import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { useAccountData } from "@/hooks/useAccountData";

export default function Me() {
  const { data } = useAccountData();

  const accountId = data?.accountId || "------";

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
