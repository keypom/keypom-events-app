import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
import { Box, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Regex to validate account ID (NEAR format: lowercase, alphanumeric, _, -, no capital letters)
const accountIdPattern = /^([a-z\d]+[-_])*[a-z\d]+$/;

// Maximum length for username (total 64 - length of factory contract - 1 for the dot)
const maxUsernameLength = 64 - KEYPOM_TOKEN_FACTORY_CONTRACT.length - 1;

export default function SetRecipient() {
  const navigate = useNavigate();
  const { secretKey } = useEventCredentials();

  const [selectedUsername, setSelectedUsername] = useState<string | undefined>(
    undefined,
  );
  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false); // For checking username existence
  const [isClaiming, setIsClaiming] = useState<boolean>(false);

  // Handle invalid characters and length while typing
  const handleInputChange = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
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

    if (!accountIdPattern.test(lowerCaseValue)) {
      setIsValidUsername(false);
      setError("The username contains invalid characters");
      return;
    }

    setIsValidUsername(true);
    setError("");
  };

  // Handle blur or "Continue" click - check username existence
  const handleCheckUsername = async () => {
    if (!isValidUsername) return;

    setIsChecking(true); // Indicate that the check is in progress
    try {
      const doesExist = await eventHelperInstance.accountExists(
        `${selectedUsername}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`,
      );
      console.log("doesExist: ", doesExist);
      if (doesExist) {
        setError("The chosen name already exists.");
        setIsValidUsername(false);
      } else {
        setError("");
        setIsValidUsername(true);
      }
      return doesExist;
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
      const doesExist = await handleCheckUsername();
      if (!doesExist) {
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
        <Input
          bg="var(--chakra-colors-brand-400)"
          color="black"
          borderRadius="md"
          textAlign="center"
          fontWeight="bold"
          fontFamily={"mono"}
          value={selectedUsername}
          type="text"
          fontSize="24px"
          height="54px"
          padding="1rem 0"
          autoFocus
          onChange={(e) => handleInputChange(e.target.value)} // Check invalid characters as user types
          _placeholder={{
            color: "black",
            opacity: 0.5,
          }}
          placeholder="@username"
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValidUsername) {
              handleClick();
            }
          }}
        />
      </Box>
      <Box w="100%" p={4}>
        <Button
          isDisabled={!isValidUsername || isChecking}
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
