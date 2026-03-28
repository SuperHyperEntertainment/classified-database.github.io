window.getOilColor = () => `hsl(0, 0%, ${5 + Math.random() * 10}%)`;

window.updateOil = function(x, y, grid, nextGrid, cols, rows) {
    window.fallLiquid(x, y, grid, nextGrid, cols, rows);
};
