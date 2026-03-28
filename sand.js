window.getSandColor = () => `hsl(${40 + Math.random() * 10}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`;

window.updateSand = function(x, y, grid, nextGrid, cols, rows) {
    window.fallSolid(x, y, grid, nextGrid, cols, rows);
};
