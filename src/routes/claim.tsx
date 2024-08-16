// import { useParams } from "react-router-dom";
import { useState } from "react";

import { Hidden } from "../components/claim/hidden";
import { Reveal } from "../components/claim/reveal";

export function Claim() {
  // const { id } = useParams();
  const [revealed, setRevealed] = useState(false);
  const onReveal = () => {
    setRevealed(true);
  };

  if (!revealed) {
    return <Hidden foundItem={"SOV3"} onReveal={onReveal} />;
  }

  return <Reveal foundItem={"SOV3"} itemCount={20} />;
}
