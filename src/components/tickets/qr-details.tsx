import { Box, Flex, Text } from "@chakra-ui/react";
import QRCode from "react-qr-code";
import { dateAndTimeToText } from "@/utils/parseDates";
import { GLOBAL_EVENT_INFO } from "@/constants/eventInfo";

interface QRDetailsProps {
  qrValue: string;
}

export const QRDetails = ({ qrValue }: QRDetailsProps) => {
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
        bg={"white"}
      >
        <QRCode
          size={240}
          value={qrValue}
          fgColor="black"
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
        {dateAndTimeToText(GLOBAL_EVENT_INFO.date, "", false, true)}
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
