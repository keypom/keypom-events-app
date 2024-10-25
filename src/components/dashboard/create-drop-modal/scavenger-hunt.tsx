import {
  VStack,
  Button,
  Input,
  Text,
  HStack,
  Tooltip,
  Switch,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  updateScavengerPieceDescription,
  addScavengerPiece,
  removeScavengerPiece,
  updateNumPieces,
  isValidNonNegativeNumber,
} from "./drop-utils";
import { useState } from "react";

export const ScavengerHunt = ({
  isScavengerHunt,
  setIsScavengerHunt,
  scavengerPieces,
  setScavengerPieces,
}) => {
  const [numPiecesError, setNumPiecesError] = useState("");
  const [tempNumPieces, setTempNumPieces] = useState("2");

  const handleNumPiecesChange = (e) => {
    const value = e.target.value;
    if (isValidNonNegativeNumber(value) || value === "") {
      setTempNumPieces(value);
    }
  };

  return (
    <>
      <HStack justify="space-between" my="4" mb={isScavengerHunt ? 4 : 10}>
        <Tooltip
          bg={"rgba(23, 25, 35, 1)"}
          color={"white"}
          border={"1px solid var(--chakra-colors-brand-400)"}
          borderRadius={"md"}
          p={2}
          label="Scavenger hunts require users to collect all the pieces before the reward is given."
        >
          <HStack spacing={4} fontFamily={"mono"} w="100%">
            <Text fontSize={"sm"}>Make it a Scavenger Hunt!</Text>
            <Switch
              id="scavenger-hunt"
              isChecked={isScavengerHunt}
              onChange={() => {
                setIsScavengerHunt(!isScavengerHunt);
              }}
            />
          </HStack>
        </Tooltip>
        {isScavengerHunt && (
          <HStack
            fontFamily={"mono"}
            fontSize={"xs"}
            justify="flex-end"
            spacing={4}
          >
            <Text color="white" fontFamily={"mono"} fontSize={"sm"}>
              Num Pieces
            </Text>
            <Input
              borderRadius={"md"}
              height="35px"
              maxLength={500}
              background={"#F2F1EA"}
              placeholder="num pieces"
              color={"black"}
              fontFamily={"mono"}
              fontWeight={"700"}
              size="sm"
              sx={{
                "::placeholder": {
                  color: "gray.500",
                  fontSize: { base: "xs", md: "sm" },
                  fontFamily: "mono",
                },
              }}
              type="text"
              value={tempNumPieces}
              w="25%"
              h="fit-content"
              onBlur={() => {
                updateNumPieces(
                  tempNumPieces,
                  setNumPiecesError,
                  setScavengerPieces,
                  setTempNumPieces,
                );
              }}
              onChange={handleNumPiecesChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateNumPieces(
                    tempNumPieces,
                    setNumPiecesError,
                    setScavengerPieces,
                    setTempNumPieces,
                  );
                }
              }}
            />
          </HStack>
        )}
      </HStack>
      {numPiecesError && (
        <Text color="red.500" fontSize="sm" marginBottom={4}>
          {numPiecesError}
        </Text>
      )}
      {isScavengerHunt && (
        <>
          <VStack align="stretch" spacing={4} alignItems={"center"} mb={10}>
            {scavengerPieces.map((piece, index) => (
              <VStack key={index} alignItems="flex-start" w="100%">
                <Text color="white" fontFamily={"mono"} fontSize={"md"}>
                  {piece.piece}
                </Text>
                <HStack alignItems="center" spacing={4} w="100%">
                  <Input
                    borderRadius={"md"}
                    height="35px"
                    maxLength={500}
                    background={"#F2F1EA"}
                    css={{ touchAction: "manipulation" }} // Limits pinch and zoom gestures
                    color={"black"}
                    fontFamily={"mono"}
                    fontWeight={"700"}
                    size="sm"
                    sx={{
                      "::placeholder": {
                        color: "gray.500",
                        fontSize: { base: "16px", md: "sm" },
                        fontFamily: "mono",
                      },
                    }}
                    placeholder="Description"
                    value={piece.description}
                    onChange={(e) =>
                      updateScavengerPieceDescription(
                        index,
                        e.target.value,
                        scavengerPieces,
                        setScavengerPieces,
                      )
                    }
                  />
                  <Button
                    variant="icon"
                    background={"red.400"}
                    size="sm"
                    onClick={() => {
                      removeScavengerPiece(
                        index,
                        scavengerPieces,
                        setScavengerPieces,
                        setTempNumPieces,
                      );
                    }}
                    isDisabled={scavengerPieces.length <= 2}
                  >
                    <DeleteIcon />
                  </Button>
                </HStack>
              </VStack>
            ))}
            <Button
              size="sm"
              variant="primary"
              mb={2}
              height="35px"
              w="100%"
              onClick={() => {
                addScavengerPiece(
                  scavengerPieces,
                  setScavengerPieces,
                  setTempNumPieces,
                );
              }}
              isDisabled={scavengerPieces.length >= 10}
            >
              Add Piece
            </Button>
          </VStack>
        </>
      )}
    </>
  );
};
