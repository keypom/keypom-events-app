import { Grid, GridItem, VStack } from "@chakra-ui/react";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { CollectibleCard } from "@/components/wallet/collectibles/card";
import { useAccountData } from "@/hooks/useAccountData";
import { ExtClaimedDrop, ExtDropData } from "@/lib/event";
import { getIpfsImageSrcUrl } from "@/lib/helpers/ipfs";

const Divider = () => {
  return (
    <hr
      style={{
        border: "2px solid var(--chakra-colors-brand-400)",
        width: "100%",
        maxWidth: "450px",
        margin: "24px 0",
      }}
    />
  );
};

const CollectiblesGrid = ({
  lockedItems,
  unlockedItems,
}: {
  lockedItems: ExtDropData[];
  unlockedItems: ExtClaimedDrop[];
}) => {
  return (
    <>
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        width={"100%"}
        maxWidth="450px"
      >
        {unlockedItems.map((collectible, index) => (
          <GridItem key={index} p={2} pb={4}>
            <CollectibleCard
              id={collectible.drop_id}
              title={collectible.nft_metadata?.title || ""}
              description={collectible.nft_metadata?.description || ""}
              assetType="POAP"
              imageSrc={getIpfsImageSrcUrl(
                collectible.nft_metadata?.media || "",
              )}
              isFound={false}
            />
          </GridItem>
        ))}
      </Grid>
      <Divider />
      {/* Locked */}
      <Grid
        templateColumns={{
          base: "repeat(2, minmax(0, 1fr))",
        }}
        width={"100%"}
        maxWidth="450px"
      >
        {lockedItems.map((collectible, index) => (
          <GridItem key={index} p={2} pb={4}>
            <CollectibleCard
              id={collectible.drop_id}
              title={collectible.nft_metadata?.title || ""}
              description={collectible.nft_metadata?.description || ""}
              assetType="POAP"
              imageSrc={getIpfsImageSrcUrl(
                collectible.nft_metadata?.media || "",
              )}
              isFound={false}
              disabled
            />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default function Collectibles() {
  const { data, isLoading, isError, error } = useAccountData();

  const unlockedItems =
    !data || isLoading || isError ? [] : data.ownedCollectibles;
  const lockedItems =
    !data || isLoading || isError ? [] : data.unownedCollectibles;

  // Filter out locked items that have the same drop_id as any unlocked item
  const filteredLockedItems = lockedItems.filter(
    (lockedItem) =>
      !unlockedItems.some(
        (unlockedItem) => unlockedItem.drop_id === lockedItem.drop_id,
      ),
  );

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectibles"
        titleSize="24px"
        description={`${unlockedItems.length}/${lockedItems.length} found`}
        showBackButton
      />
      {isLoading && <LoadingBox />}
      {lockedItems.length > 0 && (
        <CollectiblesGrid
          lockedItems={filteredLockedItems}
          unlockedItems={unlockedItems}
        />
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
