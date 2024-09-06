import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Image,
  Input,
  Skeleton,
  Text,
  useToast,
  VStack,
  useMediaQuery,
  UnorderedList,
  ListItem,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { accountExists, getPubFromSecret } from "@keypom/core";
import { BoxWithShape } from "@/components/tickets/box-with-shape";
import {
  type TicketInfoMetadata,
  type FunderEventMetadata,
} from "@/lib/eventsHelper";
import keypomInstance from "@/lib/keypom";
import {
  EVENT_IMG_DIR_FOLDER_NAME,
  TOKEN_FACTORY_CONTRACT,
} from "@/constants/common";
import { useNavigate } from "react-router-dom";

const sizeConfig = {
  img: {
    base: { borderRadius: "8px", h: "80px" },
    md: { borderRadius: "12px", h: "100px" },
    lg: { borderRadius: "16px", h: "120px" },
  },
  font: {
    base: {
      h1: "24px",
      h2: "20px",
      h3: "16px",
      button: "16px",
    },
    md: {
      h1: "28px",
      h2: "22px",
      h3: "18px",
      button: "18px",
    },
    lg: {
      h1: "32px",
      h2: "24px",
      h3: "20px",
      button: "20px",
    },
  },
};

const getFontSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.font.lg;
  if (isLargerThan768) return sizeConfig.font.md;
  return sizeConfig.font.base;
};

const getImgSize = (isLargerThan768, isLargerThan1024) => {
  if (isLargerThan1024) return sizeConfig.img.lg;
  if (isLargerThan768) return sizeConfig.img.md;
  return sizeConfig.img.base;
};

interface WelcomePageProps {
  eventInfo: FunderEventMetadata;
  ticketInfo?: TicketInfoMetadata;
  ticker: string;
  tokensToClaim: string;
  isLoading: boolean;
  secretKey: string;
}

const accountAddressPatternNoSubaccount = /^([a-z\d]+[-_])*[a-z\d]+$/;

export default function WelcomePage({
  eventInfo,
  ticketInfo,
  isLoading,
  ticker,
  tokensToClaim,
  secretKey,
}: WelcomePageProps) {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const toast = useToast();

  const [isLargerThan768] = useMediaQuery("(min-height: 768px)");
  const [isLargerThan1024] = useMediaQuery("(min-height: 1024px)");

  const fontSize = getFontSize(isLargerThan768, isLargerThan1024);
  const imgSize = getImgSize(isLargerThan768, isLargerThan1024);

  const handleChangeUsername = (event) => {
    const userInput = event.target.value.toLowerCase();

    if (userInput.length !== 0) {
      const isValid = accountAddressPatternNoSubaccount.test(userInput);
      setIsValidUsername(isValid);
    } else {
      setIsValidUsername(true);
    }

    setUsername(userInput);
  };

  const handleBeginJourney = async () => {
    const isAvailable = await checkUsernameAvailable();
    if (!isAvailable) {
      setIsValidUsername(false);
      return;
    }

    const accountId = `${username}.${TOKEN_FACTORY_CONTRACT}`;
    try {
      setIsClaiming(true);
      await keypomInstance.claimEventTicket(
        secretKey,
        {
          new_account_id: accountId,
          new_public_key: getPubFromSecret(secretKey),
        },
        true,
      );
      setIsClaiming(false);
      navigate(0);
    } catch (e) {
      setIsClaiming(false);
      toast({
        title: "Error claiming ticket",
        description: "Please contact support.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error(e);
    }
  };

  const checkUsernameAvailable = async () => {
    if (!username) {
      return false;
    }
    try {
      const accountId = `${username}.${TOKEN_FACTORY_CONTRACT}`;
      console.log("Checking username", accountId);
      const doesExist = await accountExists(accountId);
      console.log("Does exist", doesExist);
      if (doesExist) {
        setIsValidUsername(false);
        return false;
      }

      return true;
    } catch {
      setIsValidUsername(true);
      return true;
    }
  };

  return (
    <Flex direction="column" p={4} width="100%">
      <Skeleton isLoaded={!isLoading}>
        <Image
          mx="auto"
          borderRadius="full"
          height={{ base: "14", md: "12" }}
          width={{ base: "14", md: "12" }}
          objectFit={"cover"}
          src={`/logo.svg`}
          mb="4"
        />
      </Skeleton>
      <Box h="full">
        <BoxWithShape
          color="primary"
          borderTopRadius="8xl"
          showNotch={false}
          w="full"
        >
          {isLoading ? (
            <Skeleton height="200px" width="full" />
          ) : (
            <Flex align="center" flexDir="column">
              <Heading>Welcome</Heading>
              <Text variant="welcome.username" mb="5">
                To get started, enter a username.
              </Text>
              <FormControl isInvalid={!isValidUsername} mb="5">
                <Input
                  borderColor={!isValidUsername ? "red.500" : "event.h1"}
                  autoFocus
                  variant="custom"
                  value={username}
                  onBlur={checkUsernameAvailable}
                  onChange={handleChangeUsername}
                />
                <FormErrorMessage>
                  Username is invalid or already taken.
                </FormErrorMessage>
              </FormControl>
              <Text variant="welcome.ticketDetails" mb="3">
                Your ticket comes with{" "}
                <Text as="span" variant="welcome.ticketDeatilsSpan">
                  {tokensToClaim} ${ticker}
                </Text>
              </Text>
              <Skeleton borderRadius="12px" isLoaded={!isLoading}>
                <Image
                  alt={`Event image for ${eventInfo?.name}`}
                  borderRadius={imgSize.borderRadius}
                  height={imgSize.h}
                  mb="2"
                  objectFit="contain"
                  src={`/assets/${EVENT_IMG_DIR_FOLDER_NAME}/${ticketInfo?.media}`}
                />
              </Skeleton>
              <Heading
                variant="welcome.ticketInfo"
                fontSize={fontSize.h1}
                my={4}
              >
                {ticketInfo?.title}
              </Heading>
            </Flex>
          )}
        </BoxWithShape>
        <Flex align="center" pt={8} flexDir="column" gap={4}>
          <Text variant="welcome.ticketInfo" fontSize={fontSize.h1}>
            ${ticker} Details
          </Text>
          {/* Start of the grid for Spork Details */}
          <HStack
            width="100%"
            justifyContent={"space-between"}
            alignItems="flex-start"
            gap={4}
            wrap={"wrap"}
          >
            <VStack alignItems="flex-start" gap={4}>
              <Heading as="h3" variant="scan.listHeading">
                Earn:
              </Heading>
              <UnorderedList variant="custom">
                <ListItem>Attending Talks</ListItem>
                <ListItem>Visiting Booths</ListItem>
                <ListItem>Scavenger Hunts</ListItem>
                <ListItem>Sponsor Quizzes</ListItem>
                <ListItem>and more.</ListItem>
              </UnorderedList>
            </VStack>
            <VStack alignItems="flex-start" gap={4}>
              <Heading as="h3" variant="scan.listHeading">
                Spend:
              </Heading>
              <UnorderedList variant="custom">
                <ListItem>Swag</ListItem>
                <ListItem>Food</ListItem>
                <ListItem>Raffles</ListItem>
                <ListItem>NFTs</ListItem>
                <ListItem>and more.</ListItem>
              </UnorderedList>
            </VStack>
          </HStack>

          <Button
            isDisabled={!isValidUsername || !username}
            isLoading={isClaiming}
            variant="primary"
            onClick={handleBeginJourney}
            width="100%"
          >
            BEGIN JOURNEY
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
}
