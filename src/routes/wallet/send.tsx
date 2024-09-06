import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeading } from "@/components/ui/page-heading";
import { Sent } from "@/components/wallet/send/sent";
import { SetAmount } from "@/components/wallet/send/set-amount";
import { SetRecipient } from "@/components/wallet/send/set-recipient";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
const STEPS = {
  RECIPIENT: "recipient",
  AMOUNT: "amount",
  SENT: "sent",
  ERROR: "error",
};

export default function Send() {
  const { secretKey } = useEventCredentials();
  const [params] = useSearchParams();
  const toParam = params.get("to");
  const [receiver, setReceiver] = useState<string>(toParam || "");
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<string>(STEPS.RECIPIENT);

  const [errorMessage, setErrorMessage] = useState("");

  const onSend = async () => {
    try {
      await eventHelperInstance.sendConferenceTokens({
        secretKey,
        sendTo: receiver,
        amount: amount,
      });
      setStep(STEPS.SENT);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setStep(STEPS.ERROR);
    }
  };

  const handleTryAgain = () => {
    setStep(STEPS.RECIPIENT);
    setErrorMessage("");
  };

  const stepComponents = {
    [STEPS.RECIPIENT]: (
      <SetRecipient
        receiver={receiver}
        setReceiver={setReceiver}
        setStep={setStep}
      />
    ),
    [STEPS.AMOUNT]: (
      <SetAmount
        amount={amount}
        setAmount={setAmount}
        setStep={setStep}
        onSend={onSend}
      />
    ),
    [STEPS.SENT]: <Sent receiver={receiver} amount={amount} />,
    [STEPS.ERROR]: (
      <Box p={4} height="100%" maxWidth={"100%"}>
        <VStack
          height={"100%"}
          alignItems="center"
          justifyContent="center"
          spacing={4}
        >
          <Box
            background={"red.400"}
            border={"1px solid red.400"}
            borderRadius="md"
            p={4}
            maxW={"100%"}
            width="100%"
          >
            <Text
              as="pre"
              whiteSpace="pre-wrap"
              wordBreak="break-word"
              overflowWrap="break-word"
              fontSize="sm"
            >
              {JSON.stringify(errorMessage, null, 2)}
            </Text>
          </Box>
          <Button onClick={handleTryAgain} variant="primary">
            Try Again
          </Button>
        </VStack>
      </Box>
    ),
  };

  return (
    <VStack
      spacing={4}
      height={{ base: "calc(100dvh - 168px)", lg: "100%" }}
      maxWidth={"100%"}
    >
      {step !== STEPS.SENT && step !== STEPS.ERROR && (
        <Box p={4} pb={0}>
          <PageHeading
            title="Send"
            description={
              step === STEPS.AMOUNT ? `to ${receiver}` : "choose recipient"
            }
          />
        </Box>
      )}
      {stepComponents[step]}
    </VStack>
  );
}
