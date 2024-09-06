import {
  Box,
  Center,
  Flex,
  Heading,
  Image,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { getPubFromSecret } from "@keypom/core";
import { useEffect } from "react";

import { IconBox } from "@/components/dashboard/icon-box";
import { BoxWithShape } from "@/components/tickets/box-with-shape";
import { QRDetails } from "@/components/tickets/qr-details";
import eventHelperInstance from "@/lib/event";
import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
} from "@/lib/helpers/events";
import { useNavigate } from "react-router-dom";
import { useEventCredentials } from "@/stores/event-credentials";

interface TicketQRCodeProps {
  eventInfo?: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  isLoading: boolean;
  eventId: string;
  funderId: string;
  secretKey: string;
}

export default function TicketQRCode({
  eventId,
  eventInfo,
  ticketInfo,
  isLoading,
  secretKey,
}: TicketQRCodeProps) {
  const navigate = useNavigate();
  const { setEventCredentials } = useEventCredentials();
  // Effect to check for QR scan and reload if necessary
  useEffect(() => {
    const checkForQRScanned = async () => {
      const pubKey = getPubFromSecret(`ed25519:${secretKey}`);
      const keyInfo: { drop_id: string; uses_remaining: number } =
        await eventHelperInstance.viewCall({
          methodName: "get_key_information",
          args: { key: pubKey },
        });

      if (keyInfo.uses_remaining !== 3) {
        setEventCredentials(eventId, secretKey);
        navigate("/");
      }
    };

    // Set up an interval to call checkForQRScanned every 3 seconds
    const intervalId = setInterval(checkForQRScanned, 3000);

    // Clean up interval on component unmount or dependency change
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              <BoxWithShape borderTopRadius="8xl" w="full">
                {isLoading ? (
                  <Skeleton height="200px" width="full" />
                ) : (
                  <QRDetails
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
                    src={`/assets/redacted/ticket-image.png`}
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
