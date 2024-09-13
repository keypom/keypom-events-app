import { Flex, Heading, Text, VStack } from "@chakra-ui/react";
import QRCode from "react-qr-code";

import { PageHeading } from "@/components/ui/page-heading";
import { useAccountData } from "@/hooks/useAccountData";
import { LoadingBox } from "@/components/ui/loading-box";
import { ErrorBox } from "@/components/ui/error-box";
import { useEventCredentials } from "@/stores/event-credentials";

export default function Receive() {
  const { userData } = useEventCredentials();
  const { data, isLoading, isError, error } = useAccountData();

  // Check if data is available and destructure safely
  const displayAccountId = data?.displayAccountId;

  // Generate the QR value only if data is available
  const qrValue = displayAccountId ? `profile%%${displayAccountId}` : "";

  return (
    <VStack p={4}>
      <PageHeading title="Receive" showBackButton />
      <Flex
        align="center"
        flexDir="column"
        p={{ base: "6", md: "8" }}
        pt={{ base: "12", md: "16" }}
      >
        {isLoading && <LoadingBox />}
        {isError && <ErrorBox message={`Error: ${error?.message}`} />}{" "}
        {/* Error Handling */}
        {data && (
          <>
            <QRCode
              value={qrValue}
              bgColor="transparent"
              fgColor="var(--chakra-colors-brand-400)"
            />
            <VStack alignItems="center" p={4}>
              <Heading
                as="h3"
                fontSize="2xl"
                textAlign={"center"}
                color="white"
                noOfLines={1}
              >
                {userData.name}
              </Heading>
              <Text
                fontFamily="mono"
                color="brand.400"
                textAlign={"center"}
                noOfLines={1}
              >
                @{displayAccountId}
              </Text>
            </VStack>
          </>
        )}
      </Flex>
    </VStack>
  );
}
