import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  Image,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";
import { useAddToCalendar } from "@/stores/add-to-calendar";

import googleCalendarLogo from "/assets/calendar/google-calendar.webp";
import { AgendaItem } from "@/lib/api/agendas";

const TIMEZONE = "Asia/Bangkok"; // Replace with your desired timezone

function formatDateForGoogleCalendar(date: Date, timeZone: string): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const formatter = new Intl.DateTimeFormat("en-US", options);
  const parts = formatter.formatToParts(date);
  const dateComponents: { [key: string]: string } = {};

  for (const part of parts) {
    if (part.type !== "literal") {
      dateComponents[part.type] = part.value;
    }
  }

  return `${dateComponents.year}${dateComponents.month}${dateComponents.day}T${dateComponents.hour}${dateComponents.minute}${dateComponents.second}`;
}

// Function to create Google Calendar link
function createGoogleCalendarLink(event: AgendaItem) {
  const { title, stage, description, presenter, startDate, endDate } = event;

  const encodedTitle = encodeURIComponent(title);
  const encodedStage = encodeURIComponent(stage);
  const encodedDescription = encodeURIComponent(
    `${description}\nPresenter: ${presenter}`,
  );

  const startDateTime = formatDateForGoogleCalendar(startDate, TIMEZONE);
  const endDateTime = formatDateForGoogleCalendar(endDate, TIMEZONE);

  // Construct the Google Calendar link
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDateTime}/${endDateTime}&details=${encodedDescription}&location=${encodedStage}&trp=false&ctz=${TIMEZONE}`;

  return googleCalendarUrl;
}

const buttonProps = {
  height: "100%",
  border: "1px solid var(--chakra-colors-brand-400)",
  bg: "black",
  borderRadius: "lg",
  p: 4,
  variant: "transparent",
  color: "white",
  fontFamily: "mono",
  display: "flex",
  gap: 2,
  fontSize: "xs",
};
export function AddToCalendarModal() {
  const { isOpen, onClose, event } = useAddToCalendar();

  if (!isOpen || !event) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        background="black"
        border={"1px solid var(--chakra-colors-brand-400)"}
        maxWidth={{
          base: "90%",
          md: "380px",
        }}
      >
        <ModalHeader px={4} fontFamily={"mono"}>
          Add to Calendar
        </ModalHeader>
        <ModalCloseButton top="16px" right="8px" />
        <ModalBody width={"100%"} px={4}>
          <Flex gap={6} width={"100%"} justifyContent={"center"}>
            <Button
              {...buttonProps}
              as="a"
              href={createGoogleCalendarLink(event)}
              target="_blank"
              rel="noopener noreferrer"
              flexDirection={"column"}
            >
              <Image
                src={googleCalendarLogo}
                borderRadius={"lg"}
                alt="Google Calendar Logo"
                width={12}
                height={12}
              />
              Google Calendar
            </Button>
          </Flex>
        </ModalBody>
        <ModalFooter px={4}>
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
