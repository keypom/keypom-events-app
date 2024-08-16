import { Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export function Wallet() {
  return (
    <div>
      <Heading>Wallet</Heading>
      <Link to="/">Home</Link>
    </div>
  );
}
