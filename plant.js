window.getPlantColor = () => {
    let h = 100 + Math.random() * 40; 
    return `hsl(${h}, 60%, ${30 + Math.random() * 20}%)`;
};

window.updatePlant = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // 1. Drink adjacent water to fuel growth
    let neighbors = [{x:0,y:-1}, {x:0,y:1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (grid[nx][ny].type === window.WATER) {
                nextGrid[nx][ny] = { type: window.EMPTY }; // Drink the water!
                cell.growth = (cell.growth || 0) + 3; // Boost growth potential
            }
        }
    }

    // 2. Grow upwards or diagonally outwards
    if (cell.growth > 0 && Math.random() < 0.2) {
        let dx = Math.floor(Math.random() * 3) - 1; // -1 (left), 0 (straight), or 1 (right)
        let nx = x + dx;
        let ny = y - 1; // Always grow UP

        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            // ONLY grow into completely empty space
            if (nextGrid[nx][ny].type === window.EMPTY) {
                // Create new plant tip
                nextGrid[nx][ny] = { type: window.PLANT, color: window.getPlantColor(), growth: cell.growth - 1 };
                // Current segment becomes a stem (stops growing)
                cell.growth = 0;
            }
        }
    }
};
