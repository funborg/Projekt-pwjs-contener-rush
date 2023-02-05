import Phaser from 'phaser'
import MenuScene from './MenuScene'
import GameScene from './GameScene'
import Button from '../sprites/Button';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }, "game");
    }
    init(data){
        console.log(data)
        this.data=data
    }

    create() {
        this.cameras.main.fadeIn(1000)
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
        this.score = this.add.text(innerHeight, innerWidth / 4 - 220, 'TIME TOTAL:', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.score.setStroke('#133b54', 10);
        this.score.setShadow(1, 2, '#000000');

        //adding 'score' number (displaying it)
        this.scoreNum = this.add.text(innerHeight, innerWidth / 4 - 180, 
        //minutes
        Math.floor(this.data.time/600).toString().padStart(2,'0')+
        //seconds
        ':'+(Math.floor((this.data.time/10))%60).toString().padStart(2,'0')+
        //miliseconds
        '.'+Math.floor(this.data.time%10), { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.scoreNum.setStroke('#133b54', 10);
        this.scoreNum.setShadow(1, 2, '#000000');

        //adding text for the ammount of delivered containers 
        this.containerCount = this.add.text(innerHeight, innerWidth / 4 - 80, 'DELIVERED CONTAINERS:', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCount.setStroke('#133b54', 10);
        this.containerCount.setShadow(1, 2, '#000000');

        //adding the ammount of delivered containers number (displaying it)
        this.containerCountNum = this.add.text(innerHeight, innerWidth / 4 - 30, this.data.count, { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.containerCountNum.setStroke('#133b54', 10);
        this.containerCountNum.setShadow(1, 2, '#000000');

        //adding text for average delivery time
        this.avgTime = this.add.text(innerHeight, innerWidth / 4 + 70, 'AVARGEGE DELIVERY TIME:', { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTime.setStroke('#133b54', 10);
        this.avgTime.setShadow(1, 2, '#000000');

        //adding average delivery time (displaying it)
        this.avgTimeNum = this.add.text(innerHeight, innerWidth / 4 + 120, 
        //minutes
        Math.floor(this.data.avg/600).toString().padStart(2,'0')+
        //seconds
        ':'+(Math.floor((this.data.avg/10))%60).toString().padStart(2,'0')+
        //miliseconds
        '.'+Math.floor(this.data.avg%10)
        , { fontFamily: 'Stencil', fontSize: 32, color: '#085b80' }).setOrigin(0.5);
        this.avgTimeNum.setStroke('#133b54', 10);
        this.avgTimeNum.setShadow(1, 2, '#000000');

        //adding 2nd decorational line
        var lineTwo = new Phaser.Geom.Line(innerWidth / 2 - 490, innerHeight / 2 + 320, innerWidth / 2 + 420, innerHeight / 2 + 320);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //creating menu & restart buttons 
        this.menuB = new Button(this, innerWidth / 2 - 250, innerHeight / 2 + 420,"MENU",()=>this.scene.switch('MenuScene'));
        this.restartB = new Button(this, innerWidth / 2 + 180, innerHeight / 2 + 420,"RESTART",()=>{
            //fade out into game and remove interactive buttons
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.menuB.removeInteractive()
            this.restartB.removeInteractive()

        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.time.delayedCall(500, () => { this.scene.restart('GameScene') })})
    
    }


}
