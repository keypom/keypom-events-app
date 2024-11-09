import {
  Box,
  Heading,
  HStack,
  Image,
  ListItem,
  UnorderedList,
  VStack,
  useToast,
} from "@chakra-ui/react";
import RedactedExpression from "/assets/scan-bg.webp";
import { QrScanner } from "@/components/scanner/qr-scanner";
import { PageHeading } from "@/components/ui/page-heading";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
import { useAccountData } from "@/hooks/useAccountData";
import { ErrorBox } from "@/components/ui/error-box";
import { useExternalLinkModalStore } from "@/stores/external-link-modal";
import { ExternalLinkModal } from "@/components/modals/external-link-modal";
import { CameraAccess } from "@/components/ui/camera-access";
import { LoadingBox } from "@/components/ui/loading-box";

export default function Scan() {
  const navigate = useNavigate();
  const { secretKey } = useEventCredentials();
  const { data, isLoading, isError, error } = useAccountData();
  const { onOpen, setLink } = useExternalLinkModalStore();

  const accountId = data?.accountId;
  const displayAccountId = data?.displayAccountId;

  const toast = useToast();

  const [scanStatus, setScanStatus] = useState<"success" | "error">();
  const [statusMessage, setStatusMessage] = useState("");

  const handleScan = async (value: string): Promise<void> => {
    console.log("Scanning: ", value);

    if (!accountId || !secretKey) {
      console.log("Missing credentials");
      return;
    }

    setScanStatus(undefined);

    try {
      const qrData = value;

      const qrDataSplit = qrData.split("%%");
      eventHelperInstance.debugLog(`QR Data Split: ${qrDataSplit}`, "log");

      const type = qrDataSplit[0];
      if (!type) {
        return;
      }

      eventHelperInstance.debugLog(`QR Type: ${type}`, "log");
      eventHelperInstance.debugLog(`QR Data: ${data}`, "log");

      // Redirect based on the QR type, without claiming anything
      switch (type) {
        case "token":
        case "nft": {
          let dropSecret = qrDataSplit[1];
          let dropId = qrDataSplit[2];
          const isScav = qrDataSplit.length === 4 && qrDataSplit[1] === "piece";
          if (isScav) {
            dropSecret = qrDataSplit[2];
            dropId = qrDataSplit[3];
          }

          // Attempt to claim the drop
          await eventHelperInstance.claimEventDrop({
            secretKey,
            dropSecretKey: dropSecret,
            isScav,
            accountId,
            dropId,
          });

          eventHelperInstance.debugLog(
            `Navigating with state: ${dropSecret}`,
            "log",
          );
          navigate(`/scan/${encodeURIComponent(`${dropId}`)}`, {
            state: { secretKey: dropSecret },
          });

          // If the scan was successful, set success status
          setScanStatus("success");
          setStatusMessage("QR code scanned successfully");
          break;
        }
        case "food":
        case "merch":
          navigate(`/purchase/food`);
          break;
        case "profile": {
          const profile = qrDataSplit[1];
          if (profile === displayAccountId) {
            throw new Error("Cannot scan your own profile");
          }
          // Wait 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));
          navigate(`/wallet/send?to=${profile}`);
          break;
        }
        default: {
          if (!type.startsWith("https://")) {
            eventHelperInstance.debugLog(`Unhandled QR type: ${type}`, "error");
            throw new Error("Unrecognized QR type");
          }
          // Wait 500ms
          await new Promise((resolve) => setTimeout(resolve, 500));
          handleExternalLinkScan(type);
          break;
        }
      }
    } catch (error: any) {
      eventHelperInstance.debugLog(`Scan failed: ${error}`, "error");
      setScanStatus("error");
      setStatusMessage(`Error scanning QR code: ${error.message || error}`);
    } finally {
      console.log("Scanning complete");
    }
  };

  const handleExternalLinkScan = (externalLink: string) => {
    onOpen();
    setLink(externalLink);
  };

  useEffect(() => {
    if (scanStatus) {
      toast({
        title: scanStatus === "success" ? "Success" : "Error",
        description: statusMessage,
        status: scanStatus,
        duration: scanStatus === "success" ? 3000 : 5000,
        isClosable: true,
      });
      // Reset scanStatus after displaying the message
      setTimeout(() => {
        setScanStatus(undefined);
        setStatusMessage("");
      }, 3000);
    }
  }, [scanStatus, statusMessage, toast]);

  if (isLoading) {
    return <LoadingBox />;
  }

  return (
    <Box p={4} display={"flex"} flexDirection={"column"} gap={4}>
      <PageHeading title="Scan" />
      <VStack spacing={8} width="100%">
        <CameraAccess>
          <Box width="100%" height="100%" position={"relative"} px={4}>
            <Image
              src={RedactedExpression}
              alt="Redacted Expression"
              width="100%"
              height="220px"
              objectFit={"cover"}
              loading="eager"
              position="absolute"
              top="50%"
              left="0"
              transform="translateY(-50%)"
              zIndex={-1}
            />
            {isError && <ErrorBox message={`Error: ${error?.message}`} />}
            <Box display={"flex"} justifyContent={"center"} alignItems="center">
              <QrScanner
                handleScan={handleScan}
                scanStatus={scanStatus}
                allowMultiple={true}
                scanDelay={1000}
              />
            </Box>
          </Box>
          <HStack
            width="100%"
            justifyContent={"space-between"}
            alignItems="flex-start"
            gap={4}
            px={4}
            wrap={"wrap"}
          >
            <VStack alignItems="flex-start" gap={4}>
              <Heading as="h3" fontSize="2xl" color="white">
                Earn:
              </Heading>
              <UnorderedList color="brand.400" fontFamily="mono">
                <ListItem>Attending Talks</ListItem>
                <ListItem>Visiting Booths</ListItem>
                <ListItem>Scavenger Hunts</ListItem>
                <ListItem>Sponsor Quizzes</ListItem>
                <ListItem>and more.</ListItem>
              </UnorderedList>
            </VStack>
            <VStack alignItems="flex-start" gap={4}>
              <Heading as="h3" fontSize="2xl" color="white">
                Spend:
              </Heading>
              <UnorderedList color="brand.400" fontFamily="mono">
                <ListItem>Swag</ListItem>
                <ListItem>Food</ListItem>
                <ListItem>Raffles</ListItem>
                <ListItem>NFTs</ListItem>
                <ListItem>and more.</ListItem>
              </UnorderedList>
            </VStack>
          </HStack>
        </CameraAccess>
      </VStack>
      <ExternalLinkModal />
    </Box>
  );
}
