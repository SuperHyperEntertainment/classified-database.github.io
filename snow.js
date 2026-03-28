window.getSnowColor = () => `hsl(190, ${10 + Math.random() * 20}%, ${90 + Math.random() * 10}%)`;

window.updateSnow = function(x, y, grid, nextGrid, cols, rows) {
    let nearFire = false;
    let neighbors = [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}];
    for (let n of neighbors) {
        let nx = x + n.x, ny = y + n.y;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && grid[nx][ny].type === window.FIRE) {
            nearFire = true;
            break;
        }
    }

    if (nearFire) {
        nextGrid[x][y] = { type: window.WATER, color: `hsl(195, 85%, 50%)` };
        return;
    }

    window.fallSolid(x, y, grid, nextGrid, cols, rows);
};
