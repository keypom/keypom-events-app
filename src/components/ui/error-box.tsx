import { Box } from "@chakra-ui/react";

export function ErrorBox({ message }) {
  return (
    <Box
      position="absolute"
      top="50%"
      left="50%"
      transform="translate(-50%, -50%)"
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
    >
      <div>{message}</div>
    </Box>
  );
}
