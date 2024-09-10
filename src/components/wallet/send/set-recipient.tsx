import { KEYPOM_TOKEN_FACTORY_CONTRACT } from "@/constants/common";
import { useAccountData } from "@/hooks/useAccountData";
import eventHelperInstance from "@/lib/event";
import { Box, Input, Button, ButtonGroup } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SetRecipient({
  receiver,
  setReceiver,
  setStep,
}: {
  receiver: string;
  setReceiver: (value: string) => void;
  setStep: (value: string) => void;
}) {
  const { data, isLoading, isError } = useAccountData();
  const displayName = isLoading || isError ? "------" : data?.displayAccountId;

  const navigate = useNavigate();

  const [isValidUsername, setIsValidUsername] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setIsValidUsername(true);
    setError("");
  }, [receiver]);

  const handleClick = async () => {
    if (receiver === "") {
      setIsValidUsername(false);
      setError("");
      return;
    }

    if (receiver === displayName) {
      setIsValidUsername(false);
      setError("You cannot send tokens to your own account.");
      return;
    }

    try {
      const isValid = await eventHelperInstance.accountExists(
        `${receiver}.${KEYPOM_TOKEN_FACTORY_CONTRACT}`,
      );
      if (!isValid) {
        setError("User does not exist.");
        setIsValidUsername(false);
        return;
      }
      setIsValidUsername(true);
      setError("");
    } catch (e) {
      console.log(e);
      setIsValidUsername(false);
      setError("An error occurred while validating the account.");
      return;
    }

    setStep("amount");
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
          onChange={(e) => setReceiver(e.target.value)}
          _placeholder={{
            color: "black",
            opacity: 0.5,
          }}
          placeholder="username"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setStep("amount");
            }
          }}
        />
      </Box>
      <ButtonGroup width="100%" justifyContent="center" p={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          CANCEL
        </Button>
        <Button
          isDisabled={!isValidUsername || receiver === ""}
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
          variant="primary"
          onClick={() => handleClick()}
        >
          CONTINUE
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
