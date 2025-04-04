const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
let img = new Image();

// Elementos de texto com posições ajustáveis
const texts = [
    { content: '', x: 300, y: 40, font: 'Impact' },  // Texto superior
    { content: '', x: 300, y: 560, font: 'Impact' }  // Texto inferior
];

const imageUpload = document.getElementById('imageUpload');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const topFontSelect = document.getElementById('topFont');
const bottomFontSelect = document.getElementById('bottomFont');
const fontSizeInput = document.getElementById('fontSize');
const textColorInput = document.getElementById('textColor');
const downloadBtn = document.getElementById('downloadBtn');
const randomBtn = document.getElementById('randomBtn');

let dragging = null; // Índice do texto sendo arrastado
let offsetX, offsetY; // Offset para arrastar

function updateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const fontSize = fontSizeInput.value;
    const textColor = textColorInput.value;

    texts.forEach((text, index) => {
        ctx.font = `${fontSize}px ${text.font}`;
        ctx.fillStyle = textColor;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = fontSize / 10;
        ctx.textAlign = 'center';

        const content = text.content.toUpperCase();
        ctx.strokeText(content, text.x, text.y);
        ctx.fillText(content, text.x, text.y);

        // Destacar o texto sendo arrastado (feedback visual)
        if (dragging === index) {
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(text.x - ctx.measureText(content).width / 2, text.y - fontSize, ctx.measureText(content).width, fontSize);
        }
    });
}

// Atualiza os textos conforme os inputs
topTextInput.addEventListener('input', () => {
    texts[0].content = topTextInput.value;
    updateCanvas();
});

bottomTextInput.addEventListener('input', () => {
    texts[1].content = bottomTextInput.value;
    updateCanvas();
});

topFontSelect.addEventListener('change', () => {
    texts[0].font = topFontSelect.value;
    updateCanvas();
});

bottomFontSelect.addEventListener('change', () => {
    texts[1].font = bottomFontSelect.value;
    updateCanvas();
});

fontSizeInput.addEventListener('input', updateCanvas);
textColorInput.addEventListener('input', updateCanvas);

// Upload da imagem
imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            canvas.style.animation = 'fadeIn 1s ease-in';
            updateCanvas();
        };
    }
});

// Eventos de arrastar o texto
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    dragging = null; // Resetar para evitar falsos positivos
    texts.forEach((text, index) => {
        const fontSize = fontSizeInput.value;
        const textWidth = ctx.measureText(text.content.toUpperCase()).width;
        const textHeight = fontSize * 1.2; // Aumentei a área clicável verticalmente

        // Verifica se o clique está dentro da área do texto
        if (
            mouseX >= text.x - textWidth / 2 &&
            mouseX <= text.x + textWidth / 2 &&
            mouseY >= text.y - textHeight &&
            mouseY <= text.y
        ) {
            dragging = index;
            offsetX = mouseX - text.x;
            offsetY = mouseY - text.y;
        }
    });
    updateCanvas(); // Atualiza para mostrar o destaque
});

canvas.addEventListener('mousemove', (e) => {
    if (dragging !== null) {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        texts[dragging].x = mouseX - offsetX;
        texts[dragging].y = mouseY - offsetY;
        updateCanvas();
    }
});

canvas.addEventListener('mouseup', () => {
    dragging = null;
    updateCanvas(); // Remove o destaque ao soltar
});

// Download do meme
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'meme.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    console.log("🎉 Meme baixado com sucesso!");
});

// Randomizar texto e cor
randomBtn.addEventListener('click', () => {
    const randomTexts = ["LOL", "NOPE", "WOW", "MEME TIME"];
    topTextInput.value = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    bottomTextInput.value = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    textColorInput.value = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    texts[0].content = topTextInput.value;
    texts[1].content = bottomTextInput.value;
    updateCanvas();
});

// Carrega uma imagem padrão inicial
img.src = 'https://via.placeholder.com/600';
img.onload = updateCanvas;