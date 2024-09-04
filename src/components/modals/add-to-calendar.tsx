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
import { Link } from "react-router-dom";
import { useAddToCalendar } from "@/stores/add-to-calendar";

import googleCalendarLogo from "/calendar/google-calendar.webp";
import appleCalendar from "/calendar/apple-calendar.webp";
import { AgendaEvent } from "@/lib/api/agendas";

const TIMEZONE = "Asia/Bangkok";

function createGoogleCalendarLink(event: AgendaEvent) {
  const { title, stage, description, presenter, startDate, endDate } = event;

  const encodedTitle = encodeURIComponent(title);
  const encodedStage = encodeURIComponent(stage);
  const encodedDescription = encodeURIComponent(
    `${description}\nPresenter: ${presenter}`,
  );

  // Format the start and end date-times to the required format
  const startDateTime = startDate.replace(/[^\w\s]/gi, "");
  const endDateTime = endDate.replace(/[^\w\s]/gi, "");

  // Construct the Google Calendar link
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&dates=${startDateTime}/${endDateTime}&details=${encodedDescription}&location=${encodedStage}&trp=false&ctz=${TIMEZONE}`;

  return googleCalendarUrl;
}

function createICalendarLink(event: AgendaEvent) {
  const { title, stage, description, presenter, startDate, endDate } = event;

  const formattedDescription = `${description}\nPresenter: ${presenter}`;

  // Format the start and end date-times to the required format
  const startDateTime = startDate.replace(/[^\w\s]/gi, "");
  const endDateTime = endDate.replace(/[^\w\s]/gi, "");

  // Construct the .ics file content with proper CRLF line breaks and VTIMEZONE component
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Organization//Your Product//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    `TZID:${TIMEZONE}`,
    `X-LIC-LOCATION:${TIMEZONE}`,
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "TZNAME:ICT",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@yourdomain.com`,
    `DTSTAMP:${startDateTime}Z`,
    `DTSTART;TZID=${TIMEZONE}:${startDateTime}`,
    `DTEND;TZID=${TIMEZONE}:${endDateTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${formattedDescription.replace(/\n/g, "\\n")}`,
    `LOCATION:${stage}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  // Create a Blob with the ics content
  const blob = new Blob([icsContent], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);

  return url;
}

const buttonProps = {
  height: "100%",
  border: "1px solid var(--chakra-colors-brand-400)",
  bg: "black",
  borderRadius: "lg",
  p: 4,
  variant: "transparent",
  as: Link,
  target: "_blank",
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
    <>
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
                to={createGoogleCalendarLink(event)}
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
              <Button
                {...buttonProps}
                to={createICalendarLink(event)}
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
            </Flex>
          </ModalBody>
          <ModalFooter px={4}>
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
