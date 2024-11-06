/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { QrScanner } from "@/components/scanner/qr-scanner";
import eventHelperInstance from "@/lib/event";
import { decodeAndParseBase64 } from "@/lib/helpers/crypto";
import { AttendeeKeyInfo } from "@/lib/helpers/events";
import { UserData } from "@/stores/event-credentials";
import { CameraAccess } from "@/components/ui/camera-access";

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  ticketToScan: string | null;
  ticketToVerify: string;
  isProcessing: boolean;
}

export default function Scanner() {
  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    ticketToScan: null,
    ticketToVerify: "",
    isProcessing: false,
  });

  const [ticketToScan, setTicketToScan] = useState<string | null>(null);
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<"success" | "error" | undefined>(
    undefined,
  );

  const toast = useToast();

  useEffect(() => {
    stateRef.current.ticketToScan = ticketToScan;
  }, [ticketToScan]);

  const handleScanResult = async (qrData: string) => {
    setScanStatus(undefined);

    let userData: UserData | null = null;
    let secretKey: string | null = null;
    try {
      const { ticket: parsedTicket, userData: parsedUserData } =
        decodeAndParseBase64(qrData);
      userData = parsedUserData;
      secretKey = parsedTicket;
    } catch (e) {
      console.error(e);
      return;
    }

    if (!userData || !secretKey) {
      return;
    }
    setCurrentUserData(userData);

    try {
      const pubKey = eventHelperInstance.getPubFromSecret(secretKey);
      const keyInfo: AttendeeKeyInfo | undefined =
        await eventHelperInstance.viewCall({
          methodName: "get_key_information",
          args: { key: pubKey },
        });

      console.log("keyInfo: ", keyInfo);

      if (keyInfo) {
        if (stateRef.current.ticketToScan === String(secretKey)) {
          throw new Error("Ticket already scanned.");
        }

        if (keyInfo.has_scanned === true) {
          throw new Error("Ticket has already been used.");
        }

        // wait 1 second
        await new Promise((resolve) => setTimeout(resolve, 200));

        stateRef.current.ticketToScan = secretKey;
        setTicketToScan(secretKey);

        // Show toast for successful scan
        toast({
          title: "Ticket valid",
          description: "Proceed with ID verification.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setIsVerifying(true);
        setScanStatus("success");

        return Promise.resolve({ message: "Ticket successfully scanned." });
      } else {
        throw new Error("No ticket information found.");
      }
    } catch (err: any) {
      console.error("Scan failed", err);
      toast({
        title: "Ticket invalid",
        description: err.message,
        status: "error",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      setScanStatus("error");
      throw new Error(`${err.message}`);
    }
  };

  const processTicket = async () => {
    setIsProcessing(true); // Start the processing animation

    const ticket = stateRef.current.ticketToScan; // Process the first ticket in the queue
    if (!ticket) {
      return;
    }

    try {
      await eventHelperInstance.handleScanIntoEvent({ secretKey: ticket });
      stateRef.current.ticketToScan = null;
    } catch (error) {
      console.error("Error processing ticket:", ticket, error);
    }

    setIsProcessing(false); // End the processing animation
    setIsVerifying(false); // Go back to scanning mode
    setScanStatus(undefined);
    setTicketToScan(null);
    setCurrentUserData(null); // Clear user data
  };

  const handleBackClicked = () => {
    setIsProcessing(false); // End the processing animation
    setIsVerifying(false); // Go back to scanning mode
    setTicketToScan(null);
    setScanStatus(undefined);
    setCurrentUserData(null); // Clear user data
  };

  const handleConfirmAndScanNext = () => {
    processTicket();
  };

  return (
    <VStack
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      p="4"
      width="100%"
      spacing={4}
    >
      {isVerifying ? (
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
          px={4}
          width="100%"
          flexGrow={1}
        >
          <Heading textAlign="center" size="lg" pb="2">
            VERIFY WITH ID:
          </Heading>
          <Heading textAlign="center" size="sm" color="brand.400">
            You should see the following:
          </Heading>

          <VStack w="100%" alignItems="flex-start" spacing="12" mt="12" px="12">
            <VStack w="100%" alignItems="flex-start">
              <Heading textAlign="left" size="md" color="brand.400">
                NAME:
              </Heading>
              <Text
                textAlign="left"
                fontSize="md"
                fontFamily="mono"
                wordBreak="break-all"
              >
                {currentUserData?.name}
              </Text>
            </VStack>
            <VStack w="100%" alignItems="flex-start">
              <Heading textAlign="left" size="md" color="brand.400">
                EMAIL:
              </Heading>
              <Text
                textAlign="left"
                fontSize="md"
                wordBreak="break-all"
                fontFamily="mono"
              >
                {currentUserData?.email}
              </Text>
            </VStack>
          </VStack>

          <VStack w="100%" alignItems="center" spacing="4" mt="12">
            <Button
              variant="outline"
              onClick={handleBackClicked}
              width="100%"
              fontSize="md"
            >
              BACK
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmAndScanNext}
              width="100%"
              fontSize="md"
              isLoading={isProcessing} // Show loading animation if processing
            >
              {isProcessing ? (
                <Spinner size="md" />
              ) : (
                "CONFIRM & SCAN NEXT TICKET"
              )}
            </Button>
          </VStack>
        </Box>
      ) : (
        <Center>
          <VStack spacing="0" w="100%">
            <VStack marginBottom="0" spacing="4">
              <Heading textAlign="center" size="xl">
                SCAN A TICKET
              </Heading>
            </VStack>
            <CameraAccess>
              <Center marginBottom="1" marginTop="6" w="100%">
                <VStack
                  alignItems="center"
                  h="100%"
                  maxHeight="500px"
                  maxW="500px"
                  overflow="hidden"
                  position="relative"
                  spacing={4}
                  w="full"
                >
                  <QrScanner
                    handleScan={handleScanResult}
                    scanStatus={scanStatus}
                  />
                </VStack>
              </Center>
            </CameraAccess>
          </VStack>
        </Center>
      )}
    </VStack>
  );
}
