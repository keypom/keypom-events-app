import { AgendaEvent } from "@/lib/api/agendas";
import { useAddToCalendar } from "@/stores/add-to-calendar";
import { Button, Flex, Heading, Text, VStack } from "@chakra-ui/react";
import { CalenderAddIcon } from "../icons";

export function AgendaCard(event: AgendaEvent) {
  const { title, stage, description, presenter } = event;
  const { onOpen, setEvent } = useAddToCalendar();

  const handleCalendarClick = () => {
    onOpen();
    setEvent(event);
  };

  return (
    <VStack width={"100%"} alignItems={"flex-start"} gap={2}>
      <Flex width={"100%"} justifyContent={"space-between"}>
        <VStack width={"100%"} alignItems={"flex-start"} gap={1}>
          <Heading as="h3" variant={"agenda.eventTitle"}>
            {title}
          </Heading>
          <Heading as="h4" variant={"agenda.eventPresenter"}>
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
      <Text variant="agenda.eventDescription">{description}</Text>
      <Heading as="h4" variant="agenda.eventStage">
        {stage}
      </Heading>
    </VStack>
  );
}
