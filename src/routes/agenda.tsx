import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Agenda() {
  return (
    <div>
      <Heading>Agenda</Heading>
      <Link to="/">Home</Link>
    </div>
  );
}
