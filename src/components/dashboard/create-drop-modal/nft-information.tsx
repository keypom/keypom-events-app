/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { VStack, HStack, Textarea } from "@chakra-ui/react";
import { FormControl } from "@/components/dashboard/form-control";
import { ImageInput } from "./image-input";

interface NFTInformationProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}

export const NFTInformation: React.FC<NFTInformationProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
}) => {
  const onNFTDataChange = (key: string, value: string) => {
    setCreatedDrop({
      ...createdDrop,
      nftData: { ...createdDrop.nftData, [key]: value },
    });
  };

  return (
    <>
      <VStack spacing={0} w="100%">
        <HStack spacing={6} w="100%">
          <FormControl
            label="NFT Title"
            required={true}
            errorText={errors.nft?.title}
            my="1"
          >
            <Textarea
              borderRadius={"md"}
              height="35px"
              maxLength={500}
              background={"#F2F1EA"}
              color={"black"}
              fontFamily={"mono"}
              fontWeight={"700"}
              size="sm"
              sx={{
                "::placeholder": {
                  color: "black",
                  fontSize: { base: "xs", md: "sm" },
                  fontFamily: "mono",
                },
              }}
              value={createdDrop.nftData?.title || ""}
              onChange={(e) => onNFTDataChange("title", e.target.value)}
              isInvalid={!!errors.nft?.title}
              placeholder="Coolest NFT ever"
            />
          </FormControl>
          <FormControl
            label="NFT Description"
            required={true}
            errorText={errors.nft?.description}
          >
            <Textarea
              borderRadius={"md"}
              height="35px"
              maxLength={500}
              background={"#F2F1EA"}
              color={"black"}
              fontFamily={"mono"}
              fontWeight={"700"}
              size="sm"
              sx={{
                "::placeholder": {
                  color: "black",
                  fontSize: { base: "xs", md: "sm" },
                  fontFamily: "mono",
                },
              }}
              value={createdDrop.nftData?.description || ""}
              onChange={(e) => onNFTDataChange("description", e.target.value)}
              isInvalid={!!errors.nft?.description}
              placeholder="One of a kind proof of touch"
            />
          </FormControl>
        </HStack>
        <ImageInput
          createdDrop={createdDrop}
          setCreatedDrop={setCreatedDrop}
          errors={errors}
        />
      </VStack>
    </>
  );
};
