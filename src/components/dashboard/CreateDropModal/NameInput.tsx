import { FormControlComponent } from "@/components/dashboard/FormControl";
import { Input } from "@chakra-ui/react";

export const NameInput = ({
  createdDrop,
  setCreatedDrop,
  errors,
  setErrors,
}) => (
  <FormControlComponent
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
      background={"tertiary"}
      placeholder="My Awesome Drop"
      color="secondary"
      fontFamily={"mono"}
      fontWeight={"700"}
      size="sm"
      sx={{
        "::placeholder": {
          color: "black",
          fontSize: { base: "xs", md: "sm" },
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
  </FormControlComponent>
);
