import { Grid, GridItem, VStack } from "@chakra-ui/react";

import { ErrorBox } from "@/components/ui/error-box";
import { LoadingBox } from "@/components/ui/loading-box";
import { PageHeading } from "@/components/ui/page-heading";
import { CollectibleCard } from "@/components/wallet/collectibles/card";
import { Collectible, fetchCollectibles } from "@/lib/api/collectibles";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

const CollectiblesGrid = ({ lockedItems, unlockedItems }) => {
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
            <CollectibleCard {...collectible} />
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
            <CollectibleCard {...collectible} disabled />
          </GridItem>
        ))}
      </Grid>
    </>
  );
};

export default function Collectibles() {
  const {
    data: collectibles,
    error,
    isError,
    isLoading,
  } = useQuery({ queryKey: ["collectibles"], queryFn: fetchCollectibles });

  const unlockedItems = useMemo(
    () => (collectibles ? collectibles.filter((it) => it.isFound) : []),
    [collectibles],
  );
  const lockedItems = useMemo(
    () => (collectibles ? collectibles.filter((it) => !it.isFound) : []),
    [collectibles],
  );

  const getProgressDescription = (collectibles: Collectible[]) => {
    const completed = unlockedItems.length;
    return `${completed}/${collectibles.length} found`;
  };

  return (
    <VStack spacing={4} p={4}>
      <PageHeading
        title="Collectibles"
        titleSize="24px"
        description={collectibles ? getProgressDescription(collectibles) : ""}
        showBackButton
      />
      {isLoading && <LoadingBox />}
      {collectibles && (
        <CollectiblesGrid
          lockedItems={lockedItems}
          unlockedItems={unlockedItems}
        />
      )}
      {isError && <ErrorBox message={`Error: ${error.message}`} />}
    </VStack>
  );
}
