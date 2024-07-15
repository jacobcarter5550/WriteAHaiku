import React, { FC, HTMLAttributes } from 'react';

interface LabelProps extends HTMLAttributes<HTMLLabelElement> {

}

const Label: FC<LabelProps> = ({ children, ...rest }) => {
  return <label {...rest}>{children}</label>;
};

export default Label;