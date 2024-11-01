import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
import {
  Box,
  Input,
  Button,
  VStack,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Regex to validate account ID (NEAR format: lowercase, alphanumeric, _, -, no capital letters)
const accountIdPattern = /^([a-z\d]+(?:[-_][a-z\d]+)*)$/;

// Maximum length for username (total 64 - length of factory contract - 1 for the dot)
const maxUsernameLength = 64 - KEYPOM_TOKEN_FACTORY_CONTRACT.length - 1;

// Expanded lists of adjectives and nouns
const adjectives = [
  "mystical",
  "galactic",
  "spectral",
  "cosmic",
  "shadowy",
  "vibrant",
  "infinite",
  "dreamy",
  "serene",
  "majestic",
  "curious",
  "elusive",
  "playful",
  "wild",
  "electric",
  "mythic",
  "phantom",
  "zen",
  "cryptic",
  "silent",
  "ancient",
  "noble",
  "fiery",
  "golden",
  "lunar",
  "neon",
  "orbital",
];

const nouns = [
  "unicorn",
  "dragon",
  "nomad",
  "oracle",
  "sprite",
  "titan",
  "falcon",
  "comet",
  "echo",
  "horizon",
  "ember",
  "muse",
  "flux",
  "pulse",
  "nova",
  "legend",
  "shadow",
  "cipher",
  "vision",
  "dreamer",
  "phantom",
  "sage",
  "rogue",
  "wizard",
  "knight",
  "samurai",
  "ninja",
  "pirate",
  "glitch",
];

export default function SetRecipient() {
  const navigate = useNavigate();
  const { secretKey } = useEventCredentials();

  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false); // For checking username existence
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  function shuffleArray(array: string[]) {
    let currentIndex = array.length,
      randomIndex;
    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const generateRandomUsername = async (): Promise<string> => {
    let usernameOptions: string[] = [];

    // Combine adjective and noun
    for (const adj of adjectives) {
      for (const noun of nouns) {
        const randomTwoDigits = Math.floor(Math.random() * 100); // Random number between 0-99
        usernameOptions.push(`${adj}_${noun}${randomTwoDigits}`);
      }
    }

    // Shuffle the username options
    usernameOptions = shuffleArray(usernameOptions);

    // Check availability
    for (let username of usernameOptions) {
      username = username.substring(0, maxUsernameLength);
      const accountId = `${username}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
      const isAvailable = !(await eventHelperInstance.accountExists(accountId));
      if (isAvailable) {
        return username;
      }
    }

    // Fallback to random adjective with number
    let attempts = 0;
    const maxAttempts = 10;
    while (attempts < maxAttempts) {
      const randomAdj =
        adjectives[Math.floor(Math.random() * adjectives.length)];
      const randomNumber = Math.floor(Math.random() * 100); // Random number between 0-99
      let randomUsername = `${randomAdj}${randomNumber}`;
      randomUsername = randomUsername.substring(0, maxUsernameLength);
      const accountId = `${randomUsername}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
      const isAvailable = !(await eventHelperInstance.accountExists(accountId));
      if (isAvailable) {
        return randomUsername;
      }
      attempts++;
    }

    // As a last resort, return a default username
    return "uniqueuser";
  };

  // Handle invalid characters and length while typing
  const handleInputChange = (value: string) => {
    const lowerCaseValue = value.toLowerCase().replace("@", "");
    setSelectedUsername(lowerCaseValue);

    if (!lowerCaseValue) {
      setIsValidUsername(false);
      setError("");
      return;
    }

    if (lowerCaseValue.length > maxUsernameLength) {
      setIsValidUsername(false);
      setError(`Username must be less than ${maxUsernameLength} characters.`);
      return;
    }

    // Check for spaces
    if (/\s/.test(lowerCaseValue)) {
      setIsValidUsername(false);
      setError("Spaces are not allowed.");
      return;
    }

    // Check for invalid characters
    if (/[^a-z0-9\-_]/.test(lowerCaseValue)) {
      const invalidChars = lowerCaseValue.match(/[^a-z0-9\-_]/g);
      // remove duplicates
      const invalidCharsSet = new Set(invalidChars);
      setIsValidUsername(false);
      setError(
        `Invalid character${invalidChars!.length > 1 ? "s" : ""} ${
          invalidChars!.length > 1 ? "are" : "is"
        } not allowed: ${Array.from(invalidCharsSet)!.join(", ")}`,
      );
      return;
    }

    // Check if username starts or ends with a dash or underscore
    if (/^[-_]/.test(lowerCaseValue) || /[-_]$/.test(lowerCaseValue)) {
      setIsValidUsername(false);
      setError("Username cannot start or end with a dash or underscore.");
      return;
    }

    // Check for consecutive dashes or underscores
    if (/[-_]{2,}/.test(lowerCaseValue)) {
      setIsValidUsername(false);
      setError("Username cannot contain consecutive dashes or underscores.");
      return;
    }

    // Check overall pattern
    if (!accountIdPattern.test(lowerCaseValue)) {
      setIsValidUsername(false);
      setError("Invalid username format.");
      return;
    }

    setIsValidUsername(true);
    setError("");
  };

  // Handle username availability check
  const handleCheckUsername = async (): Promise<boolean> => {
    if (!isValidUsername || !selectedUsername) return false;

    setIsChecking(true); // Indicate that the check is in progress
    try {
      const accountId = `${selectedUsername}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
      const doesExist = await eventHelperInstance.accountExists(accountId);
      console.log("doesExist: ", doesExist);
      if (doesExist) {
        setError("The chosen name already exists.");
        setIsValidUsername(false);
      } else {
        setError("");
        setIsValidUsername(true);
      }
      return !doesExist;
    } catch (e) {
      console.log(e);
      setIsValidUsername(false);
      setError("An error occurred while validating the account.");
      return false;
    } finally {
      setIsChecking(false); // Reset checking state
    }
  };

  const handleClick = async () => {
    if (!selectedUsername) return;

    if (isValidUsername && !isChecking) {
      const isAvailable = await handleCheckUsername();
      if (isAvailable) {
        const accountId = `${selectedUsername}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`;
        try {
          setIsClaiming(true);
          await eventHelperInstance.handleCreateEventAccount({
            secretKey,
            accountId,
          });
          setIsClaiming(false);
          navigate(`/welcome`);
        } catch (e) {
          setIsClaiming(false);
          setError("Error claiming ticket. Please contact support.");
          console.error(e);
        }
      }
    }
  };

  const handleRandomizeClick = async () => {
    const username = await generateRandomUsername();
    setSelectedUsername(username);
    setIsValidUsername(true);
    setError("");
  };

  return (
    <VStack spacing={4} maxWidth={"100%"}>
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        px={4}
        pt={12}
        width="100%"
        flexGrow={1}
      >
        <Heading textAlign="center" size="md" pb="2">
          CHOOSE YOUR USERNAME
        </Heading>
      </Box>
      <Box
        mt={12}
        w="100%"
        bg="url(/assets/custom-button-bg.webp) 50% / cover no-repeat"
        p={4}
      >
        <InputGroup>
          <Input
            bg="var(--chakra-colors-brand-400)"
            color="black"
            borderRadius="md"
            fontWeight="bold"
            fontFamily="mono"
            value={selectedUsername && `@${selectedUsername}`}
            type="text"
            fontSize="22px"
            height="54px"
            paddingRight="3rem" // Make space for the randomize icon
            textAlign="center"
            placeholder={`@black_dragon42`}
            onChange={(e) => handleInputChange(e.target.value)}
            _placeholder={{
              color: "black",
              opacity: 0.5,
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && isValidUsername) {
                handleClick();
              }
            }}
          />
          <InputRightElement width="3rem" height="100%">
            <IconButton
              aria-label="Randomize Username"
              icon={<RepeatIcon w={6} h={6} />}
              onClick={handleRandomizeClick}
              variant="unstyled"
              color="black"
              _hover={{
                color: "black",
              }}
              size="sm"
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box w="100%" p={4}>
        <Button
          isDisabled={!isValidUsername || isChecking || !selectedUsername}
          width="100%"
          isLoading={isClaiming}
          p={4}
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
          variant="primary"
          onClick={handleClick}
        >
          {isChecking ? "Checking..." : "CONTINUE"}
        </Button>
      </Box>
      {error && (
        <Box
          mt={4}
          mx={2}
          color="red.400"
          textAlign="center"
          fontSize="sm"
          fontFamily="mono"
        >
          {error}
        </Box>
      )}
    </VStack>
  );
}
