import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { Box, VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { SetRecipient } from "@/components/wallet/send/set-recipient";
import { SetAmount } from "@/components/wallet/send/set-amount";
import { Sent } from "@/components/wallet/send/sent";

export function Send() {
  const [params] = useSearchParams();
  const toParam = params.get("to");
  const [reciever, setReciever] = useState<string>(toParam || "");
  const [amount, setAmount] = useState<number>(0);
  const [step, setStep] = useState<string>("recipient");

  return (
    <VStack spacing={4} height="100%">
      {step !== "sent" && (
        <Box p={4} pb={0}>
          <PageHeading
            title="Send"
            description={
              step === "amount" ? `to ${reciever}` : "choose recipient"
            }
          />
        </Box>
      )}
      {step === "recipient" ? (
        <SetRecipient
          reciever={reciever}
          setReciever={setReciever}
          setStep={setStep}
        />
      ) : step === "amount" ? (
        <SetAmount amount={amount} setAmount={setAmount} setStep={setStep} />
      ) : (
        step === "sent" && <Sent reciever={reciever} amount={amount} />
      )}
    </VStack>
  );
}
