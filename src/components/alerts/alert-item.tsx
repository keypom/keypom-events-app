import { useState, useEffect } from "react";
import { VStack, Text, Heading, Flex, Button } from "@chakra-ui/react";

import { ArrowIcon } from "@/components/icons";
import { Alert } from "@/lib/api/alerts";
import { timeAgoShort } from "@/utils/date";

export function AlertItem({
  title,
  description,
  creationDate,
  href,
  linkTitle,
}: Alert) {
  const [timeAgo, setTimeAgo] = useState<string>("");

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    const updateTimeAgo = () => {
      if (creationDate) {
        setTimeAgo(timeAgoShort(creationDate));

        const creationTimeInMs = new Date(creationDate).getTime();
        const now = Date.now();
        const diffMs = now - creationTimeInMs;
        const diffSeconds = Math.floor(diffMs / 1000);

        // Stop updating if the alert is more than 60 seconds old
        if (diffSeconds >= 60 && intervalId) {
          clearInterval(intervalId);
          intervalId = undefined;
        }
      }
    };

    updateTimeAgo(); // Initial call

    // Set up interval if the alert is less than 60 seconds old
    if (creationDate) {
      const creationTimeInMs = creationDate.getTime();
      const now = Date.now();
      const diffMs = now - creationTimeInMs;
      const diffSeconds = Math.floor(diffMs / 1000);

      if (diffSeconds < 60) {
        intervalId = setInterval(updateTimeAgo, 1000);
      }
    }

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [creationDate]);

  return (
    <VStack
      data-testid="alert-item"
      spacing={2}
      pt={2}
      width="100%"
      alignItems="flex-start"
      gap={4}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        width: "16px",
        height: "2px",
        backgroundImage: "url(/assets/lines-bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
        zIndex: -1,
      }}
    >
      <Flex
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
      >
        <Heading
          as="h3"
          fontSize="14px"
          fontFamily={"mono"}
          color="brand.400"
          display={"flex"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          {title}
        </Heading>
        {creationDate && (
          <Text fontSize="10px" fontWeight="700" color="brand.600">
            {timeAgo}
          </Text>
        )}
      </Flex>
      <Text color="white" fontSize="xs">
        {description}
      </Text>
      {href && linkTitle && (
        <Button
          variant="outline"
          as="a" // Change to "a" instead of "Link"
          href={href}
          target="_blank" // Opens link in a new tab
          rel="noopener noreferrer" // For security
          flexDirection="row"
          padding="4px 8px"
        >
          <span>{linkTitle}</span>
          <ArrowIcon
            direction="right"
            width={8}
            height={8}
            color={"var(--chakra-colors-brand-400)"}
          />
        </Button>
      )}
    </VStack>
  );
}
