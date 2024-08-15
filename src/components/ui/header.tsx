import { Box, Flex, Link } from "@chakra-ui/react";

export function Header() {
  return (
    <Box role="header" p={4}>
      <Flex justifyContent="center" alignItems="center" as="nav" gap={2}>
        <Link href="/" textAlign="center">
          REDACTED
        </Link>
      </Flex>
    </Box>
  );
}
