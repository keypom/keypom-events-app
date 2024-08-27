import { Box } from "@chakra-ui/react";
import { Spinner } from "./spinner";

export function LoadingBox() {
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
      <Spinner />
    </Box>
  );
}
