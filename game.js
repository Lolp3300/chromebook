const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 }, debug: false }
    },
    scene: { preload, create, update }
};

const game = new Phaser.Game(config);

let player1, player2, cursors, bullets, lastFired1 = 0, lastFired2 = 0;
let enterKey;

function preload() {
    this.load.image('background', '../assets/bg.jpg'); // Vérifie le chemin !
    this.load.image('player', '../assets/player(1).png');
    this.load.image('bullet', '../assets/R.png');
}

function create() {
    this.add.image(window.innerWidth / 2, window.innerHeight / 2, 'background')
        .setDisplaySize(window.innerWidth, window.innerHeight);

    player1 = this.physics.add.sprite(100, window.innerHeight / 2, 'player').setCollideWorldBounds(true);
    player2 = this.physics.add.sprite(window.innerWidth - 100, window.innerHeight / 2, 'player').setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        D: Phaser.Input.Keyboard.KeyCodes.D,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        ENTER: Phaser.Input.Keyboard.KeyCodes.ENTER
    });

    bullets = this.physics.add.group({ classType: Phaser.Physics.Arcade.Image });

    // Tir joueur 1 (clic gauche)
    this.input.on('pointerdown', (pointer) => {
        shoot(pointer, player1, 'player1');
    });

    // Touche Enter pour tirer pour le joueur 2
    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    // Collision balle/joueur
    this.physics.add.collider(bullets, player1, hitPlayer, null, this);
    this.physics.add.collider(bullets, player2, hitPlayer, null, this);
}

function update() {
    // Déplacement Joueur 1
    if (this.keys.A.isDown) player1.setVelocityX(-200);
    else if (this.keys.D.isDown) player1.setVelocityX(200);
    else player1.setVelocityX(0);

    if (this.keys.W.isDown) player1.setVelocityY(-200);
    else if (this.keys.S.isDown) player1.setVelocityY(200);
    else player1.setVelocityY(0);

    // Déplacement Joueur 2
    if (cursors.left.isDown) player2.setVelocityX(-200);
    else if (cursors.right.isDown) player2.setVelocityX(200);
    else player2.setVelocityX(0);

    if (cursors.up.isDown) player2.setVelocityY(-200);
    else if (cursors.down.isDown) player2.setVelocityY(200);
    else player2.setVelocityY(0);

    // Tir du joueur 2 avec "Enter"
    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
        let pointer = { x: player1.x, y: player1.y }; // Tire vers le joueur 1
        shoot(pointer, player2, 'player2');
    }
}

// Fonction de tir
function shoot(pointer, player, playerId) {
    let bullet = bullets.create(player.x, player.y, 'bullet');

    let angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.x, pointer.y);
    let velocity = 500;

    bullet.setVelocity(Math.cos(angle) * velocity, Math.sin(angle) * velocity);
}

// Quand un joueur est touché, recommencer le jeu
function hitPlayer(player, bullet) {
    bullet.destroy();
    player.setTint(0xff0000);
    setTimeout(() => {
        player.clearTint();
        game.scene.restart(); // Redémarre le jeu
    }, 500);
}
