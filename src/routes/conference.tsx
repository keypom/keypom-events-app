import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Conference() {
  return (
    <div>
      <Heading>Conference</Heading>
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}
