let ultimoInputConFoco = null;

// colores y códigos tal como en la versión que querías
const colors = [
    { code: '0', color: '#000000' },
    { code: '1', color: '#FF0000' },
    { code: '2', color: '#00FF00' },
    { code: '3', color: '#0000FF' },
    { code: '4', color: '#FFFFFF' },
    { code: '5', color: '#FFFF00' },
    { code: '6', color: '#FF00FF' },
    { code: '7', color: '#00FFFF' },
    { code: '8', color: '#FF0080' },
    { code: '9', color: '#FF8040' },
    { code: 'A', color: '#804000' },
    { code: 'B', color: '#008080' },
    { code: 'C', color: '#800000' },
    { code: 'D', color: '#800080' },
    { code: 'E', color: '#8080FF' },
    { code: 'F', color: '#808080' }
];

const searchColor = (code) => {
    const found = colors.find(c => c.code.toUpperCase() === code.toUpperCase());
    return found ? found.color : null;
}

// Construir paleta: solo muestra el dígito 0–F dentro del recuadro coloreado
const paletteDiv = document.getElementById('palette');

colors.forEach(c => {
    const item = document.createElement('button');
    item.className = 'color-item';
    item.style.background = c.color;
    item.textContent = c.code; // SOLO el dígito 0..F
    item.addEventListener('click', () => {
        if (ultimoInputConFoco) {
            ultimoInputConFoco.style.background = `${searchColor(c.code)}`;
            ultimoInputConFoco.value = c.code;
            moveNext(ultimoInputConFoco);
        }
    });
    paletteDiv.appendChild(item);
});

function generateGrid() {
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);

    const grid = document.getElementById('grid');

    grid.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < cols; c++) {
            const td = document.createElement('td');
            const input = document.createElement('input');

            input.maxLength = 1;

            input.addEventListener('focus', () => {
                ultimoInputConFoco = input;
                input.select();
            });

            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();

                if (!/[0-9A-F]/.test(e.target.value)) {
                    e.target.value = '';
                    return;
                }

                input.style.background = `${searchColor(e.target.value)}`;

                moveNext(e.target);
            });
            td.appendChild(input);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }
}
function moveNext(input) {
    const inputs = [...document.querySelectorAll('#grid input')];
    const idx = inputs.indexOf(input);
    if (idx < inputs.length - 1) inputs[idx + 1].focus();
}
generateGrid();

function showImage() {
    const inputs = [...document.querySelectorAll('#grid input')];
    const rows = parseInt(document.getElementById('rows').value);
    const cols = parseInt(document.getElementById('cols').value);
    const matrix = [];
    for (let r = 0; r < rows; r++) {
        matrix[r] = [];
        for (let c = 0; c < cols; c++) {
            matrix[r][c] = inputs[r * cols + c].value.toUpperCase() || '0';
        }
    }
    drawCanvas(matrix);
    document.getElementById('modal').style.display = 'flex';
}

function drawCanvas(matrix) {
    const canvas = document.getElementById('canvas');
    const size = 40; // tamaño de pixel en canvas
    canvas.width = matrix[0].length * size;
    canvas.height = matrix.length * size;
    const ctx = canvas.getContext('2d');
    for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[0].length; c++) {
            const color = colors.find(col => col.code === matrix[r][c])?.color || '#000';
            ctx.fillStyle = color;
            ctx.fillRect(c * size, r * size, size, size);
        }
    }
}

function saveImage() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'imagen_pixeles.jpg';
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}

// Cerrar modal al hacer click fuera del canvas
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') document.getElementById('modal').style.display = 'none';
});