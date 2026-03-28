window.getCoalColor = (burning) => burning ? `hsl(${10 + Math.random()*25}, 80%, 50%)` : `hsl(0, 0%, ${10 + Math.random() * 10}%)`;

window.updateCoal = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // Handle Burning Reactions
    if (cell.burning) {
        let touchedWater = false;
        let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
        
        for (let n of neighbors) {
            let nx = x + n.x, ny = y + n.y;
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny].type === window.WATER) {
                touchedWater = true;
                nextGrid[nx][ny] = { type: window.STEAM, color: window.getSteamColor() };
            }
        }

        if (touchedWater) {
            nextGrid[x][y] = { ...cell, burning: false, color: window.getCoalColor(false) };
            // Spawn a burst of smoke
            if (y - 1 >= 0 && nextGrid[x][y-1].type === window.EMPTY) {
                nextGrid[x][y-1] = { type: window.SMOKE, color: window.getSmokeColor() };
            }
            return; 
        } else {
            cell.life--;
            if (cell.life <= 0) {
                nextGrid[x][y] = { type: window.EMPTY }; // Ash/Burns away
                return;
            }
            // Ambiently spawn fire
            if (Math.random() < 0.02 && y - 1 >= 0 && nextGrid[x][y-1].type === window.EMPTY) {
                nextGrid[x][y-1] = { type: window.FIRE, color: window.getFireColor(), life: 50 };
            }
            nextGrid[x][y].color = window.getCoalColor(true); // Pulse color
        }
    }

    // Move
    if (nextGrid[x][y].type === window.COAL) {
        window.fallSolid(x, y, grid, nextGrid, cols, rows);
    }
};
