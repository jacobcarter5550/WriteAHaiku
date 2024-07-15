import React from "react";

type HeadingVariant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeaderProps {
  variant: HeadingVariant;
  text: string;
  classtext?: string;
  style?: React.CSSProperties;
}

const headingSwitch = (variant: HeadingVariant) => {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    default:
      return "h1";
  }
};

export const Heading: React.FC<HeaderProps> = ({
  variant,
  text,
  classtext,
  style
}) => {
  const HeadingTag = headingSwitch(variant);
  return <HeadingTag className={classtext ?? ""} style={style}>{text}</HeadingTag>;
};

export default Heading;
