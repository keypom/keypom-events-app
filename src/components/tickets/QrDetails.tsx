import { Box, Flex, Text } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import {
  type FunderEventMetadata,
  type TicketInfoMetadata,
} from "@/lib/eventsHelper";
import { dateAndTimeToText } from "@/utils/parseDates";

interface QrDetailsProps {
  qrValue: string;
  eventInfo: FunderEventMetadata;
  ticketInfo: TicketInfoMetadata;
}

export const QrDetails = ({ qrValue, eventInfo }: QrDetailsProps) => {
  return (
    <Flex
      align="center"
      flexDir="column"
      p={{ base: "6", md: "8" }}
      pt={{ base: "12", md: "16" }}
    >
      <Box
        border="1px solid"
        borderColor="brand.400"
        borderRadius="12px"
        mb={{ base: "2", md: "2" }}
        p="5"
      >
        <QRCode
          size={240}
          value={qrValue}
          fgColor="var(--chakra-colors-brand-400)"
          bgColor="transparent"
        />
      </Box>
      <Text
        color="white"
        fontFamily="heading"
        fontWeight="600"
        mb="1"
        size={{ base: "lg", md: "2xl" }}
        textAlign="center"
      >
        {dateAndTimeToText(eventInfo.date, "", false, true)}
      </Text>
      <Text
        color="brand.400"
        fontFamily="heading"
        fontSize="sm"
        mb="6"
        size={{ base: "sm", md: "sm" }}
        textAlign="center"
      >
        Keep this open after you're scanned into the event.
      </Text>
    </Flex>
  );
};
