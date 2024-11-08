import { useAccountData } from "@/hooks/useAccountData";
import eventHelperInstance from "@/lib/event";
import {
  Box,
  Button,
  Heading,
  HStack,
  Image,
  ListItem,
  Spinner,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useAccountData();

  if (isError) {
    eventHelperInstance.debugLog(
      `Error loading account data: ${error}`,
      "error",
    );
  }

  if (isLoading) {
    return (
      <Box
        position="relative"
        width="100%"
        minHeight="100vh"
        bg="bg.primary"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  return (
    <VStack spacing={4} maxWidth={"100%"}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        pt={12}
        pb={{ base: 8, iphone13: 8, md: 16 }}
        px={4}
        width="100%"
      >
        <Heading
          textAlign="center"
          pb="2"
          color="brand.400"
          fontSize={{ base: "18px", iphone13: "20px", md: "24px" }}
          maxWidth="90vw" // Responsive width limit
          overflow="hidden" // Hide overflow
          textOverflow="ellipsis" // Truncate if necessary
          whiteSpace="nowrap" // Prevent wrapping
        >
          WELCOME @{data!.displayAccountId}!
        </Heading>
        <Heading
          textAlign="center"
          fontSize={{ base: "20px", iphone13: "22px", md: "26px" }}
        >
          GET READY TO RECLAIM YOUR SOVEREIGNTY
        </Heading>
      </Box>
      <HStack spacing={4} width="100%" px={12}>
        <VStack
          width="100%"
          textAlign="left"
          alignItems="flex-start"
          spacing={0}
        >
          <Heading
            pb="2"
            fontSize={{
              base: "20px",
              iphone13: "20px",
              md: "24px",
            }}
          >
            What is SOV3?
          </Heading>
          <Heading
            fontSize="12px"
            pb="2"
            fontFamily="mono"
            color="brand.400"
            fontWeight="300"
          >
            SOV3 is the token for the Redacted Conference. You can earn, spend,
            or send it.
          </Heading>
        </VStack>
        <Image
          mx="auto"
          borderRadius="full"
          height={{ base: "20", md: "12" }}
          width={{ base: "20", md: "12" }}
          objectFit={"cover"}
          src={"/logo.svg"}
          mb="4"
        />
      </HStack>

      <VStack width="100%" p={4} pt={6} spacing={4} px={12}>
        {/* Start of the grid for Details */}
        <HStack
          width="100%"
          justifyContent={"space-between"}
          alignItems="flex-start"
          gap={4}
          wrap={"wrap"}
        >
          <VStack alignItems="flex-start" gap={4}>
            <Heading
              as="h3"
              color="white"
              fontSize={{
                base: "20px",
                iphone13: "20px",
                md: "24px",
              }}
            >
              Earn:
            </Heading>
            <UnorderedList
              color="brand.400"
              fontFamily="mono"
              fontSize={{
                base: "12px",
                iphone13: "12px",
                md: "16px",
              }}
              textAlign={"left"}
            >
              <ListItem>Attending Talks</ListItem>
              <ListItem>Visiting Booths</ListItem>
              <ListItem>Scavenger Hunts</ListItem>
              <ListItem>and more.</ListItem>
            </UnorderedList>
          </VStack>
          <VStack alignItems="flex-start" gap={4}>
            <Heading
              as="h3"
              color="white"
              fontSize={{
                base: "20px",
                iphone13: "20px",
                md: "24px",
              }}
            >
              Spend:
            </Heading>
            <UnorderedList
              color="brand.400"
              fontFamily="mono"
              fontSize={{
                base: "12px",
                iphone13: "12px",
                md: "16px",
              }}
              textAlign={"left"}
            >
              <ListItem>Swag</ListItem>
              <ListItem>Food</ListItem>
              <ListItem>NFTs</ListItem>
              <ListItem>and more.</ListItem>
            </UnorderedList>
          </VStack>
        </HStack>

        <Button
          variant="primary"
          mt={6}
          onClick={() => {
            navigate("/me");
          }}
          width="100%"
        >
          GET STARTED
        </Button>
      </VStack>
    </VStack>
  );
}
