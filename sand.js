window.getSandColor = () => {
    const h = 40 + Math.random() * 10;
    return `hsl(${h}, 70%, ${50 + Math.random() * 15}%)`;
};

window.updateSand = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];
    // Straight down
    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
    } else {
        // Diagonals (makes cones)
        let d = Math.random() < 0.5 ? 1 : -1;
        if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
            nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        }
    }
};
