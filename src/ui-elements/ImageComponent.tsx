import React from "react";
import { useTheme } from "next-themes";

type Props = {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  onClick?: any;
  className?: string;
  title?: string;
};

const ImageComponent = ({
  src,
  alt,
  style,
  onClick,
  className,
  title,
}: Props) => {
  const theme = useTheme();
  const themedSrc = theme.theme === "dark" ? `dark-${src}` : src;

  return (
    <img
      src={"/" + themedSrc}
      alt={alt}
      style={style}
      onClick={onClick}
      className={className}
      title={title}
    />
  );
};

export default ImageComponent;
