import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Hidden } from "@/components/claim/hidden";
import { Reveal } from "@/components/claim/reveal";
import eventHelperInstance, { ExtClaimedDrop } from "@/lib/event";
import { LoadingBox } from "@/components/ui/loading-box";
import { ErrorBox } from "@/components/ui/error-box";
import { useAccountData } from "@/hooks/useAccountData";

export default function Claim() {
  const location = useLocation();
  const { data: encodedDropId } = useParams();
  const { data, isLoading, isError, error } = useAccountData();

  const [revealed, setRevealed] = useState(false);
  const [reward, setReward] = useState<ExtClaimedDrop>();

  const navigate = useNavigate();
  const secretKey = location.state?.secretKey;
  eventHelperInstance.debugLog(`Secret Key: ${secretKey}`, "log");

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

      setReward(claimedDropInfo);
    };

    fetchReward();
  }, [data, encodedDropId]);

  const onReveal = () => {
    const isScavenger = (reward?.needed_scavenger_ids?.length || 0) > 1;
    const numFound = reward?.found_scavenger_ids?.length || 0;
    const numRequired = reward?.needed_scavenger_ids?.length || 0;
    const isScavengerComplete = isScavenger && numFound === numRequired;
    const isActiveScavengerHunt = isScavenger && !isScavengerComplete;

    if (isActiveScavengerHunt) {
      // Redirect to journeys page
      const dropId = decodeURIComponent(encodedDropId!);
      navigate(`/wallet/journeys/${dropId}`);
    } else {
      setRevealed(true);
    }
  };

  if (isError) {
    return <ErrorBox message={error?.message} />;
  }

  if (!reward || isLoading) {
    return <LoadingBox />;
  }

  const isScavenger = (reward.needed_scavenger_ids?.length || 0) > 1;
  const numFound = reward.found_scavenger_ids?.length || 0;
  const numRequired = reward.needed_scavenger_ids?.length || 0;
  let pieceId: number | undefined = undefined;

  if (secretKey) {
    const pubKey = eventHelperInstance.getPubFromSecret(secretKey);
    pieceId =
      reward.needed_scavenger_ids?.find((piece) => piece.key === pubKey)?.id ||
      numFound;
  }

  const isScavengerComplete = isScavenger && numFound === numRequired;
  const isActiveScavengerHunt = isScavenger && !isScavengerComplete;

  if (!revealed) {
    return (
      <Hidden
        foundItem={reward}
        onReveal={onReveal}
        isActiveScavengerHunt={isActiveScavengerHunt}
        numFound={numFound}
        pieceId={pieceId}
        numRequired={numRequired}
      />
    );
  }

  return <Reveal foundItem={reward} />;
}
