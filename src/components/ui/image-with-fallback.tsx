import { Image, ImageProps, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

import { FALLBACK_IMAGE_URL } from "@/constants/common";

export function ImageWithFallback({ src, fallbackSrc, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  return (
    <Skeleton isLoaded={!loading} {...props}>
      <Image
        src={src}
        fallbackSrc={fallbackSrc || FALLBACK_IMAGE_URL}
        {...props}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </Skeleton>
  );
}
