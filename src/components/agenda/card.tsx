import { VStack, Flex, Heading, Text, Button } from "@chakra-ui/react";
import { CalenderAddIcon } from "../icons";
import { useAgendaModalStore } from "@/stores/agenda-modal-store";
import { AgendaEvent } from "@/lib/api/agendas";

export function AgendaCard({
  title,
  stage,
  description,
  presenter,
  startDate,
  endDate,
}: AgendaEvent) {
  const { onOpen, setAgenda } = useAgendaModalStore();

  const handleCalendarClick = () => {
    onOpen();
    setAgenda({
      startDate,
      endDate,
      title,
      stage,
      description,
      presenter,
    });
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
        </VStack>
        <Button variant={"transparent"} onClick={() => handleCalendarClick()}>
          <CalenderAddIcon
            width={24}
            height={24}
            color={"var(--chakra-colors-brand-400)"}
          />
        </Button>
      </Flex>
      <Text color={"brand.600"} fontSize={"xs"}>
        {description}
      </Text>
      <Heading as="h4" color={"brand.400"} fontSize={"sm"} fontWeight={"bold"}>
        {stage}
      </Heading>
    </VStack>
  );
}
