import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { PageHeading } from "@/components/ui/page-heading";
import { CONTACT_BUTTON } from "@/constants/common";

export default function Help() {
  return (
    <VStack p={4} spacing={4}>
      <PageHeading title="Help" />
      <Box
        bg="bg.primary"
        width="100%"
        aspectRatio={"1/1.025"}
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius="md"
        border="2px solid var(--chakra-colors-brand-400)"
      >
        <Text
          fontFamily="mono"
          color="brand.400"
          textAlign="center"
          fontSize="lg"
          fontWeight="bold"
        >
          Map of Venue
          <br />
          highlighting help desk
        </Text>
      </Box>
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
