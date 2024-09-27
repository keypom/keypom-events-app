// components/alerts/latest-alert.tsx

import { AlertItem } from "@/components/alerts/alert-item";
import { ArrowIcon } from "@/components/icons";
import { Alert, fetchFeaturedAlert } from "@/lib/api/alerts";
import { Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Spinner } from "../ui/spinner";
import { useEffect, useState, useRef } from "react";

const DEFAULT_ALERT: Alert = {
  id: 0,
  title: "No alerts currently",
  description: "Enjoy REDACTED and check back later!",
  href: "",
  linkTitle: "",
};

export function LatestAlert() {
  const [alertToShow, setAlertToShow] = useState<Alert | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const firstLoad = useRef(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAndSetAlerts = async () => {
      const featuredAlert = await fetchFeaturedAlert();
      if (isMounted) {
        setAlertToShow(featuredAlert);
        if (firstLoad.current) {
          setIsLoading(false);
          firstLoad.current = false;
        }
      }
    };

    fetchAndSetAlerts();

    const intervalId = setInterval(fetchAndSetAlerts, 10000); // Refresh every 10 seconds

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

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
      </Flex>
      <AlertItem {...(alertToShow || DEFAULT_ALERT)} />
    </VStack>
  );
}
