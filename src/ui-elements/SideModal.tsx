import React, { useRef } from "react";
import useOutside from "../hooks/useOutside.tsx";

const SideModal: React.FC<{
  close: () => void;
  children: any;
  style?: React.CSSProperties;
}> = ({ close, children, style }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutside(modalRef, close);
  return (
    <aside ref={modalRef} style={style} className="innerModal">
      {children}
    </aside>
  );
};

export default SideModal;
