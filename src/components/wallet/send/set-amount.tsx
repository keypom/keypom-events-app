import { Box, Button, ButtonGroup, Input } from "@chakra-ui/react";

export function SetAmount({
  amount,
  setAmount,
  setStep,
  onSend,
}: {
  amount: number;
  setAmount: (value: number) => void;
  setStep: (value: string) => void;
  onSend: () => void;
}) {
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
              onSend();
            }
          }}
        />
      </Box>
      <ButtonGroup width="100%" justifyContent="center" p={4}>
        <Button variant="outline" onClick={() => setStep("recipient")}>
          BACK
        </Button>
        <Button variant="secondary" onClick={onSend} isDisabled={!amount}>
          SEND
        </Button>
      </ButtonGroup>
    </>
  );
}
