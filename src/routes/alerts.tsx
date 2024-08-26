import { VStack } from "@chakra-ui/react";

import { PageHeading } from "@/components/ui/page-heading";
import { Alert } from "@/components/alerts/alert";

export function Alerts() {
  return (
    <VStack spacing={4} p={4}>
      <PageHeading title="Alerts" showBackButton backUrl="/me" />
      <VStack width="100%" spacing={4}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Alert key={index} />
        ))}
      </VStack>
    </VStack>
  );
}
