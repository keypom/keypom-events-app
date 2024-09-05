import { useTokenCreateModalStore } from "@/stores/token-create-modal";

export function TokenCreateModal() {
  const {
    isOpen,
    onClose,
    dropProps,
    scavengerPieces,
    isLoading,
    isScavengerHunt,
  } = useTokenCreateModalStore();

  const resetValues = () => {
    dropProps.name = "";
    dropProps.artwork = undefined;
    dropProps.amount = "1";
    dropProps.nftData = undefined;
    scavengerPieces[0].piece = `Piece 1`;
    scavengerPieces[0].description = "";
    scavengerPieces[1].piece = `Piece 2`;
    scavengerPieces[1].description = "";
  };
  return (
    <>
      <h2>test</h2>
    </>
  );
}
