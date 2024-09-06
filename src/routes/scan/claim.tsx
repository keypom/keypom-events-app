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

  useEffect(() => {
    if (data) {
      // DO SOMETHING TO CLAIM DATA
      onReveal();
    }
  }, [data]);

  if (!revealed) {
    return <Hidden foundItem={"SOV3"} onReveal={onReveal} />;
  }

  return <Reveal foundItem={"SOV3"} itemCount={20} />;
}
