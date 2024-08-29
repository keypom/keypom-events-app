import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { getPubFromSecret } from "@keypom/core";

import { IconBox } from "@/components/dashboard/iconBox";
import { BoxWithShape } from "@/components/tickets/BoxWithShape";
import { QrDetails } from "@/components/tickets/QrDetails";
import {
  type TicketInfoMetadata,
  type TicketMetadataExtra,
  type FunderEventMetadata,
} from "@/lib/eventsHelper";
import eventHelperInstance from "@/lib/event";

interface TicketQRPageProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticketInfoExtra?: TicketMetadataExtra;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
  onScanned: () => void;
}

export default function TicketQRPage({
  eventInfo,
  ticketInfo,
  isLoading,
  secretKey,
  onScanned,
}: TicketQRPageProps) {
  // Effect to check for QR scan and reload if necessary
  useEffect(() => {
    const checkForQRScanned = async () => {
      const pubKey = getPubFromSecret(secretKey);
      const keyInfo: { drop_id: string; uses_remaining: number } =
        await eventHelperInstance.viewCall({
          methodName: "get_key_information",
          args: { key: pubKey },
        });
      console.log("keyInfo", keyInfo);

      if (keyInfo.uses_remaining !== 3) {
        onScanned();
      }
    };

    // Set up an interval to call checkForQRScanned every 3 seconds
    const intervalId = setInterval(checkForQRScanned, 3000);

    // Clean up interval on component unmount or dependency change
    return () => {
      clearInterval(intervalId);
    };
  }, [secretKey]);

  return (
    <VStack
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      py="10"
      //width="100vw"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        px={4}
        width="100%"
      >
        <Heading mb={8} textAlign="center">
          You're attending {eventInfo?.name}!
        </Heading>
      </Box>

      <Center>
        <VStack gap={{ base: "calc(24px + 8px)", md: "calc(32px + 10px)" }}>
          <IconBox
            bg="border.box"
            h="full"
            icon={
              <Skeleton isLoaded={!isLoading}>
                <Image height={{ base: "14", md: "12" }} src={`/logo.svg`} />
              </Skeleton>
            }
            iconBg={"event.iconBg"}
            iconBorder={"event.iconBorder"}
            minW={{ base: "90vw", md: "345px" }}
            p="0"
            pb="0"
            w="full"
          >
            <Box>
              <BoxWithShape bg="black" borderTopRadius="8xl" w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <QrDetails
                    eventInfo={eventInfo!}
                    qrValue={secretKey}
                    ticketInfo={ticketInfo!}
                  />
                )}
              </BoxWithShape>
              <Flex
                align="center"
                borderBottomRadius="8xl"
                flexDir="column"
                pt={8}
              >
                <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                  <Image
                    alt={`Event image for ${eventInfo?.name}`}
                    borderRadius="12px"
                    height="200px"
                    objectFit="contain"
                    src={`/ticket_image.png`}
                  />
                </Skeleton>
              </Flex>
            </Box>
          </IconBox>
        </VStack>
      </Center>
    </VStack>
  );
}
