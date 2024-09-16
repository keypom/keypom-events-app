// SponsorDashboard.js
import { useState, useEffect, useContext } from "react";
import {
  Box,
  Heading,
  Button,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useAuthWalletContext } from "@/contexts/AuthWalletContext";
import { DropManager } from "./dropManager";

export function AdminDashboard() {
  const { selector, account } = useAuthWalletContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<CreatedConferenceDrop[]>([]);
  const toast = useToast();
  const [qrCodeUrls, setQrCodeUrls] = useState<string[]>([]);
  const [wallet, setWallet] = useState<Wallet>();

  useEffect(() => {
    async function fetchWallet() {
      if (!selector) return;
      try {
        const wallet = await selector.wallet();
        setWallet(wallet);
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    }

    fetchWallet();
  }, [selector]);

  const getAccountInformation = useCallback(async () => {
    try {
      const recoveredAccount = await eventHelperInstance.viewCall({
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "recover_account",
        args: { key_or_account_id: account?.public_key },
      });

      const tokens = await eventHelperInstance.viewCall({
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "ft_balance_of",
        args: { account_id: recoveredAccount.account_id },
      });
      setTokensAvailable(eventHelperInstance.yoctoToNearWith2Decimals(tokens));

      const drops = await eventHelperInstance.viewCall({
        contractId: KEYPOM_TOKEN_FACTORY_CONTRACT,
        methodName: "get_drops_created_by_account",
        args: { account_id: recoveredAccount.account_id },
      });
      setDropsCreated(drops);
    } catch (e) {
      console.error(e);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  }, [account?.public_key]);

  useEffect(() => {
    if (!account) return;
    getAccountInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <Box
      position="relative"
      width="100%"
      minHeight="100vh"
      bg="bg.primary"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box p={8}>
        {!isAuthenticated ? (
          <VStack spacing={4}>
            <Heading fontFamily="mono" color="white">
              Admin Login
            </Heading>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginError}
            />
            <Button onClick={handleNEARLogin} colorScheme="blue">
              Sign in with NEAR Wallet
            </Button>
          </VStack>
        ) : (
          <>
            {activeView === "main" && (
              <VStack spacing={6}>
                <Heading fontFamily="mono" color="white" textAlign="center">
                  Admin Dashboard
                </Heading>
                <HStack spacing={4}>
                  <Button
                    colorScheme="teal"
                    onClick={() => setActiveView("attendee")}
                  >
                    Open Attendee Dashboard
                  </Button>
                  <Button
                    colorScheme="blue"
                    onClick={() => setActiveView("drops")}
                  >
                    Manage Drops
                  </Button>
                </HStack>
                <Button colorScheme="red" onClick={handleLogout}>
                  Logout
                </Button>
              </VStack>
            )}
            {activeView === "attendee" && <AttendeeManager />}
            {activeView === "drops" && <DropManager />}
          </>
        )}
      </Box>
    </Box>
  );
}
