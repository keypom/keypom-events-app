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
import appleCalendar from "/assets/calendar/apple-calendar.webp";
import { AgendaItem } from "@/lib/api/agendas";

const TIMEZONE = "Asia/Bangkok"; // Replace with your desired timezone

// Function to format date for Google Calendar (without 'Z')
function formatDateForGoogleCalendar(date: Date): string {
  // Returns date in format YYYYMMDDTHHMMSS
  return date.toISOString().replace(/-|:|\.\d\d\d|Z/g, "");
}

// Function to format date for ICS files
function formatDateForICS(date: Date): string {
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

// Function to create ICS content and return a Data URI
function createICalendarLink(event: AgendaItem) {
  const { title, stage, description, presenter, startDate, endDate } = event;

  const formattedDescription = `${description}\nPresenter: ${presenter}`;

  const startDateTime = formatDateForICS(startDate);
  const endDateTime = formatDateForICS(endDate);

  // Get current date-time for DTSTAMP
  const dtStamp = formatDateForICS(new Date());

  // Construct the .ics file content with proper CRLF line breaks
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Organization//Your Product//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `BEGIN:VTIMEZONE`,
    `TZID:${TIMEZONE}`,
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@yourdomain.com`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART;TZID=${TIMEZONE}:${startDateTime}`,
    `DTEND;TZID=${TIMEZONE}:${endDateTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${formattedDescription.replace(/\n/g, "\\n")}`,
    `LOCATION:${stage}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const icsContent = icsLines.join("\r\n");

  // Encode the content as a data URI
  const icsDataUri =
    "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);

  return icsDataUri;
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
            {/*<Button
              {...buttonProps}
              as="a"
              href={createICalendarLink(event)}
              download={`${event.title}.ics`}
              flexDirection={"column"}
            >
              <Image
                borderRadius={"lg"}
                src={appleCalendar}
                alt="Apple Calendar Logo"
                width={12}
                height={12}
              />
              Apple Calendar
            </Button>
          */}
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
