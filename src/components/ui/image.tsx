import { Image as ChakraImage, ImageProps, Skeleton } from "@chakra-ui/react";
import { useState } from "react";

export function Image({ src, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  return (
    <Skeleton isLoaded={!loading} {...props}>
      <ChakraImage
        src={src}
        fallbackSrc={"./assets/image-fallback.png"}
        {...props}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </Skeleton>
  );
}
