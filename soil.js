window.getSoilColor = () => {
    let h = 25 + Math.random() * 10;
    return `hsl(${h}, 40%, ${20 + Math.random() * 10}%)`;
};

window.updateSoil = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];
    // Straight down
    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
    } else {
        // Diagonals 
        let d = Math.random() < 0.5 ? 1 : -1;
        if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
            nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        }
    }
};
