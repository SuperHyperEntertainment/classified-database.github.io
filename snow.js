window.getSnowColor = () => `hsl(195, 10%, ${90 + Math.random() * 10}%)`;

window.updateSnow = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // 1. Melt if near fire
    let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if(nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if(grid[nx][ny].type === window.FIRE) {
                nextGrid[x][y] = { type: window.WATER, color: `hsl(195, 85%, 50%)` };
                return; // Turned to water
            }
        }
    }

    // 2. Slow, wavering falling
    if (Math.random() < 0.3) return; // Makes snow fall slower than sand

    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
    } else {
        let d = Math.random() < 0.5 ? 1 : -1;
        if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
            nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        }
    }
};
