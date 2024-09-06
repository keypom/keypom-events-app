import { VStack, Text, Heading, Flex, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { ArrowIcon } from "@/components/icons";
import { Alert } from "@/lib/api/alerts";
import { timeAgo } from "@/utils/date";

export function AlertItem({
  title,
  description,
  creationDate,
  href,
  linkTitle,
}: Alert) {
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
          variant={"alerts.title"}
          display={"flex"}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={2}
        >
          {title}
        </Heading>
        <Text variant={"alerts.timeAgo"}>{timeAgo(creationDate)}</Text>
      </Flex>
      <Text variant={"alerts.description"}>{description}</Text>
      <Button variant="alertLink" as={Link} to={href}>
        <span>{linkTitle}</span>
        <ArrowIcon
          direction="right"
          width={8}
          height={8}
          color={"var(--chakra-colors-brand-400)"}
        />
      </Button>
    </VStack>
  );
}
