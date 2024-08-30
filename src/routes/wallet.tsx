import { Button, VStack, Text, Box } from "@chakra-ui/react";
import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import { Link } from "react-router-dom";

import { PageHeading } from "@/components/ui/page-heading";
import { WalletActions } from "@/components/wallet/wallet-actions";
import { CollectiblesIcon, JourneysIcon } from "@/components/icons";

import "@near-wallet-selector/modal-ui/styles.css";

export function Wallet() {
  const { modal, isLoggedIn } = useAuthWalletContext();
  const handleConnectWallet = () => {
    if (!modal) {
      console.error("Modal not initialized");
      return;
    }
    modal.show();
  };

  return (
    <VStack spacing={4}>
      <Box p={4} pb={0}>
        <PageHeading title="Wallet" />
      </Box>
      {isLoggedIn ? (
        <>
          <WalletActions backUrl={`/wallet`} />
          <VStack width="100%" p={4} pt={0} spacing={4}>
            <Button as={Link} to="/wallet/collectibles" variant="redacted">
              <CollectiblesIcon color="var(--chakra-colors-brand-400)" />{" "}
              COLLECTIBLES
            </Button>
            <Button as={Link} to="/wallet/journeys" variant="redacted">
              <JourneysIcon color="var(--chakra-colors-brand-400)" /> JOURNEYS
            </Button>
          </VStack>
        </>
      ) : (
        <Box p={4}>
          <Text>Please Login in order to continue</Text>
          <Button onClick={handleConnectWallet}>Connect Wallet</Button>
        </Box>
      )}
    </VStack>
  );
}
