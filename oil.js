window.getOilColor = () => {
    const shades = ['#1a1a1a', '#222222', '#2b2b2b'];
    return shades[Math.floor(Math.random() * shades.length)];
};

window.updateOil = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // 1. Fire interaction (catches fire, makes smoke)
    let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if(nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if(grid[nx][ny].type === window.FIRE && Math.random() < 0.2) {
                // Ignite oil
                nextGrid[x][y] = { type: window.FIRE, color: window.getFireColor(), life: 100 + Math.random() * 50 };
                // Produce smoke above
                if (y - 1 >= 0 && nextGrid[x][y-1].type === window.EMPTY) {
                    nextGrid[x][y-1] = { type: window.SMOKE, color: window.getSmokeColor() };
                }
                return; // Stop moving, it turned into fire
            }
        }
    }

    // 2. Liquid Movement (EXACTLY LIKE WATER)
    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
    } else {
        let d = Math.random() < 0.5 ? 1 : -1;
        if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
            nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        } else if (x+d >= 0 && x+d < cols && nextGrid[x+d][y].type === window.EMPTY) {
            nextGrid[x+d][y] = cell; nextGrid[x][y] = {type: window.EMPTY};
        }
    }
};
