/* eslint-disable react-hooks/exhaustive-deps */

import {
  Box,
  Button,
  Center,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { NotFound404 } from "@/components/dashboard/NotFound404";
import { KEYPOM_EVENTS_CONTRACT } from "@/constants/common";
import { useTicketScanningParams } from "@/hooks/useTicketScanningParams";
import {
  type DateAndTimeInfo,
  type EventDrop,
  type FunderEventMetadata,
  type TicketMetadataExtra,
} from "@/lib/eventsHelper";
import keypomInstance from "@/lib/keypom";
import { dateAndTimeToText } from "@/utils/parseDates";

import { QrScanner } from "@/components/scanner/qr-scanner";
import { getDropFromSecretKey, validateDrop } from "./helpers";

interface StateRefObject {
  isScanning: boolean;
  isOnCooldown: boolean;
  ticketsToScan: string[];
  allTicketOptions: EventDrop[];
  ticktToVerify: string;
  isProcessing: boolean;
}

export default function Scanner() {
  const { funderId, eventId } = useTicketScanningParams();
  const navigate = useNavigate();

  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [ticketOptions, setTicketOptions] = useState<
    Array<{ dropId: string; name: string; validThrough: DateAndTimeInfo }>
  >([{ dropId: "", name: "All Tickets", validThrough: { startDate: 0 } }]);
  const [isErr, setIsErr] = useState(false);
  const [ticketToVerify, setTicketToVerify] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const stateRef = useRef<StateRefObject>({
    isScanning: false,
    isOnCooldown: false,
    ticketsToScan: [],
    allTicketOptions: [],
    ticktToVerify: "",
    isProcessing: false,
  });

  const [allTicketOptions, setAllTicketOptions] = useState<EventDrop[]>();

  const [ticketsToScan, setTicketsToScan] = useState<string[]>([]);

  useEffect(() => {
    if (eventId === "" || funderId === "") navigate("/drops");
    if (!eventId || !funderId) return;

    const getEventData = async () => {
      try {
        const eventInfo: FunderEventMetadata | null =
          await keypomInstance.getEventInfo({
            accountId: funderId,
            eventId,
          });
        if (eventInfo == null || Object.keys(eventInfo).length === 0) {
          setIsErr(true);
          return;
        }
        setEventInfo(eventInfo);
      } catch (e) {
        console.error(e);
        setIsErr(true);
      }
    };

    getEventData();
  }, [eventId, funderId]);

  useEffect(() => {
    if (eventId === "" || funderId === "") navigate("/drops");
    if (!eventId || !funderId) return;

    const getEventTickets = async () => {
      try {
        const ticketsReturned: EventDrop[] =
          await keypomInstance.getTicketsForEventId({
            accountId: funderId,
            eventId,
          });
        setAllTicketOptions(ticketsReturned);

        const ticketOptions: Array<{
          dropId: string;
          name: string;
          validThrough: DateAndTimeInfo;
        }> = [
          { dropId: "", name: "All Tickets", validThrough: { startDate: 0 } },
        ];
        ticketsReturned.forEach((ticket) => {
          const extra: TicketMetadataExtra = JSON.parse(
            ticket.drop_config.nft_keys_config.token_metadata.extra,
          );
          ticketOptions.push({
            dropId: ticket.drop_id,
            name: ticket.drop_config.nft_keys_config.token_metadata.title,
            validThrough: extra.passValidThrough,
          });
        });
        setTicketOptions(ticketOptions);
      } catch (e) {
        console.error("error getting event tickets:", e);
        setIsErr(true);
      }
    };

    getEventTickets();
  }, [eventId, funderId]);

  useEffect(() => {
    stateRef.current.ticketsToScan = ticketsToScan;
    stateRef.current.allTicketOptions = allTicketOptions || [];
    stateRef.current.ticktToVerify = ticketToVerify;
    // Update other state variables in stateRef.current as needed
  }, [ticketsToScan, allTicketOptions, ticketToVerify]);

  useEffect(() => {
    // Process tickets in batches but only if not currently processing
    if (
      !stateRef.current.isProcessing &&
      stateRef.current.ticketsToScan.length > 0
    ) {
      processBatchOfTickets();
    }
  }, [ticketsToScan]);

  const handleScanResult = async (secretKey: string) => {
    setIsScanning(true);
    try {
      console.log("Scanning result:", secretKey);
      const dropInfo = await getDropFromSecretKey(secretKey);
      if (dropInfo) {
        const { drop, usesRemaining, maxKeyUses } = dropInfo;
        const curUse = maxKeyUses - usesRemaining + 1;
        // Check if the ticket has already been scanned
        if (stateRef.current.ticketsToScan.includes(secretKey)) {
          // This now correctly checks against the most up-to-date ticketsToScan
          throw new Error("Ticket already scanned.");
        }

        if (curUse !== 1) {
          throw new Error("Ticket has already been used.");
        }

        // Suppose you have a function to validate the ticket
        const { status, message } = validateDrop({
          drop,
          allTicketOptions: stateRef.current.allTicketOptions,
          ticketToVerify: stateRef.current.ticktToVerify,
        });

        // If the ticket is valid, update the state to include the new ticket
        if (status === "success") {
          // Update both the ref and the state to enqueue the ticket
          const updatedTickets = [...stateRef.current.ticketsToScan, secretKey];
          stateRef.current.ticketsToScan = updatedTickets;
          setTicketsToScan(updatedTickets);
        }
        return Promise.resolve({ message });
      } else {
        throw new Error("No ticket information found.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Scan failed", err);
      throw new Error(
        `Error scanning the ticket: ${err.message}. Please try again.`,
      );
    } finally {
      setIsScanning(false);
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
          await keypomInstance.claimEventTicket(ticket, {
            account_id: KEYPOM_EVENTS_CONTRACT,
          });
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

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Event Not Found"
        subheader="Please check the URL and try again."
      />
    );
  }

  if (!allTicketOptions || !eventInfo) {
    return (
      <Center h="100vh">
        {" "}
        {/* Adjust the height as needed */}
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box marginTop="6" mb={{ base: "5", md: "14" }} minH="100%" minW="100%">
      <Center>
        <VStack spacing="0" w="100%">
          <VStack marginBottom="6" spacing="4">
            <Heading textAlign="center">
              Scanning Tickets For {eventInfo?.name}
            </Heading>
            <VStack spacing="1">
              <Heading fontFamily="body" fontSize="lg" textAlign="center">
                Currently Scanning For{" "}
                {
                  ticketOptions.find(
                    (option) => option.dropId === ticketToVerify,
                  )?.name
                }
              </Heading>
              {ticketToVerify !== "" && (
                <Heading
                  fontFamily="body"
                  fontSize="md"
                  fontWeight="400"
                  textAlign="center"
                  textColor="gray.500"
                >
                  Valid Through:{" "}
                  {dateAndTimeToText(
                    ticketOptions.find(
                      (option) => option.dropId === ticketToVerify,
                    )!.validThrough,
                  )}
                </Heading>
              )}
            </VStack>
          </VStack>

          {/* Dropdown for selecting ticket types */}
          <Menu matchWidth>
            {({ isOpen }) => (
              <Box maxW="500px" w="full">
                <MenuButton
                  as={Button}
                  bg="border.box"
                  border="2px solid transparent"
                  borderRadius="6xl"
                  isActive={isOpen}
                  isDisabled={isScanning}
                  px="6"
                  py="3"
                  w="100%"
                >
                  <Center>
                    {/* You can customize this part as needed */}
                    <Text>Select Ticket Type To Scan</Text>
                  </Center>
                </MenuButton>
                <MenuList borderRadius="md" boxShadow="xl" py="0" zIndex={2}>
                  {ticketOptions.map((option, index) => (
                    <MenuItem
                      key={`${option.dropId}-${index}`}
                      onClick={() => {
                        setTicketToVerify(option.dropId);
                      }}
                    >
                      {option.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Box>
            )}
          </Menu>
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
              <QrScanner handleScan={handleScanResult} />
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
