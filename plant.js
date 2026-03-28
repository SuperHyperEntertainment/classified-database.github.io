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

    // If it's a stem (not a growing tip), do nothing
    if (!cell.isTip) return;

    // 1. Drink adjacent water
    let drankWater = false;
    let neighbors = [{x:0,y:-1}, {x:0,y:1}, {x:1,y:0}, {x:-1,y:0}];
    for(let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (grid[nx][ny].type === window.WATER) {
                nextGrid[nx][ny] = { type: window.EMPTY }; 
                drankWater = true;
                break; // Only drink one pixel of water per frame so it doesn't drain pools instantly
            }
        }
    }

    // Regain a little energy from water, but strictly cap it at 20
    if (drankWater) {
        cell.energy = Math.min(20, (cell.energy || 0) + 4);
    }

    // 2. THE "SUNLIGHT" CROWDING CHECK
    // Look at a 5x5 area around the tip. 
    let plantCount = 0;
    for(let i = -2; i <= 2; i++) {
        for(let j = -2; j <= 2; j++) {
            let cx = x + i, cy = y + j;
            if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
                if (grid[cx][cy].type === window.PLANT) {
                    plantCount++;
                }
            }
        }
    }

    // If there are more than 5 plant pixels in this area, it's too crowded.
    // The tip suffocates, turns into a dark stem, and stops growing forever.
    if (plantCount > 5) {
        cell.isTip = false;
        cell.color = window.getStemColor();
        return;
    }

    // 3. Natural Die-Off (Prevents infinite growth)
    // Even with water, there is a 2% chance every frame that the branch just ends.
    if (Math.random() < 0.02) {
        cell.isTip = false;
        cell.color = window.getStemColor();
        return;
    }

    // 4. Grow organically 
    if (cell.energy > 0 && Math.random() < 0.3) {
        let dx = 0; 
        let branch = false;

        // Slight chance to lean left or right
        if (Math.random() < 0.3) dx = Math.random() < 0.5 ? -1 : 1; 
        
        // Rare chance to split into two branches 
        if (Math.random() < 0.05 && cell.energy > 10) branch = true;

        let nx = x + dx;
        let ny = y - 1; // Always progress upwards

        if (ny >= 0 && nx >= 0 && nx < cols) {
            if (branch) {
                let leftOk = (x - 1 >= 0 && nextGrid[x-1][ny].type === window.EMPTY);
                let rightOk = (x + 1 < cols && nextGrid[x+1][ny].type === window.EMPTY);

                if (leftOk) nextGrid[x-1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: Math.floor(cell.energy / 2) };
                if (rightOk) nextGrid[x+1][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: Math.floor(cell.energy / 2) };
                
                if (leftOk || rightOk) {
                    cell.isTip = false; 
                    cell.color = window.getStemColor(); 
                }
            } else {
                if (nextGrid[nx][ny].type === window.EMPTY) {
                    nextGrid[nx][ny] = { type: window.PLANT, color: window.getPlantColor(), isTip: true, energy: cell.energy - 1 };
                    cell.isTip = false; 
                    cell.color = window.getStemColor(); 
                } else if (dx !== 0 && nextGrid[x][ny].type === window.EMPTY) {
                     // If blocked diagonally, try going straight up
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
             // Hit the ceiling
             cell.isTip = false;
             cell.color = window.getStemColor();
        }
    } else if (cell.energy <= 0) {
        // Ran out of energy
        cell.isTip = false; 
        cell.color = window.getStemColor();
    }
};
