import { Box, Button, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { CollectiblesIcon, JourneysIcon } from "@/components/icons";
import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";

export default function Wallet() {
  return (
    <VStack spacing={4}>
      <Box p={4} pb={0}>
        <PageHeading title="Wallet" />
      </Box>
      <WalletActions />
      <VStack width="100%" p={4} pt={0} spacing={4}>
        <Button as={Link} to="/wallet/collectibles" variant="redacted">
          <CollectiblesIcon color="var(--chakra-colors-brand-400)" />{" "}
          COLLECTIBLES
        </Button>
        <Button as={Link} to="/wallet/journeys" variant="redacted">
          <JourneysIcon color="var(--chakra-colors-brand-400)" /> JOURNEYS
        </Button>
      </VStack>
    </VStack>
  );
}
