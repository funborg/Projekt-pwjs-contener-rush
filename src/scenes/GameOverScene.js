import Phaser from 'phaser'
import menuButton from '../sprites/menuButton'
import restartButton from '../sprites/restartButton'
import MenuScene from './MenuScene'
import GameScene from './GameScene'

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }, "game");
    }

    create() {

        //adding background
        this.add.image(960, 540, 'bground').setOrigin(0.5);

        //creating rounded, filled rectangle (as a background for text, buttons & statistics) 
        this.mRect = this.add.graphics();
        this.mRect.lineStyle(20, 0x012636);
        this.mRect.strokeRoundedRect(innerWidth / 4, innerHeight / 4 - 150, 900, 900);
        this.mRect.fillStyle(0xABB2B9, 0.7);
        this.mRect.fillRoundedRect(innerWidth / 4, innerHeight / 4 - 150, 900, 900);

        //adding 'GAME OVER' text 
        this.gameOver = this.add.text(innerHeight, innerWidth / 4 - 330, 'GAME OVER', { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' }).setOrigin(0.5);
        this.gameOver.setStroke('#133b54', 15);
        this.gameOver.setShadow(1, 2, '#000000');

        //adding decorational line
        var line = new Phaser.Geom.Line(innerHeight - 460, innerWidth / 4 - 270, innerHeight + 450, innerWidth / 4 - 270);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(line);

        //adding 'score' text 
        this.score = this.add.text(innerHeight, innerWidth / 4 - 220, 'Your Score', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.score.setStroke('#133b54', 10);
        this.score.setShadow(1, 2, '#000000');

        //adding 'score' number (displaying it)
        this.scoreNum = this.add.text(innerHeight, innerWidth / 4 - 180, window.playerScore, { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.scoreNum.setStroke('#133b54', 10);
        this.scoreNum.setShadow(1, 2, '#000000');

        //adding text for the ammount of delivered containers 
        this.containerCount = this.add.text(innerHeight, innerWidth / 4 - 80, 'Delivered Containers', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCount.setStroke('#133b54', 10);
        this.containerCount.setShadow(1, 2, '#000000');

        //adding the ammount of delivered containers number (displaying it)
        this.containerCountNum = this.add.text(innerHeight, innerWidth / 4 - 30, window.deliveredContainers, { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCountNum.setStroke('#133b54', 10);
        this.containerCountNum.setShadow(1, 2, '#000000');

        //adding text for average delivery time
        this.avgTime = this.add.text(innerHeight, innerWidth / 4 + 70, 'Average Delivery Time', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTime.setStroke('#133b54', 10);
        this.avgTime.setShadow(1, 2, '#000000');

        //adding average delivery time (displaying it)
        this.avgTimeNum = this.add.text(innerHeight, innerWidth / 4 + 120, window.avgDeliveryTime + '  sec', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTimeNum.setStroke('#133b54', 10);
        this.avgTimeNum.setShadow(1, 2, '#000000');

        //adding 2nd decorational line
        var lineTwo = new Phaser.Geom.Line(innerWidth / 2 - 490, innerHeight / 2 + 320, innerWidth / 2 + 420, innerHeight / 2 + 320);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //creating menu & restart buttons 
        this.menuB = new menuButton(this, innerWidth / 2 - 250, innerHeight / 2 + 420);
        this.restartB = new restartButton(this, innerWidth / 2 + 180, innerHeight / 2 + 420);
    }
    update() {
        //turn off button volume if sounds were muted in menu
        if (!window.soundMode) {
            this.menuB.isSoundOn = false;
            this.restartB.isSoundOn = false;
        }
    }
}
