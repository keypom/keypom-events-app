import { Box, Input, Button, ButtonGroup } from "@chakra-ui/react";

import { primaryButtonStyle, secondaryButtonStyle } from "./styles";

export function SetAmount({
  amount,
  setAmount,
  setStep,
}: {
  amount: number;
  setAmount: (value: number) => void;
  setStep: (value: string) => void;
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
          value={amount === 0 ? "" : amount}
          type="number"
          fontSize="24px"
          height="54px"
          padding="1rem 0"
          step="0.01"
          autoFocus
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="789.56"
          _placeholder={{
            color: "black",
            opacity: 0.5,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setStep("sent");
            }
          }}
        />
      </Box>
      <ButtonGroup width="100%" justifyContent="center" p={4}>
        <Button {...secondaryButtonStyle} onClick={() => setStep("recipient")}>
          BACK
        </Button>
        <Button {...primaryButtonStyle} onClick={() => setStep("sent")}>
          SEND
        </Button>
      </ButtonGroup>
    </>
  );
}
