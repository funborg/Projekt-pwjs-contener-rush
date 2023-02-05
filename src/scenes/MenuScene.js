import Phaser from 'phaser'
import Button from '../sprites/Button'


export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' }, "game");
    }

    create() {

        //adding background for menu
        this.bg=this.add.image(960, 540, 'bground').setOrigin(0.5);
        this.bg.texture.setFilter(Phaser.ScaleModes.NEAREST)
        //creating game title
        this.gameTitle = this.add.text(960, 120, 'CONTAINER RUSH', { fontFamily: 'Stencil', fontSize: 100, color: '#046187' }).setOrigin(0.5);
        this.gameTitle.setStroke('#002636', 18);
        this.game.isSoundOn=true
        //creating start & end point for ship
        var startP = -200;
        var stopP = this.game.scale.width+200;
        
        //adding a ship
        this.mShip = this.add.sprite(startP, 540, 'mShip').setOrigin(0.5);
        this.mShip.texture.setFilter(Phaser.ScaleModes.NEAREST)
        //creating a ship movement from start point to stop point
        var shipTween = this.tweens.add({
            targets: this.mShip,
            x: stopP,
            ease: 'Linear',
            duration: 8000,
            flipX: true,
            yoyo: true,
            repeat: -1
        });
        //ambiennce
        this.oceanSound = this.sound.add('oceanSound', { loop: true,volume: 0.1 });
        //add buttons
        this.startButton = new Button(this, 960, 260,'START',()=>this.scene.switch('InstrScene'));
        this.creditsButton = new Button(this, 960, 380,"CREDITS",()=>this.scene.switch('CreditsScene'));
        this.soundButton = new Button(this, 210, 1020,'SOUND: ON',this.toggleSound);
        
        this.game.oceanSound.play()
    }

    //toggle suond on and of
    toggleSound() {
        if(this.game.isSoundOn){
            this.soundButton.setText("SOUND: OFF");
            this.game.isSoundOn = false;
            this.game.oceanSound.stop()
        }
        else {
            this.soundButton.setText("SOUND: ON");
            this.game.isSoundOn = true;
            this.game.oceanSound.play()
        }
    }
}
