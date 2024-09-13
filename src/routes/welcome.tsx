import { NotFound404 } from "@/components/dashboard/not-found-404";
import { BoxWithShape } from "@/components/tickets/box-with-shape";
import { PageHeading } from "@/components/ui/page-heading";
import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { GLOBAL_EVENT_INFO } from "@/constants/eventInfo";
import { useConferenceData } from "@/hooks/useConferenceData";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Image,
  Input,
  ListItem,
  Skeleton,
  Spinner,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Full Account ID regex
const accountIdPattern =
  /^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$/;

// Maximum length for username (total 64 - length of factory contract - 1 for the dot)
const maxUsernameLength = 64 - KEYPOM_TOKEN_FACTORY_CONTRACT.length - 1;

export default function WelcomePage() {
  const { secretKey } = useEventCredentials();
  const { data, isLoading, isError, error } = useConferenceData(secretKey);
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>(""); // Error message state variable
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  if (isError) {
    return <NotFound404 header="Error" subheader={error?.message} />;
  }

  if (isLoading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" />
          <Text>Loading ticket information...</Text>
        </VStack>
      </Center>
    );
  }

  const { tokenInfo, ticketInfo, keyInfo } = data!;

  // Redirect if ticket has been used
  if (keyInfo.account_id !== null) {
    navigate("/me");
  }

  const { starting_token_balance } = ticketInfo;
  const { symbol } = tokenInfo;

  const tokensToClaim = eventHelperInstance.yoctoToNear(
    starting_token_balance!,
  );

  // Function to validate username and full account ID
  const validateAccountId = (username: string) => {
    const accountId = `${username}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;

    // Check length constraints (2 <= length <= 64)
    if (accountId.length < 2 || accountId.length > 64) {
      setErrorMessage(
        `Username must be less than ${maxUsernameLength} characters.`,
      );
      return false;
    }

    // Check if the username and full account ID match the pattern
    if (!accountIdPattern.test(accountId)) {
      setErrorMessage("Invalid account ID format.");
      return false;
    }

    setErrorMessage(""); // Clear error message if valid
    return true;
  };

  // Usage in your handleChangeUsername function
  const handleChangeUsername = (event) => {
    const userInput = event.target.value.toLowerCase();
    setIsUsernameAvailable(true);

    if (userInput.length !== 0) {
      const isValid = validateAccountId(userInput);
      setIsValidUsername(isValid);
    } else {
      setIsValidUsername(true);
    }

    setUsername(userInput);
  };

  const handleBeginJourney = async () => {
    const isAvailable = await checkUsernameAvailable();
    if (!isAvailable) {
      setErrorMessage("Username is not available.");
      setIsValidUsername(false);
      return;
    }

    const accountId = `${username}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
    try {
      setIsClaiming(true);
      await eventHelperInstance.handleCreateEventAccount({
        secretKey,
        accountId,
      });
      setIsClaiming(false);
      navigate(0);
    } catch (e) {
      setIsClaiming(false);
      setErrorMessage("Error claiming ticket. Please contact support.");
      console.error(e);
    }
  };

  const checkUsernameAvailable = async () => {
    if (!username) {
      return false;
    }
    try {
      const accountId = `${username}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
      const doesExist = await eventHelperInstance.accountExists(accountId);
      setIsUsernameAvailable(!doesExist);
      if (doesExist) {
        setErrorMessage("Username is already taken.");
      }
      return !doesExist;
    } catch {
      setIsUsernameAvailable(true);
      return true;
    }
  };

  return (
    <VStack spacing={4}>
      <Box p={4} pb={0}>
        <PageHeading title="Welcome" />
      </Box>
      <Image
        mx="auto"
        borderRadius="full"
        height={{ base: "14", md: "12" }}
        width={{ base: "14", md: "12" }}
        objectFit={"cover"}
        src={"/logo.svg"}
        mb="4"
      />

      <Text
        color="brand.400"
        fontFamily="mono"
        fontSize="sm"
        textAlign="center"
      >
        To get started, enter a username.
      </Text>

      <VStack width="100%" px={4} spacing={8}>
        <Flex
          justifyContent="space-between"
          alignItems="center"
          width={"100%"}
          textAlign="center"
          gap={4}
        >
          <FormControl
            isInvalid={!isValidUsername || !isUsernameAvailable}
            mb="5"
          >
            <Input
              backgroundColor="white"
              border="1px solid"
              borderColor={!isValidUsername ? "red.500" : "event.h1"}
              autoFocus
              transition="all 0.3s ease-in-out"
              color="black"
              fontFamily="mono"
              background="#F2F1EA"
              variant="outline"
              fontWeight="700"
              borderRadius="md"
              id="username"
              placeholder="Username"
              px={4}
              py={2}
              _placeholder={{
                color: "var(--black, #000)",
                fontFamily: "mono",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: "700",
                lineHeight: "14px",
                textTransform: "uppercase",
              }}
              value={username}
              onBlur={checkUsernameAvailable}
              onChange={handleChangeUsername}
            />
            <FormErrorMessage>{errorMessage}</FormErrorMessage>
          </FormControl>
        </Flex>
      </VStack>

      <Text
        color="white"
        fontFamily="heading"
        fontSize="sm"
        fontWeight="400"
        pt={6}
        textAlign="center"
      >
        Your ticket comes with{" "}
        <Text
          as="span"
          color="brand.400"
          fontWeight="400"
          size={{ base: "lg", md: "xl" }}
        >
          {tokensToClaim} ${symbol}
        </Text>
      </Text>

      <HStack spacing={2} pt={0}>
        <Box
          width="115px"
          height="5.25px"
          bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
        />
        <Text
          fontFamily="mono"
          fontSize="2xl"
          fontWeight="medium"
          color="brand.400"
          data-testid="token-symbol"
        >
          ${symbol}
        </Text>
        <Box
          width="115px"
          height="5.25px"
          bg="url(/assets/wallet-bg.webp) 100% / cover no-repeat"
        />
      </HStack>
      <VStack width="100%" p={4} pt={0} spacing={4}>
        {/* Start of the grid for Details */}
        <HStack
          width="100%"
          justifyContent={"space-between"}
          alignItems="flex-start"
          gap={4}
          wrap={"wrap"}
        >
          <VStack alignItems="flex-start" gap={4}>
            <Heading as="h3" fontSize="2xl" color="white">
              Earn:
            </Heading>
            <UnorderedList
              color="brand.400"
              fontFamily="mono"
              textAlign={"left"}
            >
              <ListItem>Attending Talks</ListItem>
              <ListItem>Visiting Booths</ListItem>
              <ListItem>Scavenger Hunts</ListItem>
              <ListItem>and more.</ListItem>
            </UnorderedList>
          </VStack>
          <VStack alignItems="flex-start" gap={4}>
            <Heading as="h3" fontSize="2xl" color="white">
              Spend:
            </Heading>
            <UnorderedList
              color="brand.400"
              fontFamily="mono"
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
          isDisabled={!isValidUsername || !username}
          isLoading={isClaiming}
          variant="primary"
          mt={6}
          onClick={handleBeginJourney}
          width="100%"
        >
          BEGIN JOURNEY
        </Button>
      </VStack>
    </VStack>
  );
}
