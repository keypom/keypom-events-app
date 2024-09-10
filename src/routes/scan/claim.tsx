import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Hidden } from "@/components/claim/hidden";
import { Reveal } from "@/components/claim/reveal";
import eventHelperInstance, { ExtDropData } from "@/lib/event";
import { LoadingBox } from "@/components/ui/loading-box";

export default function Claim() {
  const { data } = useParams();
  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<ExtDropData>();

  useEffect(() => {
    const fetchReward = async () => {
      if (!data) {
        return;
      }

      const dropInfo = await eventHelperInstance.viewCall({
        methodName: "get_drop_information",
        args: { drop_id: data },
      });
      console.log("Drop info: ", dropInfo);
      setReward(dropInfo);
    };

    fetchReward();
  }, [data]);

  const onReveal = () => {
    setRevealed(true);
  };

  if (!reward) {
    return <LoadingBox />;
  }

  if (!revealed) {
    return <Hidden foundItem={reward} onReveal={onReveal} />;
  }

  return <Reveal foundItem={reward} />;
}
