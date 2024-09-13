import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { Hidden } from "@/components/claim/hidden";
import { Reveal } from "@/components/claim/reveal";
import eventHelperInstance, { ExtClaimedDrop } from "@/lib/event";
import { LoadingBox } from "@/components/ui/loading-box";
import { ErrorBox } from "@/components/ui/error-box";
import { useAccountData } from "@/hooks/useAccountData";

export default function Claim() {
  const { data: encodedDropId } = useParams();
  const { data, isLoading, isError, error } = useAccountData();

  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<ExtClaimedDrop>();
  const [numFound, setNumFound] = useState<number | undefined>(undefined);
  const [numRequired, setNumRequired] = useState<number | undefined>(undefined);

  useEffect(() => {
    const fetchReward = async () => {
      if (!data || !encodedDropId) {
        return;
      }

      const dropId = decodeURIComponent(encodedDropId);
      const claimedDropInfo: ExtClaimedDrop =
        await eventHelperInstance.viewCall({
          methodName: "get_claimed_drop_for_account",
          args: { drop_id: dropId, account_id: data.accountId },
        });

      if (
        claimedDropInfo.found_scavenger_ids &&
        claimedDropInfo.needed_scavenger_ids
      ) {
        setNumFound(claimedDropInfo.found_scavenger_ids.length);
        setNumRequired(claimedDropInfo.needed_scavenger_ids.length);
      }

      setReward(claimedDropInfo);
    };

    fetchReward();
  }, [data, encodedDropId]);

  const onReveal = () => {
    setRevealed(true);
  };

  if (isError) {
    return <ErrorBox message={error?.message} />;
  }

  if (!reward || isLoading) {
    return <LoadingBox />;
  }

  if (!revealed) {
    return (
      <Hidden
        foundItem={reward}
        onReveal={onReveal}
        numFound={numFound}
        numRequired={numRequired}
      />
    );
  }

  return <Reveal foundItem={reward} numFound={4} numRequired={6} />;
}
