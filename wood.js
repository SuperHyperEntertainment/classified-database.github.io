window.getWoodColor = () => {
 const shades = ['#5d4037', '#4e342e', '#3e2723', '#6d4c41'];
 return shades[Math.floor(Math.random() * shades.length)];
};

window.handleWoodBurning = function(x, y, grid, nextGrid, cols, rows) {
 const neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
 for (let n of neighbors) {
   let nx = x + n.x, ny = y + n.y;
   if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
     if (grid[nx][ny].type === window.FIRE && Math.random() < 0.01) {
       nextGrid[x][y] = {
         type: window.FIRE,
         color: window.getFireColor(),
         life: 200 + Math.random() * 100
       };
     }
   }
 }
};
