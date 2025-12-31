const fortunes = [
    {
        level: '大吉',
        message: '明るい出来事が多い一年になりそう。\n気持ちのままに、楽しい時間を過ごしてね'
    },
    {
        level: '中吉',
        message: '良い流れを感じられる一年かも。\n人とのつながりが、うれしい出来事を運んでくれそう'
    },
    {
        level: '小吉',
        message: '日々の中に、ちいさな幸せが見つかりそう。\nいつもの時間を大切にしてみてね'
    },
    {
        level: '吉',
        message: '落ち着いて過ごせる一年になりそう。\n無理せず、自分のペースでいこう'
    },
    {
        level: '末吉',
        message: 'これから少しずつ、良い流れに向かいそう。\n今はゆっくりで大丈夫'
    },
    {
        level: '凶',
        message: '思うようにいかない日もあるかも。\nそんなときは、ひと息ついて気分転換してね'
    }
];

let canvas, ctx, isDrawing = false, isRevealed = false;

function initCanvas() {
    canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;

    ctx = canvas.getContext('2d');

    const container = canvas.parentElement;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF6347');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('削ってね', canvas.width / 2, canvas.height / 2);

    const fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    document.getElementById('fortuneLevel').textContent = fortune.level;
    document.getElementById('fortuneMessage').textContent = fortune.message;
}

function scratch(x, y) {
    if (!ctx) return;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    checkReveal();
}

function checkReveal() {
    if (isRevealed || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] < 128) transparent++;
    }

    const percentRevealed = (transparent / (pixels.length / 4)) * 100;

    if (percentRevealed > 50) {
        isRevealed = true;
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 0.5s';
        document.getElementById('instruction').style.display = 'none';
        document.getElementById('result').classList.add('completed');
    }
}

function getEventPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
    };
}

function setupEventListeners() {
    if (!canvas) return;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getEventPosition(e);
        scratch(pos.x, pos.y);
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getEventPosition(e);
        scratch(pos.x, pos.y);
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getEventPosition(e);
        scratch(pos.x, pos.y);
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getEventPosition(e);
        scratch(pos.x, pos.y);
    });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        isDrawing = false;
    });
}

function resetOmikuji() {
    isRevealed = false;
    isDrawing = false;
    if (canvas) {
        canvas.style.opacity = '1';
        canvas.style.transition = 'none';
    }
    const instruction = document.getElementById('instruction');
    if (instruction) instruction.style.display = 'block';
    const result = document.getElementById('result');
    if (result) result.classList.remove('completed');
    initCanvas();
}

window.addEventListener('load', () => {
    initCanvas();
    setupEventListeners();

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetOmikuji);
    }
});
