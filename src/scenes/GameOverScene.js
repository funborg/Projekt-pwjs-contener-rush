import Phaser from 'phaser'
import Button from '../sprites/Button.js';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' }, "game");
    }
    init(data){
        this.data=data
    }

    create() {
        this.cameras.main.fadeIn(1000)
        //adding background
        this.bg=this.add.image(960, 540, 'bground').setOrigin(0.5);
        this.bg.texture.setFilter(Phaser.ScaleModes.NEAREST)
        //creating rounded, filled rectangle (as a background for text, buttons & statistics) 
        this.mRect = this.add.graphics();
        this.mRect.lineStyle(20, 0x012636);
        this.mRect.strokeRoundedRect(
            this.game.scale.width / 2 - 450,
            this.game.scale.height / 2 - 450,
            900,
            900
        );
        this.mRect.fillStyle(0xABB2B9, 0.7);
        this.mRect.fillRoundedRect(
            this.game.scale.width / 2 - 450,
            this.game.scale.height / 2 - 450,
            900,
            900
        );

        //adding 'GAME OVER' text 
        this.gameOver = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.13, 'GAME OVER', { fontFamily: 'Sitka_text', fontSize: 64, color: '#085b80' }).setOrigin(0.5);
        this.gameOver.setStroke('#012636', 15);

        //adding decorational line
        var line = new Phaser.Geom.Line(this.game.scale.width * 0.265, this.game.scale.height * 0.18, this.game.scale.width * 0.735, this.game.scale.height * 0.18);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(line);

        //adding 'score' text 
        this.score = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.22, 'TIME TOTAL:', { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.score.setStroke('#012636', 10);

        //adding 'score' number (displaying it)
        this.scoreNum = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.27, 
        //minutes
        Math.floor(this.data.time/600).toString().padStart(2,'0')+
        //seconds
        ':'+(Math.floor((this.data.time/10))%60).toString().padStart(2,'0')+
        //miliseconds
        '.'+Math.floor(this.data.time%10), { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.scoreNum.setStroke('#012636', 10);

        //adding text for the ammount of delivered containers 
        this.containerCount = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.36, 'DELIVERED CONTAINERS:', { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.containerCount.setStroke('#012636', 10);

        //adding the ammount of delivered containers number (displaying it)
        this.containerCountNum = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.41, this.data.count, { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.containerCountNum.setStroke('#012636', 10);

        //adding text for average delivery time
        this.avgTime = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.50, 'AVARGEGE DELIVERY TIME:', { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.avgTime.setStroke('#012636', 10);

        //adding average delivery time (displaying it)
        this.avgTimeNum = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.55, 
        //minutes
        Math.floor(this.data.avg/600).toString().padStart(2,'0')+
        //seconds
        ':'+(Math.floor((this.data.avg/10))%60).toString().padStart(2,'0')+
        //miliseconds
        '.'+Math.floor(this.data.avg%10)
        , { fontFamily: 'Sitka_text', fontSize: 48, color: '#085b80' }).setOrigin(0.5);
        this.avgTimeNum.setStroke('#012636', 10);

        //adding 2nd decorational line
        var lineTwo = new Phaser.Geom.Line(this.game.scale.width * 0.265, this.game.scale.height * 0.745, this.game.scale.width * 0.735, this.game.scale.height * 0.745);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //creating menu & restart buttons 
        this.menuB = new Button(this, this.game.scale.width * 0.385, this.game.scale.height * 0.83,"MENU",()=>this.scene.switch('MenuScene'));
        this.restartB = new Button(this, this.game.scale.width * 0.585, this.game.scale.height * 0.83,"RESTART",()=>{
            //fade out into game and remove interactive buttons
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.menuB.removeInteractive()
            this.restartB.removeInteractive()

        });
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.time.delayedCall(500, () => { this.scene.start('GameScene') })})
    
    }


}
