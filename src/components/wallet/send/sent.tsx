import { VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { CheckIcon } from "@/components/icons";

export function Sent({
  reciever,
  amount = 0,
}: {
  reciever: string;
  amount: number;
}) {
  return (
    <VStack
      alignItems={"center"}
      justifyContent={"center"}
      spacing={8}
      height="calc(100dvh - 140px)"
    >
      <CheckIcon color={"var(--chakra-colors-brand-400)"} />
      <PageHeading title={`${amount} SENT`} description={`to ${reciever}`} />
    </VStack>
  );
}
