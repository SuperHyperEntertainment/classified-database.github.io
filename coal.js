window.getCoalColor = () => '#111';

window.updateCoal = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // 1. Fall physics (like sand)
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

    let currentCell = nextGrid[movedX][movedY];

    // 2. Interactions
    let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = movedX + n.x, ny = movedY + n.y;
        if(nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            let neighbor = grid[nx][ny];

            // Extinguish by water
            if (neighbor.type === window.WATER && currentCell.burning) {
                currentCell.burning = false;
                currentCell.color = window.getCoalColor();
                // Tons of smoke
                if (movedY - 1 >= 0 && nextGrid[movedX][movedY-1].type === window.EMPTY) {
                    nextGrid[movedX][movedY-1] = { type: window.SMOKE, color: window.getSmokeColor() };
                }
                return;
            }

            // Catch fire slowly
            if (neighbor.type === window.FIRE && !currentCell.burning && Math.random() < 0.02) {
                currentCell.burning = true;
                currentCell.life = 1000 + Math.random() * 500; // Very long burn
                currentCell.color = '#ff4400'; // Glowing red
            }
        }
    }

    // 3. Burning process
    if (currentCell.burning) {
        currentCell.life--;
        // Periodically emit real fire upwards
        if (Math.random() < 0.05 && movedY - 1 >= 0 && nextGrid[movedX][movedY-1].type === window.EMPTY) {
            nextGrid[movedX][movedY-1] = { type: window.FIRE, color: window.getFireColor(), life: 50 };
        }
        if (currentCell.life <= 0) {
            nextGrid[movedX][movedY] = { type: window.EMPTY }; // Ash/gone
        }
    }
};
