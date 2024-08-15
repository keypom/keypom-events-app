import { Box, Text } from "@chakra-ui/react";

export function Header() {
  return (
    <Box role="header" p={4}>
      <Box as="nav">
        <Text as="p" textAlign="center">
          navbar
        </Text>
      </Box>
    </Box>
  );
}
