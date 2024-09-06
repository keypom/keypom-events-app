/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";
import { FormControl } from "@/components/dashboard/form-control";
import { ImageFileInputSmall } from "@/components/dashboard/image-file-input";

interface ImageInputProps {
  createdDrop: any;
  setCreatedDrop: React.Dispatch<React.SetStateAction<any>>;
  errors: any;
}

export const ImageInput: React.FC<ImageInputProps> = ({
  createdDrop,
  setCreatedDrop,
  errors,
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
    setCreatedDrop({ ...createdDrop, artwork: e.target.files[0] });
  };

  return (
    <FormControl
      label="Image"
      required={true}
      labelProps={{ fontSize: { base: "xs", md: "md" } }}
      my="1"
    >
      <ImageFileInputSmall
        accept="image/jpeg, image/png, image/gif"
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
