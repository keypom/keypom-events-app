import { VStack, Button, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PageHeading } from "@/components/ui/page-heading";
import { CONTACT_BUTTON } from "@/constants/common";

export default function Help() {
  return (
    <VStack p={4} spacing={4}>
      <PageHeading title="Help" />
      <Image
        src="/assets/venue_map4x.png"
        alt="Help"
        width={{ base: "393px", md: "450px", lg: "500px" }} // Adjust sizes for each breakpoint
        height={{ base: "298px", md: "340px", lg: "375px" }}
        objectFit="cover"
      />
      <Button
        as={Link}
        to={CONTACT_BUTTON.href}
        target="_blank"
        variant={"secondary"}
      >
        {
          <CONTACT_BUTTON.icon
            width={24}
            height={24}
            color={"var(--chakra-colors-brand-400)"}
          />
        }
        {CONTACT_BUTTON.label}
      </Button>
    </VStack>
  );
}
