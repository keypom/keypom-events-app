import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import eventHelperInstance from "@/lib/event";
import { Box, Input, Button, ButtonGroup } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Regex to validate account ID (NEAR format: lowercase, alphanumeric, _, -, no capital letters)
const accountIdPattern = /^([a-z\d]+[-_])*[a-z\d]+$/;

// Maximum length for username (total 64 - length of factory contract - 1 for the dot)
const maxUsernameLength = 64 - KEYPOM_TOKEN_FACTORY_CONTRACT.length - 1;

export function SetRecipient({
  curAccountId,
  receiver,
  setReceiver,
  setStep,
}: {
  curAccountId: string | undefined;
  receiver: string;
  setReceiver: (value: string) => void;
  setStep: (value: string) => void;
}) {
  const navigate = useNavigate();

  const [isValidUsername, setIsValidUsername] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isChecking, setIsChecking] = useState<boolean>(false); // For checking username existence

  // Handle invalid characters and length while typing
  const handleInputChange = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    setReceiver(lowerCaseValue);

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
        `${receiver}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`,
      );
      eventHelperInstance.debugLog(`doesExist: ${doesExist}`, "log");
      if (!doesExist) {
        setError("User does not exist.");
        setIsValidUsername(false);
      } else {
        setError("");
        setIsValidUsername(true);
      }
      return doesExist;
    } catch (e) {
      eventHelperInstance.debugLog(`Error: ${e}`, "error");
      setIsValidUsername(false);
      setError("An error occurred while validating the account.");
      return false;
    } finally {
      setIsChecking(false); // Reset checking state
    }
  };

  const handleClick = async () => {
    if (!curAccountId) return;

    eventHelperInstance.debugLog(`Current account ID: ${curAccountId}`, "log");
    if (curAccountId === `${receiver}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`) {
      setIsValidUsername(false);
      setError("You cannot send tokens to yourself.");
      return;
    }

    if (isValidUsername && !isChecking) {
      const doesExist = await handleCheckUsername();
      if (doesExist) {
        setStep("amount");
      }
    }
  };

  return (
    <>
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
          value={receiver}
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
          placeholder="username"
          onKeyDown={(e) => {
            if (e.key === "Enter" && isValidUsername) {
              handleClick();
            }
          }}
        />
      </Box>
      <ButtonGroup width="100%" justifyContent="center" p={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          CANCEL
        </Button>
        <Button
          isDisabled={!isValidUsername || receiver === "" || isChecking}
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
          variant="primary"
          onClick={handleClick}
        >
          {isChecking ? "Checking..." : "CONTINUE"}
        </Button>
      </ButtonGroup>
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
    </>
  );
}
