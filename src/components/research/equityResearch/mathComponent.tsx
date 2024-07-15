import React, { useEffect, useState } from 'react';
import { TextArea } from '@carbon/react';
import { addStyles, EditableMathField } from 'react-mathquill';

addStyles();

type MathTextAreaProps = {
    value: string;
    onChange: (value: string) => void;
    rows?: number;
    id?: string;
    className?: string;
};

const MathTextArea: React.FC<MathTextAreaProps> = ({ value, onChange, rows = 5, id, className }) => {
    const [mathValue, setMathValue] = useState<string>(value);

    useEffect(() => {
        setMathValue(value);
    }, [value]);

    const handleMathChange = (mathField: any) => {
        const newValue = mathField.latex();
        setMathValue(newValue);
        onChange(newValue);
    };

    return (
        <div className={className} id={id}>
            <EditableMathField
                latex={mathValue}
                onChange={handleMathChange}
                style={{ width: '100%', height: 'auto', minHeight: rows * 20 }}
            />
        </div>
    );
};

export default MathTextArea;
