import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Me() {
  return (
    <div>
      <Heading>Me</Heading>
      <Link to="/">Home</Link>
    </div>
  );
}
