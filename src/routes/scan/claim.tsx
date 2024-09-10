import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Hidden } from "@/components/claim/hidden";
import { Reveal } from "@/components/claim/reveal";

export default function Claim() {
  const { data } = useParams();
  const [revealed, setRevealed] = useState(false);
  const onReveal = () => {
    setRevealed(true);
  };

  if (!revealed) {
    return <Hidden foundItem={"some SOV3"} onReveal={onReveal} />;
  }

  return <Reveal foundItem={"SOV3"} itemCount={20} />;
}
