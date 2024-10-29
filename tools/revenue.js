export const getRevenue = (price, cost) => {
    if (price < 0.001 || cost < 0.001) return 0.0;
    return parseFloat(((price - cost) / cost) * 100).toFixed(2);
}