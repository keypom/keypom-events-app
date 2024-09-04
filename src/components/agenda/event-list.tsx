import { AgendaCard } from "@/components/agenda/card";
import { AgendaEvent } from "@/lib/api/agendas";
import { formatDate, pureFormat } from "@/utils/date";
import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";

export function EventList({ events }: { events: AgendaEvent[] }) {
  // Group events by date
  const groupedEvents = events.reduce(
    (acc, event) => {
      const date = formatDate(new Date(event.startDate));
      const timeKey = `${pureFormat(event.startDate, "HH:mm")}-${pureFormat(event.endDate, "HH:mm")}`;

      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][timeKey]) {
        acc[date][timeKey] = [];
      }
      acc[date][timeKey].push(event);
      return acc;
    },
    {} as Record<string, Record<string, AgendaEvent[]>>,
  );

  return (
    <VStack width="100%" gap={8}>
      {Object.entries(groupedEvents).map(([date, timeslots]) => (
        <React.Fragment key={date}>
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
              <Box>{date}</Box>
            </VStack>
          </Box>
          {Object.entries(timeslots).map(([timeKey, timeEvents]) => (
            <Flex
              key={`${date}-${timeKey}`}
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
                backgroundImage: "url(/assets/redacted/alert-line.webp)",
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
                    title={event.title}
                    stage={event.stage}
                    description={event.description}
                    presenter={event.presenter}
                    startDate={event.startDate}
                    endDate={event.endDate}
                  />
                ))}
              </VStack>
            </Flex>
          ))}
        </React.Fragment>
      ))}
    </VStack>
  );
}
