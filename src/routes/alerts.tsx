import { VStack } from "@chakra-ui/react";

import { AlertItem } from "@/components/alerts/alert-item";
import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { Alert, fetchAlerts } from "@/lib/api/alerts";
import { useQuery } from "@tanstack/react-query";

function AlertList({ alerts }) {
  return (
    <VStack width="100%" spacing={4}>
      {alerts.map((alert: Alert) => (
        <AlertItem key={alert.id} {...alert} />
      ))}
    </VStack>
  );
}

export default function Alerts() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
  });

  return (
    <VStack spacing={4} p={4}>
      <PageHeading title="Alerts" showBackButton />
      {isLoading && <LoadingBox />}
      {data && <AlertList alerts={data} />}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
