import React from "react";

interface ButtonProps {
  onClick: (e?: any) => void;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  disable?: boolean;
  id?: string;
  ref?: React.RefObject<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  className,
  style,
  disable,
  id,
  ref,
}) => {
  return (
    <button
      ref={ref}
      id={id}
      style={style}
      className={`btn ${className ?? "default"}`}
      onClick={onClick}
      disabled={disable}
    >
      {label}
    </button>
  );
};

export default Button;
