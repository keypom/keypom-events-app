import { useState, useEffect, useCallback } from "react";
import { Box, Heading, VStack, Spinner } from "@chakra-ui/react";
import { DropManager } from "./dropManager";
import eventHelperInstance from "@/lib/event";
import { NotFound404 } from "@/components/dashboard/not-found-404";
import { Header } from "@/components/ui/header";
import { useSponsorDashParams } from "@/hooks/useSponsorDashParams";

export default function SponsorDashboard() {
  const { accountId, secretKey } = useSponsorDashParams();

  const [sponsorAccountId, setSponsorAccountId] = useState<string | null>(null);
  const [sponsorKey, setSponsorKey] = useState<string | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    try {
      if (accountId && secretKey) {
        setSponsorAccountId(accountId);
        setSponsorKey(secretKey);
      } else {
        const storedData = localStorage.getItem("SPONSOR_AUTH_TOKEN");
        if (!storedData) {
          return;
        }
        const { accountId: storedAccountId, secretKey: storedSecretKey } =
          JSON.parse(storedData);
        setSponsorAccountId(storedAccountId);
        setSponsorKey(storedSecretKey);
      }
    } catch (error) {
      eventHelperInstance.debugLog(
        `Failed to parse stored sponsor data: ${error}`,
        "error",
      );
      localStorage.removeItem("SPONSOR_AUTH_TOKEN");
    } finally {
      setIsLoading(false); // Ensure loading state is always updated
    }
  }, [setSponsorAccountId, setSponsorKey, accountId, secretKey]);

  const fetchSponsorConnectionData = useCallback(
    async (sponsorAccountId: string, sponsorKey: string) => {
      if (!sponsorAccountId || !sponsorKey) {
        return;
      }

      try {
        eventHelperInstance.debugLog(
          `Fetching sponsor connection data: ${sponsorAccountId}, ${sponsorKey}`,
          "log",
        );
        const recoveredAccount = await eventHelperInstance.viewCall({
          methodName: "recover_account",
          args: {
            key_or_account_id: eventHelperInstance.getPubFromSecret(sponsorKey),
          },
        });

        if (recoveredAccount.account_id !== sponsorAccountId) {
          throw new Error("Invalid account ID");
        }

        localStorage.setItem(
          "SPONSOR_AUTH_TOKEN",
          JSON.stringify({
            accountId: sponsorAccountId,
            secretKey: sponsorKey,
          }),
        );

        setIsValidated(recoveredAccount.account_status === "Sponsor");
        setIsLoading(false);
      } catch (error) {
        eventHelperInstance.debugLog(
          `Failed to fetch admin data: ${error}`,
          "error",
        );
        setIsErr(true);
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (sponsorAccountId && sponsorKey) {
      fetchSponsorConnectionData(sponsorAccountId, sponsorKey);
    }
  }, [sponsorAccountId, fetchSponsorConnectionData, sponsorKey]);

  const handleLogout = () => {
    localStorage.removeItem("SPONSOR_AUTH_TOKEN");
    setSponsorAccountId(null);
    setSponsorKey(null);
    setIsValidated(false);
  };

  if (isErr) {
    return (
      <NotFound404
        cta="Back"
        header="Account Unauthorized"
        subheader="Check the signed-in account and try again later."
        onClick={() => {
          handleLogout();
          window.location.reload();
        }}
      />
    );
  }

  if (isLoading) {
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
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  return (
    <Box position="relative" width="100%" minHeight="100vh" bg="bg.primary">
      {/* Header */}
      <Header sendTo="/sponsorDashboard" isConferenceOver={false} />

      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        zIndex={5}
        _before={{
          content: '""',
          position: "absolute",
          opacity: 0.7,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/assets/background.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
        }}
      >
        {!sponsorAccountId || !sponsorKey || !isValidated ? (
          <VStack spacing={4} pt="12">
            <Heading fontFamily="mono" color="white">
              Sponsor Login
            </Heading>
          </VStack>
        ) : (
          <>
            <DropManager
              setIsErr={setIsErr}
              accountId={sponsorAccountId}
              secretKey={sponsorKey}
            />
          </>
        )}
      </Box>
    </Box>
  );
}
