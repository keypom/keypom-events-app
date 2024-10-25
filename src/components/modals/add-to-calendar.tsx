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

// Function to format date for Google Calendar (without 'Z')
function formatDateForGoogleCalendar(date: Date): string {
  // Returns date in format YYYYMMDDTHHMMSS
  return date.toISOString().replace(/-|:|\.\d\d\d|Z/g, "");
}

// Function to create Google Calendar link
function createGoogleCalendarLink(event: AgendaItem) {
  const { title, stage, description, presenter, startDate, endDate } = event;

  const encodedTitle = encodeURIComponent(title);
  const encodedStage = encodeURIComponent(stage);
  const encodedDescription = encodeURIComponent(
    `${description}\nPresenter: ${presenter}`,
  );

  const startDateTime = formatDateForGoogleCalendar(startDate);
  const endDateTime = formatDateForGoogleCalendar(endDate);

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
