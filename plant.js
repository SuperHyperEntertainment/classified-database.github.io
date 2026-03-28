window.getPlantColor = () => {
    let h = 100 + Math.random() * 30; 
    return `hsl(${h}, 65%, ${35 + Math.random() * 15}%)`; // Brighter green for tips/leaves
};

window.getStemColor = () => {
    let h = 90 + Math.random() * 20;
    return `hsl(${h}, 40%, ${20 + Math.random() * 10}%)`; // Darker, browner green for the stem
};

window.updatePlant = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // If it's a stem (not a growing tip), do nothing
    if (!cell.isTip) return;

    // 1. Drink adjacent water to regain SOME energy (capped so it doesn't grow forever)
    let neighbors = [{x:0,y:-1}, {x:0,y:1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (grid[nx][ny].type === window.WATER) {
                nextGrid[nx][ny] = { type: window.EMPTY }; // Drink the water!
                cell.energy = Math.min(25, (cell.energy || 0) + 5); // Add energy, cap at 25
            }
        }
    }

    // 2. Grow organically (stems and branches)
    if (cell.energy > 0 && Math.random() < 0.25) {
        let dx = 0; 
        let branch = false;

        // Slight chance to lean left or right
        if (Math.random() < 0.2) dx = Math.random() < 0.5 ? -1 : 1; 
        
        // Rare chance to split into two branches (only if it has enough energy)
        if (Math.random() < 0.05 && cell.energy > 8) branch = true;

        let nx = x + dx;
        let ny = y - 1; // Always progress upwards

        if (ny >= 0 && nx >= 0 && nx < cols) {
            if (branch) {
                // Try to spawn a left and right branch
                let leftOk = (x - 1 >= 0 && nextGrid[x-1][ny].type === window.EMPTY);
                let rightOk = (x + 1 < cols && nextGrid[x+1][ny].type === window.EMPTY);

                if (leftOk) nextGrid[x-1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: Math.floor(cell.energy / 2) };
                if (rightOk) nextGrid[x+1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: Math.floor(cell.energy / 2) };
                
                if (leftOk || rightOk) {
                    cell.isTip = false; // This part stops growing
                    cell.color = window.getStemColor(); // Turn dark
                }
            } else {
                // Normal single growth
                if (nextGrid[nx][ny].type === window.EMPTY) {
                    nextGrid[nx][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                    cell.isTip = false; 
                    cell.color = window.getStemColor(); 
                } else if (dx !== 0 && nextGrid[x][ny].type === window.EMPTY) {
                     // If it tried to grow diagonal but was blocked, try growing straight up instead
                     nextGrid[x][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                     cell.isTip = false;
                     cell.color = window.getStemColor();
                }
            }
        }
    } else if (cell.energy <= 0) {
        // Run out of energy, stop growing forever
        cell.isTip = false; 
    }
};
