// noprotect
const canvas = document.getElementById('sim');
const ctx = canvas.getContext('2d');
const topBar = document.getElementById('top-bar');

const CELL_SIZE = 6;
let cols, rows, grid;
let currentMode = 'water';
let isMouseDown = false;
let mousePos = { x: 0, y: 0 };
let spawnTimer;
let brushSize = 2;

window.toggleUI = () => {
 topBar.classList.toggle('minimized');
 document.getElementById('toggle-btn').innerText = topBar.classList.contains('minimized') ? '▼' : '▲';
};

window.setMode = (mode) => {
 currentMode = mode;
 document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
 const btn = document.getElementById('btn' + mode.charAt(0).toUpperCase() + mode.slice(1));
 if (btn) btn.classList.add('active');
};

window.changeBrushSize = (amt) => {
 brushSize = Math.max(1, Math.min(10, brushSize + amt));
 document.getElementById('sizeDisplay').innerText = `SIZE: ${brushSize}`;
};

window.resetGrid = () => {
 grid = Array.from({ length: cols }, () =>
   Array.from({ length: rows }, () => ({ type: window.EMPTY, color: null }))
 );
};

function init() {
 canvas.width = window.innerWidth;
 canvas.height = window.innerHeight;
 cols = Math.floor(canvas.width / CELL_SIZE);
 rows = Math.floor(canvas.height / CELL_SIZE);
 window.resetGrid();
}

function placePixels() {
 if (!isMouseDown) return;
 const x = Math.floor(mousePos.x / CELL_SIZE);
 const y = Math.floor(mousePos.y / CELL_SIZE);
  for (let i = -brushSize; i <= brushSize; i++) {
   for (let j = -brushSize; j <= brushSize; j++) {
     let nx = x + i, ny = y + j;
     if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
       if (grid[nx][ny].type === window.EMPTY || currentMode === 'eraser') {
           if (currentMode === 'water') {
               const h = 195 + Math.random() * 15;
               grid[nx][ny] = { type: window.WATER, color: `hsl(${h}, 85%, ${45 + Math.random() * 15}%)` };
           } else if (currentMode === 'fire') {
               grid[nx][ny] = { type: window.FIRE, color: window.getFireColor(), life: 100 };
           } else if (currentMode === 'wood') {
               grid[nx][ny] = { type: window.WOOD, color: window.getWoodColor() };
           } else if (currentMode === 'sand') {
               grid[nx][ny] = { type: window.SAND, color: window.getSandColor() };
           } else if (currentMode === 'oil') {
               grid[nx][ny] = { type: window.OIL, color: window.getOilColor() };
           } else if (currentMode === 'coal') {
               grid[nx][ny] = { type: window.COAL, color: window.getCoalColor(false), burning: false, life: 1000 + Math.random() * 500 };
           } else if (currentMode === 'snow') {
               grid[nx][ny] = { type: window.SNOW, color: window.getSnowColor() };
           } else if (currentMode === 'wall') {
               grid[nx][ny] = { type: window.WALL, color: '#444' };
           } else if (currentMode === 'eraser') {
               grid[nx][ny] = { type: window.EMPTY, color: null };
           }
       }
     }
   }
 }
}

window.addEventListener('mousedown', (e) => {
 if (e.clientY <= topBar.offsetHeight) return;
 isMouseDown = true;
 mousePos = { x: e.clientX, y: e.clientY };
 placePixels();
 if (!spawnTimer) spawnTimer = setInterval(placePixels, 30);
});

window.addEventListener('mouseup', () => {
 isMouseDown = false;
 clearInterval(spawnTimer);
 spawnTimer = null;
});

window.addEventListener('mousemove', (e) => {
 mousePos = { x: e.clientX, y: e.clientY };
});

window.addEventListener('resize', init);

// --- GLOBAL PHYSICS ENGINES ---
window.fallSolid = function(x, y, grid, nextGrid, cols, rows) {
    let cell = grid[x][y];
    if (y + 1 < rows && nextGrid[x][y+1].type === window.EMPTY) {
        nextGrid[x][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        return true;
    }
    let d = Math.random() < 0.5 ? 1 : -1;
    if (x+d >= 0 && x+d < cols && y+1 < rows && nextGrid[x+d][y+1].type === window.EMPTY) {
        nextGrid[x+d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        return true;
    } else if (x-d >= 0 && x-d < cols && y+1 < rows && nextGrid[x-d][y+1].type === window.EMPTY) {
        nextGrid[x-d][y+1] = cell; nextGrid[x][y] = {type: window.EMPTY};
        return true;
    }
    return false;
};

window.fallLiquid = function(x, y, grid, nextGrid, cols, rows) {
    if (window.fallSolid(x, y, grid, nextGrid, cols, rows)) return true;
    let d = Math.random() < 0.5 ? 1 : -1;
    if (x+d >= 0 && x+d < cols && nextGrid[x+d][y].type === window.EMPTY) {
        nextGrid[x+d][y] = grid[x][y]; nextGrid[x][y] = {type: window.EMPTY};
        return true;
    } else if (x-d >= 0 && x-d < cols && nextGrid[x-d][y].type === window.EMPTY) {
        nextGrid[x-d][y] = grid[x][y]; nextGrid[x][y] = {type: window.EMPTY};
        return true;
    }
    return false;
};

function update() {
 let nextGrid = grid.map(col => col.map(cell => ({...cell})));
 for (let y = rows - 1; y >= 0; y--) {
   for (let x = 0; x < cols; x++) {
     let cell = grid[x][y];
     
     if (cell.type === window.WATER) window.fallLiquid(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.FIRE) window.updateFire(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.WOOD) window.handleWoodBurning(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.SMOKE || cell.type === window.STEAM) window.updateGas(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.SAND) window.updateSand(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.OIL) window.updateOil(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.COAL) window.updateCoal(x, y, grid, nextGrid, cols, rows);
     else if (cell.type === window.SNOW) window.updateSnow(x, y, grid, nextGrid, cols, rows);
   }
 }
 grid = nextGrid;
}

function draw() {
 ctx.fillStyle = '#0a0a0a';
 ctx.fillRect(0, 0, canvas.width, canvas.height);
 for (let x = 0; x < cols; x++) {
   for (let y = 0; y < rows; y++) {
     let cell = grid[x][y];
     if (cell.type !== window.EMPTY) {
       ctx.fillStyle = cell.color;
       ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
     }
   }
 }
 update();
 requestAnimationFrame(draw);
}

init();
draw();
