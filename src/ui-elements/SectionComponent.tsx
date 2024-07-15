import React from "react";

type Props = {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    ref?: any;
};

const SectionComponent = ({ children, style, className, ref }: Props) => {
    return (
        <div style={style} className={`${className} section-comp-container`} ref={ref}>
            {children}
        </div>
    );
};

export default SectionComponent;
