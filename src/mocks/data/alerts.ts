import { getRandomDate } from "../utils";

export default [
  {
    id: "1",
    title: "System Maintenance Scheduled",
    description:
      "Our system will undergo scheduled maintenance from 12:00 AM to 4:00 AM. Please save your work and log out before the maintenance window.",
    href: "/maintenance",
    linkTitle: "CUSTOM LINK TITLE",
    creationDate: getRandomDate().toDateString(),
  },
  {
    id: "2",
    title: "New Feature Released",
    description:
      "We are excited to announce the release of our new feature that allows you to track your activities more effectively. Check it out now!",
    href: "/features",
    linkTitle: "CUSTOM LINK TITLE",
    creationDate: getRandomDate().toDateString(),
  },
  {
    id: "3",
    title: "Security Update Available",
    description:
      "A critical security update has been released. Please update your software to the latest version to ensure your data remains secure.",
    href: "/updates",
    linkTitle: "CUSTOM LINK TITLE",
    creationDate: getRandomDate().toDateString(),
  },
  {
    id: "4",
    title: "Account Verification Required",
    description:
      "To enhance security, we require you to verify your account. Follow the link to complete the verification process.",
    href: "/verify",
    linkTitle: "CUSTOM LINK TITLE",
    creationDate: getRandomDate().toDateString(),
  },
  {
    id: "5",
    title: "Upcoming Webinar: Tips & Tricks",
    description:
      "Join us for a live webinar where we’ll share tips and tricks to help you get the most out of our platform. Don’t miss out on this opportunity!",
    href: "/webinar",
    linkTitle: "CUSTOM LINK TITLE",
    creationDate: getRandomDate().toDateString(),
  },
];
