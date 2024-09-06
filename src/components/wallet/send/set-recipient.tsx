import { Box, Input, Button, ButtonGroup } from "@chakra-ui/react";
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
  const navigate = useNavigate();
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
          color="secondary"
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
          placeholder="account.near"
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
          isDisabled={
            !receiver.endsWith(".near") && !receiver.endsWith(".testnet")
          }
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
          variant="secondary"
          onClick={() => setStep("amount")}
        >
          CONTINUE
        </Button>
      </ButtonGroup>
    </>
  );
}
