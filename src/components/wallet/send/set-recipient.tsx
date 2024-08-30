import { Box, Input, Button, ButtonGroup } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { primaryButtonStyle, secondaryButtonStyle } from "./styles";

export function SetRecipient({
  reciever,
  setReciever,
  setStep,
  backUrl,
}: {
  reciever: string;
  setReciever: (value: string) => void;
  setStep: (value: string) => void;
  backUrl: string;
}) {
  return (
    <>
      <Box
        mt={12}
        w="100%"
        bg="url(/redacted-button.webp) 50% / cover no-repeat"
        p={4}
      >
        <Input
          bg="var(--chakra-colors-brand-400)"
          color="black"
          borderRadius="md"
          textAlign="center"
          fontWeight="bold"
          fontFamily={"mono"}
          value={reciever}
          type="text"
          fontSize="24px"
          height="54px"
          padding="1rem 0"
          autoFocus
          onChange={(e) => setReciever(e.target.value)}
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
        <Button as={Link} to={backUrl} {...secondaryButtonStyle}>
          CANCEL
        </Button>
        <Button
          isDisabled={
            !reciever.endsWith(".near") && !reciever.endsWith(".testnet")
          }
          _disabled={{
            opacity: 0.5,
            cursor: "not-allowed",
          }}
          {...primaryButtonStyle}
          onClick={() => setStep("amount")}
        >
          CONTINUE
        </Button>
      </ButtonGroup>
    </>
  );
}
