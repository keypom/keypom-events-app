import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Help() {
  return (
    <div>
      <Heading>Help</Heading>
      <Link to="/">Home</Link>
    </div>
  );
}
