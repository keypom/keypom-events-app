/* eslint-disable @typescript-eslint/no-explicit-any */

import eventHelperInstance from "@/lib/event";

export const isValidNonNegativeNumber = (value: string) =>
  /^\d*\.?\d+$/.test(value);

export const validateForm = (
  createdDrop: any,
  setErrors: React.Dispatch<React.SetStateAction<any>>,
  existingDropNames: string[],
  isScavengerHunt: boolean,
  scavengerPieces: Array<{ piece: string; description: string }>,
) => {
  const errors: any = {};
  // Name validation
  if (!createdDrop.name || createdDrop.name.trim() === "") {
    errors.name = "Name is required";
  }

  eventHelperInstance.debugLog(
    `Existing drop names: ${existingDropNames} Input : ${createdDrop.name}`,
    "log",
  );

  if (
    existingDropNames
      .map((name) => name.trim().toLowerCase())
      .includes(createdDrop.name.trim().toLowerCase())
  ) {
    errors.name = "Drop name already used. Please choose a different name.";
  }

  if (!createdDrop.artwork) errors.artwork = "Artwork is required";

  if (createdDrop.nftData) {
    if (!createdDrop.nftData.title)
      errors.nft = { ...errors.nft, title: "NFT title is required" };
    if (!createdDrop.nftData.description)
      errors.nft = {
        ...errors.nft,
        description: "NFT description is required",
      };
  }

  // Scavenger Hunt validation
  if (isScavengerHunt) {
    // Check for empty descriptions
    const emptyDescriptions = scavengerPieces.filter(
      (piece) => !piece.description || piece.description.trim() === "",
    );
    if (emptyDescriptions.length > 0) {
      errors.scavengerPieces = "All scavenger piece descriptions are required.";
    }

    // Check for more than 10 pieces
    if (scavengerPieces.length > 10) {
      errors.scavengerPieces = "Cannot have more than 10 scavenger pieces.";
    }
  }

  setErrors(errors);
  return Object.keys(errors).length === 0;
};

export const updateScavengerPieceDescription = (
  index,
  value,
  scavengerPieces,
  setScavengerPieces,
) => {
  const newPieces = [...scavengerPieces];
  newPieces[index].description = value;
  setScavengerPieces(newPieces);
};

export const addScavengerPiece = (
  scavengerPieces,
  setScavengerPieces,
  setTempNumPieces,
) => {
  if (scavengerPieces.length < 10) {
    const newPiece = {
      piece: `Step ${scavengerPieces.length + 1}`,
      description: "",
    };
    setScavengerPieces([...scavengerPieces, newPiece]);
    setTempNumPieces((scavengerPieces.length + 1).toString());
  }
};

export const updateNumPieces = (
  tempNumPieces,
  setNumPiecesError,
  setScavengerPieces,
  setTempNumPieces,
) => {
  let numPieces = parseInt(tempNumPieces, 10);
  if (isNaN(numPieces) || numPieces < 1) {
    setNumPiecesError("Journeys need to have at least 1 step.");
    numPieces = 1; // Minimum 2 pieces if scavenger hunt is active
  } else {
    setNumPiecesError("");
  }

  if (numPieces > 10) {
    numPieces = 10;
    setNumPiecesError("Journeys cannot have more than 10 steps.");
  }

  if (numPieces <= 10) {
    const newPieces = Array.from({ length: numPieces }, (_, i) => ({
      piece: `Step ${i + 1}`,
      description: "",
    }));
    setScavengerPieces(newPieces);
    setTempNumPieces(numPieces.toString());
  }
};

export const removeScavengerPiece = (
  index,
  scavengerPieces,
  setScavengerPieces,
  setTempNumPieces,
) => {
  if (scavengerPieces.length > 1) {
    // Ensure there's always at least 1 piece
    let newPieces = scavengerPieces.filter((_, i) => i !== index);

    // Reassign piece numbers to ensure they are sequential
    newPieces = newPieces.map((piece, i) => ({
      ...piece,
      piece: `Step ${i + 1}`,
    }));

    setScavengerPieces(newPieces);
    setTempNumPieces(newPieces.length.toString());
  }
};
