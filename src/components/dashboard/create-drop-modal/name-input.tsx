import { FormControl } from "@/components/dashboard/form-control";
import { Input } from "@chakra-ui/react";

export const NameInput = ({
  createdDrop,
  setCreatedDrop,
  errors,
  setErrors,
}) => (
  <FormControl
    errorText={errors.name}
    label="Name"
    required={true}
    labelProps={{ fontSize: { base: "xs", md: "md" } }}
    my="1"
  >
    <Input
      borderRadius={"md"}
      height="35px"
      isInvalid={!!errors.name}
      maxLength={500}
      background={"#F2F1EA"}
      placeholder="My Awesome Drop"
      color={"black"}
      fontFamily={"mono"}
      fontWeight={"700"}
      size="sm"
      sx={{
        "::placeholder": {
          color: "gray.500",
          fontSize: { base: "16px", md: "sm" },
          fontFamily: "mono",
        },
      }}
      type="text"
      value={createdDrop.name}
      onChange={(e) => {
        setErrors({ ...errors, name: "" });
        setCreatedDrop({ ...createdDrop, name: e.target.value });
      }}
    />
  </FormControl>
);
