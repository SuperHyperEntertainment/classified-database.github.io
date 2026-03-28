window.getSeedColor = () => `#c2a878`; 

window.updateSeed = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // 1. Fall logic (identical to soil)
    let movedX = x, movedY = y;
    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        movedY = y + 1;
    } else {
        let d = Math.random() < 0.5 ? 1 : -1;
        if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
            nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
            movedX = x + d; movedY = y + 1;
        }
    }

    // 2. Germination (must be near SOIL and touch WATER)
    let isTouchingSoil = false;
    let waterToDrink = null;
    
    // Check neighbors for soil and water
    let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}, {x:-1,y:1}, {x:1,y:1}];
    for(let n of neighbors) {
        let nx = movedX + n.x, ny = movedY + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (nextGrid[nx][ny].type === window.SOIL) isTouchingSoil = true;
            if (grid[nx][ny].type === window.WATER) waterToDrink = {x: nx, y: ny};
        }
    }

    // If conditions are met, sprout!
    if (isTouchingSoil && waterToDrink) {
        nextGrid[waterToDrink.x][waterToDrink.y] = { type: window.EMPTY }; // Consume water
        nextGrid[movedX][movedY] = { type: window.PLANT, color: window.getPlantColor(), growth: 5 }; 
    }
};
