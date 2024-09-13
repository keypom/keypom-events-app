/* eslint-disable react-hooks/exhaustive-deps */

import { Box, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { QrScanner } from "@/components/scanner/qr-scanner";
import { AttendeeKeyInfo, TicketTypeInfo } from "@/lib/helpers/events";
import eventHelperInstance from "@/lib/event";
import { GLOBAL_EVENT_INFO } from "@/constants/eventInfo";
import { decodeAndParseBase64 } from "@/lib/helpers/crypto";

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  ticketsToScan: string[];
  allTicketOptions: TicketTypeInfo[];
  ticketToVerify: string;
  isProcessing: boolean;
}

export default function Scanner() {
  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    ticketsToScan: [],
    allTicketOptions: [],
    ticketToVerify: "",
    isProcessing: false,
  });

  const [ticketsToScan, setTicketsToScan] = useState<string[]>([]);

  useEffect(() => {
    stateRef.current.ticketsToScan = ticketsToScan;
    // Update other state variables in stateRef.current as needed
  }, [ticketsToScan]);

  useEffect(() => {
    // Process tickets in batches but only if not currently processing
    if (
      !stateRef.current.isProcessing &&
      stateRef.current.ticketsToScan.length > 0
    ) {
      processBatchOfTickets();
    }
  }, [ticketsToScan]);

  const handleScanResult = async (qrData: string) => {
    console.log("Scan result", qrData);
    const { ticket: secretKey } = decodeAndParseBase64(qrData);
    console.log("Scan result", secretKey);
    try {
      const pubKey = eventHelperInstance.getPubFromSecret(secretKey);
      const keyInfo: AttendeeKeyInfo | undefined =
        await eventHelperInstance.viewCall({
          methodName: "get_key_information",
          args: { key: pubKey },
        });
      console.log("Scan result", keyInfo);
      if (keyInfo) {
        // Check if the ticket has already been scanned
        if (stateRef.current.ticketsToScan.includes(secretKey)) {
          // This now correctly checks against the most up-to-date ticketsToScan
          throw new Error("Ticket already scanned.");
        }

        if (keyInfo.has_scanned === true) {
          throw new Error("Ticket has already been used.");
        }

        // Update both the ref and the state to enqueue the ticket
        const updatedTickets = [...stateRef.current.ticketsToScan, secretKey];
        stateRef.current.ticketsToScan = updatedTickets;
        setTicketsToScan(updatedTickets);

        return Promise.resolve({ message: "Ticket successfully scanned." });
      } else {
        throw new Error("No ticket information found.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Scan failed", err);
      throw new Error(`${err.message}`);
    }
  };

  const processBatchOfTickets = async () => {
    stateRef.current.isProcessing = true;
    // Take up to 10 tickets to process
    const ticketsToProcess = stateRef.current.ticketsToScan.slice(0, 10);

    await Promise.all(
      ticketsToProcess.map(async (ticket) => {
        try {
          // Placeholder for your actual ticket processing logic
          await eventHelperInstance.handleScanIntoEvent({ secretKey: ticket });
          // Process successful, remove from the ref queue
          stateRef.current.ticketsToScan =
            stateRef.current.ticketsToScan.filter((t) => t !== ticket);
        } catch (error) {
          console.error("Error processing ticket:", ticket, error);
          // Decide how to handle errors, e.g., retry later, log, etc.
        }
      }),
    );

    // Update the ticketsToScan state to trigger re-render if needed
    setTicketsToScan([...stateRef.current.ticketsToScan]);
    stateRef.current.isProcessing = false;

    // Check if more tickets are in the queue and continue processing
    if (stateRef.current.ticketsToScan.length > 0) {
      processBatchOfTickets();
    }
  };

  return (
    <Box marginTop="6" mb={{ base: "5", md: "14" }} minH="100%" minW="100%">
      <Center>
        <VStack spacing="0" w="100%">
          <VStack marginBottom="6" spacing="4">
            <Heading textAlign="center">
              Scanning Tickets For {GLOBAL_EVENT_INFO.name}
            </Heading>
          </VStack>

          <Center marginBottom="1" marginTop="6" w="100%">
            <VStack
              alignItems="center"
              h="100%"
              maxHeight="500px"
              maxW="500px"
              overflow="hidden"
              position="relative" // Ensure this container is positioned relatively
              spacing={4}
              w="full"
            >
              <QrScanner handleScan={handleScanResult} scanStatus="success" />
            </VStack>
          </Center>
          {ticketsToScan.length > 0 ? (
            <Text color="gray.500">
              Processing {ticketsToScan.length} tickets in the background...
            </Text>
          ) : (
            <Text color="gray.500">Waiting for QR code...</Text>
          )}
        </VStack>
      </Center>
    </Box>
  );
}
