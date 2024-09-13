import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeading } from "@/components/ui/page-heading";
import { Sent } from "@/components/wallet/send/sent";
import { SetAmount } from "@/components/wallet/send/set-amount";
import { SetRecipient } from "@/components/wallet/send/set-recipient";
import eventHelperInstance from "@/lib/event";
import { useEventCredentials } from "@/stores/event-credentials";
import { useAccountData } from "@/hooks/useAccountData";
import { LoadingBox } from "@/components/ui/loading-box";
import { ErrorBox } from "@/components/ui/error-box";

const STEPS = {
  RECIPIENT: "recipient",
  AMOUNT: "amount",
  SENT: "sent",
  ERROR: "error",
};

export default function Send() {
  const { secretKey } = useEventCredentials();
  const { data, isLoading, isError, error } = useAccountData();
  const curBalance = data?.balance;

  const [params] = useSearchParams();
  const toParam = params.get("to");
  const [receiver, setReceiver] = useState<string>(toParam || "");
  const [amount, setAmount] = useState<number>(0); // Set amount to string to handle decimal inputs properly
  const [step, setStep] = useState<string>(STEPS.RECIPIENT);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState<boolean>(false); // State to track sending status

  const onSend = async () => {
    // Start sending
    setIsSending(true);

    // Error handling for 0 amount or insufficient balance
    if (amount <= 0) {
      setErrorMessage("You cannot send 0 or negative amounts.");
      setStep(STEPS.ERROR);
      setIsSending(false); // Reset sending status
      return;
    }

    // Ensure balance is defined and use BN to compare balances
    if (!curBalance || amount > parseFloat(curBalance)) {
      setErrorMessage("You don't have enough tokens to send.");
      setStep(STEPS.ERROR);
      setIsSending(false); // Reset sending status
      return;
    }

    try {
      await eventHelperInstance.sendConferenceTokens({
        secretKey,
        sendTo: receiver,
        amount,
      });
      setStep(STEPS.SENT);
      setErrorMessage("");
    } catch (error) {
      console.error(error);
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setStep(STEPS.ERROR);
    }

    // Reset sending state once the operation is complete
    setIsSending(false);
  };

  const handleTryAgain = () => {
    setStep(STEPS.RECIPIENT);
    setErrorMessage("");
  };

  const stepComponents = {
    [STEPS.RECIPIENT]: (
      <SetRecipient
        curAccountId={data?.accountId}
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
        isSending={isSending} // Pass sending status to SetAmount component
        curBalance={curBalance || ""} // Pass the balance to SetAmount component for displaying it
      />
    ),
    [STEPS.SENT]: <Sent receiver={receiver} amount={amount} />,
    [STEPS.ERROR]: (
      <Box p={4} height="100%" maxWidth={"100%"}>
        <VStack alignItems="center" justifyContent="center" spacing={4}>
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
      {isLoading && <LoadingBox />}
      {isError && <ErrorBox message={`Error: ${error?.message}`} />}{" "}
      {/* Error Handling */}
      {step !== STEPS.SENT && step !== STEPS.ERROR && (
        <Box p={4} pb={0}>
          <PageHeading
            title="Send"
            description={
              step === STEPS.AMOUNT ? `to @${receiver}` : "choose recipient"
            }
          />
        </Box>
      )}
      {data && stepComponents[step]}
    </VStack>
  );
}
