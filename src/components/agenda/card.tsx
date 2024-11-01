// components/agenda/AgendaCard.tsx

import { AgendaItem } from "@/lib/api/agendas";
import { useAddToCalendar } from "@/stores/add-to-calendar";
import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { CalenderAddIcon } from "../icons";
import { useState } from "react";
import { FavouriteIcon } from "../icons/favourite-icon";

interface AgendaCardProps extends AgendaItem {
  isFavourited: boolean;
  onToggleFavourite: (id: number) => void;
}

export function AgendaCard({
  id,
  title,
  stage,
  description,
  presenter,
  isFavourited,
  onToggleFavourite,
  ...event
}: AgendaCardProps) {
  const { onOpen, setEvent } = useAddToCalendar();

  const [isExpanded, setIsExpanded] = useState(false);

  const handleCalendarClick = () => {
    // Pass the entire event object with all necessary properties
    onOpen();
    setEvent({
      id,
      title,
      stage,
      description,
      presenter,
      reminder: event.reminder,
      talkType: event.talkType,
      tags: event.tags,
      startDate: event.startDate,
      endDate: event.endDate,
    });
  };

  const maxChars = 150;

  const shouldTruncate = description.length > maxChars;

  const displayedDescription =
    shouldTruncate && !isExpanded
      ? description.slice(0, maxChars) + "..."
      : description;

  const handleFavouriteClick = () => {
    onToggleFavourite(id);
  };

  return (
    <VStack width={"100%"} alignItems={"flex-start"} gap={2}>
      <Flex width={"100%"} justifyContent={"space-between"}>
        <VStack width={"100%"} alignItems={"flex-start"} gap={1}>
          <Heading
            as="h3"
            fontSize={"sm"}
            fontFamily={"mono"}
            fontWeight={"bold"}
            color={"white"}
          >
            {title}
          </Heading>
          <Heading
            as="h4"
            color={"brand.400"}
            fontSize={"sm"}
            fontWeight={"bold"}
          >
            {presenter}
          </Heading>
          <Text color={"brand.600"} fontSize={"xs"}>
            {displayedDescription}
          </Text>
          {shouldTruncate && (
            <Button
              variant="link"
              color="brand.400"
              size="xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "View Less" : "View More"}
            </Button>
          )}
          <Heading
            as="h4"
            color={"brand.400"}
            fontSize={"sm"}
            fontWeight={"bold"}
          >
            {stage}
          </Heading>
        </VStack>
        <Flex direction="column" alignItems="center" gap={0} mt={-2}>
          <Button variant={"transparent"} onClick={handleFavouriteClick}>
            <FavouriteIcon
              isFavourited={isFavourited}
              width={6}
              height={6}
              color={"var(--chakra-colors-brand-400)"}
            />
          </Button>
          <Button variant={"transparent"} onClick={handleCalendarClick}>
            <CalenderAddIcon
              width={24}
              height={24}
              color={"var(--chakra-colors-brand-400)"}
            />
          </Button>
        </Flex>
      </Flex>
      <VStack alignItems="flex-start" spacing={0}></VStack>
    </VStack>
  );
}
