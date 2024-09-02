import { Button } from "@chakra-ui/react";
import { FlipIcon } from "../icons";

export const CameraSwitchButton = ({
  useNextDevice,
  devices,
}: {
  useNextDevice: () => void;
  devices: MediaDeviceInfo[];
}) => {
  return (
    <Button
      onClick={useNextDevice}
      background="brand.400"
      color="black"
      borderRadius={"lg"}
      padding="0px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position={"absolute"}
      bottom="1rem"
      right="1rem"
      hidden={devices.length < 2}
      _hover={{
        background: "brand.400",
        color: "black",
      }}
      _active={{
        background: "brand.400",
        color: "black",
      }}
    >
      <FlipIcon width={24} height={24} color={"black"} />
    </Button>
  );
};
