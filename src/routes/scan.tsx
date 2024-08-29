import {
  Box,
  Heading,
  HStack,
  Image,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import RedactedExpression from "/redacted-expression.webp";

import { QrScanner } from "@/components/scanner/qr-scanner";
import { PageHeading } from "@/components/ui/page-heading";
import { useNavigate } from "react-router-dom";

export function Scan() {
  const navigate = useNavigate();

  const isValidToken = (value: string) => {
    return value.startsWith("token:");
  };

  // Handle the scan event, return false if error
  const handleScan = (value: string): boolean | void => {
    if (isValidToken(value)) {
      navigate(`/scan/${value}`);
    } else {
      return false;
    }
  };

  return (
    <Box pt={4} display={"flex"} flexDirection={"column"} gap={4}>
      <PageHeading title="Scan" />
      <VStack spacing={8} width="100%">
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
          <QrScanner handleScan={handleScan} />
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
      </VStack>
    </Box>
  );
}
