// Confetti Effect
class ConfettiEffect {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.confetti = [];
        this.colors = ['#9d4edd', '#c77dff', '#e0aaff', '#ff6b6b', '#ffd60a', '#06ffa5'];
    }

    create() {
        // Create canvas
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create confetti pieces
        for (let i = 0; i < 150; i++) {
            this.confetti.push(this.createPiece());
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createPiece() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height - this.canvas.height,
            w: Math.random() * 10 + 5,
            h: Math.random() * 10 + 5,
            d: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngleIncrement: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.confetti.forEach((piece, i) => {
            piece.tiltAngle += piece.tiltAngleIncrement;
            piece.y += (Math.cos(piece.d) + 3 + piece.d / 2);
            piece.tilt = Math.sin(piece.tiltAngle) * 15;

            if (piece.y > this.canvas.height) {
                this.confetti[i] = this.createPiece();
                piece.y = -10;
            }

            this.ctx.save();
            this.ctx.fillStyle = piece.color;
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.tilt * Math.PI / 180);
            this.ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
            this.ctx.restore();
        });

        if (this.confetti.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }

    stop() {
        setTimeout(() => {
            this.confetti = [];
            if (this.canvas) {
                this.canvas.remove();
            }
        }, 5000);
    }
}

// Create global instance
window.createConfetti = () => {
    const confetti = new ConfettiEffect();
    confetti.create();
    confetti.stop();
};
