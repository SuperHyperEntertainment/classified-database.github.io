window.EMPTY = 0; window.WATER = 1; window.WALL = 2;
window.FIRE = 3; window.SMOKE = 4; window.STEAM = 5;
window.WOOD = 6;


window.getFireColor = () => `hsl(${10 + Math.random() * 20}, 100%, ${50 + Math.random() * 20}%)`;
window.getSmokeColor = () => `rgba(70, 70, 70, ${0.15 + Math.random() * 0.15})`;
window.getSteamColor = () => `rgba(80, 120, 200, ${0.25 + Math.random() * 0.2})`; // Darker Bluish


window.updateFire = function(x, y, grid, nextGrid, cols, rows) {
   if (Math.random() < 0.03) {
       nextGrid[x][y] = { type: window.SMOKE, color: window.getSmokeColor() };
       return;
   }


   let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
   for(let n of neighbors) {
       let nx = x + n.x, ny = y + n.y;
       if(nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
           let target = grid[nx][ny];
           if(target.type === window.WATER) {
               nextGrid[nx][ny] = { type: window.STEAM, color: window.getSteamColor() };
               nextGrid[x][y] = { type: window.SMOKE, color: window.getSmokeColor() };
               return;
           }
           if(target.type === window.WOOD && Math.random() < 0.1) {
               nextGrid[nx][ny] = { type: window.FIRE, color: window.getFireColor(), life: 150 + Math.random() * 100 };
           }
       }
   }


   let cell = nextGrid[x][y];
   if (cell.life !== undefined) cell.life--;
   if (cell.life <= 0 || Math.random() < 0.02) {
       nextGrid[x][y] = { type: window.SMOKE, color: window.getSmokeColor() };
   } else if (Math.random() < 0.15) {
       let moveX = x + (Math.floor(Math.random() * 3) - 1);
       let moveY = y - 1;
       if (moveY >= 0 && moveX >= 0 && moveX < cols && nextGrid[moveX][moveY].type === window.EMPTY) {
           nextGrid[moveX][moveY] = { ...cell, color: window.getFireColor() };
           nextGrid[x][y] = { type: window.EMPTY };
       }
   }
};


window.updateGas = function(x, y, grid, nextGrid, cols, rows) {
   if(y > 0) {
       let moveX = x + (Math.floor(Math.random() * 3) - 1);
       if(moveX >= 0 && moveX < cols && nextGrid[moveX][y-1].type === window.EMPTY) {
           nextGrid[moveX][y-1] = grid[x][y];
           nextGrid[x][y] = { type: window.EMPTY };
       }
   }
   if(Math.random() < 0.012) nextGrid[x][y] = { type: window.EMPTY };
};
