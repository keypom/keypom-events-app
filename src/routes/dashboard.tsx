import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Dashboard() {
  return (
    <div>
      <Heading>Dashboard</Heading>
      <Link to="/">Home</Link>
    </div>
  );
}
