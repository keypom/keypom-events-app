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
      variant={"primary"}
      padding="0px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position={"absolute"}
      bottom="1rem"
      right="1rem"
      height={"40px"}
      hidden={devices.length < 2}
    >
      <FlipIcon width={24} height={24} />
    </Button>
  );
};
