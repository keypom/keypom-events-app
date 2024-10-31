/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { FormControl } from "@/components/dashboard/form-control";
import { ImageFileInputSmall } from "@/components/dashboard/image-file-input";

interface ImageInputProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ImageInput: React.FC<ImageInputProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
  setErrors,
}) => {
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    const selectedFile = createdDrop.artwork;
    if (selectedFile === undefined) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [createdDrop.artwork]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCreatedDrop({ ...createdDrop, artwork: undefined });
      return;
    }

    const selectedFile = e.target.files[0];

    if (selectedFile.size > MAX_FILE_SIZE) {
      // Set the error message for artwork
      setErrors((prevErrors) => ({
        ...prevErrors,
        artwork: `File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB`,
      }));
      // Unset the selected file
      setCreatedDrop({ ...createdDrop, artwork: undefined });
      return;
    }

    // Clear any existing errors for artwork
    if (errors.artwork) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        artwork: undefined,
      }));
    }

    setCreatedDrop({ ...createdDrop, artwork: selectedFile });
  };

  return (
    <FormControl
      label="Image"
      required={true}
      labelProps={{ fontSize: { base: "xs", md: "md" } }}
      my="1"
    >
      <ImageFileInputSmall
        accept="image/jpeg, image/png, image/gif, image/jpg"
        ctaText="Upload drop artwork"
        errorMessage={errors.artwork}
        isInvalid={!!errors.artwork}
        preview={preview}
        selectedFile={createdDrop.artwork}
        onChange={onSelectFile}
      />
    </FormControl>
  );
};
