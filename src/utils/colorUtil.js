export const getColor = () => {
    const colorStr = '0123456789abcdef';
    let colorVal = '#';
    for (let l=0; l<6; l++){
        const index = parseInt(Math.random() * colorStr.length);
        colorVal += colorStr.charAt(index)
    }
    return colorVal
};