import React from "react";
import ImageComponent from "./ImageComponent.tsx";


interface CardProps {
    text: string;
    icons: string[];
}

const styles = {
    card: {
        display: "flex",
        alignItems: "center",
        border: "1px solid #ccc",
        padding: "10px",
        position: "relative",
        justifyContent: "space-between",
        margin: "10px 0",
    },
    cardIcons: {
        display: "flex",
        marginRight: "10px",
    },
    img: {
        width: "2rem",
        height: "2rem",
        marginRight: ".6rem",
    },
    cardText: {
        fontSize: "1.1rem",
    },
};

const Card: React.FC<CardProps> = ({ text, icons }) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardText}>
                <span className="before-icon">{text}</span>
            </div>
            <div style={styles.cardIcons}>
                {icons.map((icon, index) => (
                    <ImageComponent
                        key={index}
                        src={icon}
                        alt={text}
                        style={styles.img}
                    />
                ))}
            </div>
        </div>
    );
};

export default Card;
