export const formattedNumber = (value:string) => {
    const num = Number(value);
    return num
        .toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        })
        .split("$")[1];
};
