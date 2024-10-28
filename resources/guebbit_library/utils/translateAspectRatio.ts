/**
 * Translate every possible combination of different ratios in a valid number + percentage
 * @param ratio
 */
export default (ratio: string | number | undefined ) => {
    if(ratio == null)
        return;
    if (typeof ratio === 'string' && ratio.includes('/')) {
        const [width = 1, height = 1] = ratio.split('/').map(Number);
        return `${(height / width) * 100}%`;
    } else if (typeof ratio === 'number') {
        return `${ratio}%`;
    }
    // in case the % is already there
    return ratio.replace("%", "") + "%";
}