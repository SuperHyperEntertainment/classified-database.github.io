window.getPlantColor = () => {
    let h = 100 + Math.random() * 30; 
    return `hsl(${h}, 65%, ${35 + Math.random() * 15}%)`; 
};

window.getStemColor = () => {
    let h = 90 + Math.random() * 20;
    return `hsl(${h}, 40%, ${20 + Math.random() * 10}%)`; 
};

window.updatePlant = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];

    // If it's a stem, do nothing
    if (!cell.isTip) return;

    // THE HARD LIMIT: If out of energy, stop growing forever.
    if (cell.energy <= 0) {
        cell.isTip = false; 
        cell.color = window.getStemColor();
        return;
    }

    // 1. Drink adjacent water (Visual effect only, NO energy gained!)
    let neighbors = [{x:0,y:-1}, {x:0,y:1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (grid[nx][ny].type === window.WATER) {
                nextGrid[nx][ny] = { type: window.EMPTY }; 
                break; // Only drink one per frame
            }
        }
    }

    // 2. Crowding Check (Sunlight)
    let plantCount = 0;
    for(let i = -2; i <= 2; i++) {
        for(let j = -2; j <= 2; j++) {
            let cx = x + i, cy = y + j;
            if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
                if (grid[cx][cy].type === window.PLANT) plantCount++;
            }
        }
    }

    // Allow up to 8 so branches can survive, but dense blocks choke and die.
    if (plantCount > 8) {
        cell.isTip = false;
        cell.color = window.getStemColor();
        return;
    }

    // 3. Grow organically 
    if (Math.random() < 0.3) { // Control the speed of growth
        let dx = 0; 
        let branch = false;

        if (Math.random() < 0.3) dx = Math.random() < 0.5 ? -1 : 1; 
        
        // Branching requires at least 10 energy remaining
        if (Math.random() < 0.05 && cell.energy > 10) branch = true;

        let nx = x + dx;
        let ny = y - 1; 

        if (ny >= 0 && nx >= 0 && nx < cols) {
            if (branch) {
                let leftOk = (x - 1 >= 0 && nextGrid[x-1][ny].type === window.EMPTY);
                let rightOk = (x + 1 < cols && nextGrid[x+1][ny].type === window.EMPTY);

                // Pass remaining energy minus 1
                if (leftOk) nextGrid[x-1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                if (rightOk) nextGrid[x+1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                
                if (leftOk || rightOk) {
                    cell.isTip = false; 
                    cell.color = window.getStemColor(); 
                }
            } else {
                if (nextGrid[nx][ny].type === window.EMPTY) {
                    // Pass remaining energy minus 1
                    nextGrid[nx][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                    cell.isTip = false; 
                    cell.color = window.getStemColor(); 
                } else if (dx !== 0 && nextGrid[x][ny].type === window.EMPTY) {
                     // Try straight up if blocked diagonally
                     nextGrid[x][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                     cell.isTip = false;
                     cell.color = window.getStemColor();
                } else {
                     // Completely blocked
                     cell.isTip = false;
                     cell.color = window.getStemColor();
                }
            }
        } else {
             // Hit the top of the screen
             cell.isTip = false;
             cell.color = window.getStemColor();
        }
    }
};
