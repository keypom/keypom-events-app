import { Box, VStack } from "@chakra-ui/react";
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
};

export default function Send() {
  const { secretKey } = useEventCredentials();
  const [params] = useSearchParams();
  const toParam = params.get("to");
  const [receiver, setReceiver] = useState<string>(toParam || "");
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<string>(STEPS.RECIPIENT);

  const onSend = async () => {
    try {
      await eventHelperInstance.sendConferenceTokens({
        secretKey,
        sendTo: receiver,
        amount: amount,
      });
      setStep(STEPS.SENT);
    } catch (error) {
      // TODO: Handle Error
      console.error(error);
    }
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
  };

  return (
    <VStack spacing={4} height="100%">
      {step !== "sent" && (
        <Box p={4} pb={0}>
          <PageHeading
            title="Send"
            description={
              step === "amount" ? `to ${receiver}` : "choose recipient"
            }
          />
        </Box>
      )}
      {stepComponents[step]}
    </VStack>
  );
}
