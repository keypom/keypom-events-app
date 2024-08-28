import { VStack, Box, Flex, Text } from "@chakra-ui/react";
import { AgendaCard } from "@/components/agenda/card";
import { Agenda } from "@/types/common";

export function AgendaList({ data }: { data: Agenda[] }) {
  return (
    <VStack width="100%" gap={8}>
      {data.map((item, index) => (
        <>
          <Box
            key={index}
            width={"100%"}
            p={2}
            borderRadius={"4px"}
            background={"#00EC97"}
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
              <Box>{item.date}</Box>
            </VStack>
          </Box>
          {item.agendas.map((agenda, index) => (
            <Flex
              key={index}
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
                backgroundImage: "url(/alert-line.webp)",
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
                zIndex: -1,
              }}
            >
              <VStack gap={0} fontFamily={"mono"} alignItems={"flex-start"}>
                <Text
                  color={"var(--chakra-colors-brand-400)"}
                  fontSize={"sm"}
                  fontWeight={700}
                >
                  {agenda.timeFrom}-
                </Text>
                <Text
                  color={"var(--chakra-colors-brand-400)"}
                  fontSize={"sm"}
                  fontWeight={700}
                >
                  {agenda.timeTo}
                </Text>
              </VStack>
              <VStack flexGrow={1} gap={8}>
                {agenda.events.map((event) => (
                  <AgendaCard
                    key={event.title}
                    title={event.title}
                    stage={event.stage}
                    description={event.description}
                    presenter={event.presenter}
                  />
                ))}
              </VStack>
            </Flex>
          ))}
        </>
      ))}
    </VStack>
  );
}
