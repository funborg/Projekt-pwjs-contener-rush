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
        this.add.image(800, 600, 'bground');

        //creating rounded, filled rectangle (as a background for text, buttons & statistics) 
        this.mRect = this.add.graphics();
        this.mRect.lineStyle(20, 0x012636);
        this.mRect.strokeRoundedRect(innerWidth / 4 - 130, innerHeight / 4 - 90, 900, 900);
        this.mRect.fillStyle(0xABB2B9, 0.7);
        this.mRect.fillRoundedRect(innerWidth / 4 - 130, innerHeight / 4 - 90, 900, 900);

        //adding 'GAME OVER' text 
        this.gameOver = this.add.text(innerWidth / 2 - 155, innerHeight / 2 - 270, 'GAME OVER', { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' }).setOrigin(0.5);
        this.gameOver.setStroke('#133b54', 15);
        this.gameOver.setShadow(1, 2, '#000000');

        //adding decorational line
        var line = new Phaser.Geom.Line(innerWidth / 2 - 620, innerHeight / 2 - 220, innerWidth / 2 + 300, innerHeight / 2 - 220);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(line);

        //adding 'score' text 
        this.score = this.add.text(innerWidth / 2 - 155, innerHeight / 2 - 170, 'Your Score', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.score.setStroke('#133b54', 10);
        this.score.setShadow(1, 2, '#000000');

        //adding 'score' number (displaying it)
        this.scoreNum = this.add.text(innerWidth / 2 - 155, innerHeight / 2 - 90, window.playerScore, { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.scoreNum.setStroke('#133b54', 10);
        this.scoreNum.setShadow(1, 2, '#000000');

        //adding text for the ammount of delivered containers 
        this.containerCount = this.add.text(innerWidth / 2 - 155, innerHeight / 2, 'Delivered Containers', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCount.setStroke('#133b54', 10);
        this.containerCount.setShadow(1, 2, '#000000');

        //adding the ammount of delivered containers number (displaying it)
        this.containerCountNum = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 70, window.deliveredContainers, { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCountNum.setStroke('#133b54', 10);
        this.containerCountNum.setShadow(1, 2, '#000000');

        //adding text for average delivery time
        this.avgTime = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 160, 'Average Delivery Time', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTime.setStroke('#133b54', 10);
        this.avgTime.setShadow(1, 2, '#000000');

        //adding average delivery time (displaying it)
        this.avgTimeNum = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 230, window.avgDeliveryTime + '  sec', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTimeNum.setStroke('#133b54', 10);
        this.avgTimeNum.setShadow(1, 2, '#000000');

        //adding 2nd decorational line
        var lineTwo = new Phaser.Geom.Line(innerWidth / 2 - 620, innerHeight / 2 + 410, innerWidth / 2 + 300, innerHeight / 2 + 410);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //creating menu & restart buttons 
        this.menuB = new menuButton(this, innerWidth / 2 - 400, innerHeight / 2 + 490);
        this.restartB = new restartButton(this, innerWidth / 2 + 65, innerHeight / 2 + 490);
    }
    update() {
        //turn off button volume if sounds were muted in menu
        if (!window.soundMode) {
            this.menuB.isSoundOn = false;
            this.restartB.isSoundOn = false;
        }
    }
}
