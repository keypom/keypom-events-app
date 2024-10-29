// components/agenda/EventList.tsx

import { AgendaItem } from "@/lib/api/agendas";
import { groupAndSortEvents } from "@/lib/helpers/agenda";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { AgendaCard } from "./card";

interface EventListProps {
  events: AgendaItem[];
  favouritedEvents: Set<number>;
  onToggleFavourite: (id: number) => void;
}

export function EventList({
  events,
  favouritedEvents,
  onToggleFavourite,
}: EventListProps) {
  // Group events by start date in local time
  const sortedGroupedEvents = groupAndSortEvents(events);

  return (
    <VStack width="100%" gap={8}>
      {Object.entries(sortedGroupedEvents).map(
        ([, { date, displayDate, timeslots }]) => (
          <React.Fragment key={date.toISOString()}>
            <Box
              width={"100%"}
              p={2}
              borderRadius={"4px"}
              background={"brand.400"}
              display={"flex"}
              gap={"10px"}
            >
              <VStack
                align="stretch"
                color={"black"}
                fontFamily={"mono"}
                fontWeight={700}
                fontSize={"16px"}
                lineHeight={"14px"}
                textTransform={"uppercase"}
              >
                <Box>{displayDate}</Box>
              </VStack>
            </Box>
            {Object.entries(timeslots)
              .sort(([timeA], [timeB]) => {
                const [startA] = timeA.split("-");
                const [startB] = timeB.split("-");
                const dateA = new Date(`1970-01-01T${startA}:00`);
                const dateB = new Date(`1970-01-01T${startB}:00`);
                return dateA.getTime() - dateB.getTime();
              })
              .map(([timeKey, timeEvents]) => (
                <Flex
                  key={`${date.toISOString()}-${timeKey}`}
                  pt={3}
                  width={"100%"}
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
                  <VStack gap={0} fontFamily={"mono"} alignItems={"flex-start"}>
                    <Text color={"brand.400"} fontSize={"sm"} fontWeight={700}>
                      {timeKey.split("-")[0]}-
                    </Text>
                    <Text color={"brand.400"} fontSize={"sm"} fontWeight={700}>
                      {timeKey.split("-")[1]}
                    </Text>
                  </VStack>
                  <VStack flexGrow={1} gap={8}>
                    {timeEvents.map((event, index) => (
                      <AgendaCard
                        key={`${event.title}-${index}`}
                        {...event}
                        isFavourited={favouritedEvents.has(event.id)}
                        onToggleFavourite={onToggleFavourite}
                      />
                    ))}
                  </VStack>
                </Flex>
              ))}
          </React.Fragment>
        ),
      )}
    </VStack>
  );
}
