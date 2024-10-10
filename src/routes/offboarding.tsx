import { Button, HStack, Image, Text, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { useAccountData } from "@/hooks/useAccountData";
import { useEventCredentials } from "@/stores/event-credentials";
import { ActivitySummary } from "@/components/wallet/activity-summary";
import KeypomLogo from "/assets/keypom-logo.png";
import BitteLogo from "/assets/bitte-logo-white.png";
import { XIcon } from "@/components/icons/poweredx";
import { NETWORK_ID } from "@/constants/common";

export default function OffboardingPage() {
  console.log("Offboarding Page");
  const { userData, secretKey } = useEventCredentials();
  const { data, isLoading, isError, error } = useAccountData();

  const displayName = isLoading || isError ? "------" : data?.displayAccountId;
  console.log("display name: ", data?.accountId);

  if (isError) {
    console.error("Error loading account data: ", error);
  }

  const handleSecureWalletClick = () => {
    const accountId = data?.accountId;
    const baseUrl =
      NETWORK_ID === "testnet"
        ? "https://testnet.wallet.bitte.ai/offboard"
        : "https://wallet.bitte.ai/offboard";
    const url = `${baseUrl}#accountId=${accountId}&privateKey=${secretKey}`;

    window.location.href = url;
  };

  return (
    <VStack spacing={4} pt={4} mx={4}>
      <PageHeading
        title={`${userData.name}`}
        titleSize="24px"
        description={`@${displayName}`}
      />

      <ActivitySummary />
      <Text
        textAlign={"center"}
        fontSize={"xs"}
        pt={{ base: 2, iphone13: 2, iphone14ProMax: 4 }}
      >
        You can now reclaim the assets you’ve collected throughout the
        conference. All SOV will be burnt.
      </Text>
      <Button
        variant="primary"
        mt={6}
        height="40px"
        fontSize="14px"
        onClick={handleSecureWalletClick}
        width="100%"
      >
        SAVE ASSETS & SECURE WALLET
      </Button>
      {/* Center the XIcon and logos */}
      <HStack spacing={6} justifyContent="center" width="100%">
        <Image
          src={KeypomLogo}
          objectFit="cover"
          bgColor="transparent"
          position="relative"
          loading="eager"
          width="120px"
        />
        <XIcon
          color={"var(--chakra-colors-brand-400)"}
          width={14} // increased width for visibility
          height={14} // increased height for visibility
        />
        <Image
          src={BitteLogo}
          objectFit="cover"
          bgColor="transparent"
          position="relative"
          loading="eager"
          mr="20px"
          width="100px"
        />
      </HStack>
    </VStack>
  );
}
