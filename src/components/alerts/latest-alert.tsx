import { AlertItem } from "@/components/alerts/alert-item";
import { ArrowIcon } from "@/components/icons";
import { fetchAlerts } from "@/lib/api/alerts";
import { Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Spinner } from "../ui/spinner";

export function LatestAlert() {
  const {
    data: alerts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["alerts"],
    queryFn: fetchAlerts,
  });

  return (
    <VStack width="100%" p={4} spacing={8}>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        width={"100%"}
        textAlign="center"
        gap={4}
      >
        <Heading as="h3" color="white" fontFamily="mono" fontSize="16px">
          [ALERTS]
        </Heading>

        {alerts && alerts.length > 0 && (
          <Button
            variant="primary"
            as={Link}
            to="/alerts"
            flexDirection="row"
            padding="4px 8px"
            maxWidth={"max-content"}
            width="100%"
            fontSize="xs"
            gap="8px"
          >
            <span>VIEW ALL</span>
            <ArrowIcon direction="right" width={8} height={8} />
          </Button>
        )}
      </Flex>
      {isLoading && <Spinner />}
      {alerts &&
        (alerts.length > 0 ? (
          <AlertItem {...alerts[0]} />
        ) : (
          <div>No alerts found.</div>
        ))}
      {isError && <div>{`Error: ${error.message}.`}</div>}
    </VStack>
  );
}
