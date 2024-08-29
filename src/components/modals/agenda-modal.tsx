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
import { useAgendaModalStore } from "@/stores/agenda-modal-store";

import googleCalendarLogo from "/calendar/google-calendar.webp";
import appleCalendar from "/calendar/apple-calendar.webp";

const monthMap = {
  JAN: "01",
  FEB: "02",
  MAR: "03",
  APR: "04",
  MAY: "05",
  JUN: "06",
  JUL: "07",
  AUG: "08",
  SEP: "09",
  OCT: "10",
  NOV: "11",
  DEC: "12",
};

const timeZone = "Asia/Bangkok";

function createGoogleCalendarLink(agenda) {
  const { date, timeFrom, timeTo, events } = agenda;

  const title = encodeURIComponent(events.title);
  const stage = encodeURIComponent(events.stage);
  const description = encodeURIComponent(
    events.description + "\nPresenter: " + events.presenter,
  );

  // Parse the date
  const dateParts = date.split(" ");

  const month = monthMap[dateParts[1].toUpperCase()]; // e.g., 'NOV' -> '11'
  const day = dateParts[2].replace(/[^0-9]/g, "").padStart(2, "0"); // '9TH' -> '09'

  const year = new Date().getFullYear(); // Assuming the event is in the current year

  const formattedDate = `${year}${month}${day}`; // e.g., '20241109'
  const startDateTime = `${formattedDate}T${timeFrom.replace(":", "")}00`;
  const endDateTime = `${formattedDate}T${timeTo.replace(":", "")}00`;

  // Construct the Google Calendar link
  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateTime}/${endDateTime}&details=${description}&location=${stage}&trp=false&ctz=${timeZone}`;

  return googleCalendarUrl;
}

function createICalendarLink(agenda) {
  const { date, timeFrom, timeTo, events } = agenda;

  const title = events.title;
  const stage = events.stage;
  const description = `${events.description}\nPresenter: ${events.presenter}`;

  // Parse the date
  const dateParts = date.split(" ");

  const month = monthMap[dateParts[1].toUpperCase()];
  const day = dateParts[2].replace(/[^0-9]/g, "").padStart(2, "0");
  const year = new Date().getFullYear(); // Assuming the event is in the current year

  const formattedDate = `${year}${month}${day}`;
  const startDateTime = `${formattedDate}T${timeFrom.replace(":", "")}00`;
  const endDateTime = `${formattedDate}T${timeTo.replace(":", "")}00`;

  // Construct the .ics file content with proper CRLF line breaks and VTIMEZONE component
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Your Organization//Your Product//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Bangkok",
    "X-LIC-LOCATION:Asia/Bangkok",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0700",
    "TZOFFSETTO:+0700",
    "TZNAME:ICT",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@yourdomain.com`,
    `DTSTAMP:${formattedDate}T${timeFrom.replace(":", "")}00Z`,
    `DTSTART;TZID=Asia/Bangkok:${startDateTime}`,
    `DTEND;TZID=Asia/Bangkok:${endDateTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
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
};
export function AgendaModal() {
  const { isOpen, onClose, agenda } = useAgendaModalStore();

  if (!isOpen) return null;

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          background="black"
          border={"1px solid var(--chakra-colors-brand-400)"}
        >
          <ModalHeader fontFamily={"mono"}>Add to Calendar</ModalHeader>
          <ModalCloseButton />
          <ModalBody width={"100%"}>
            <Flex gap={6} width={"100%"} justifyContent={"center"}>
              <Button
                {...buttonProps}
                to={createGoogleCalendarLink(agenda)}
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
                to={createICalendarLink(agenda)}
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
          <ModalFooter>
            <Button variant={"navigation"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
