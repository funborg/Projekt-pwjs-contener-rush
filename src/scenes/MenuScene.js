import Phaser from 'phaser'
import startButton from '../sprites/startButton'
import creditsButton from '../sprites/creditsButton'
import soundButton from '../sprites/soundButton'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' }, "game");
    }

    create() {

        //adding background for menu
        this.add.image(800, 600, 'bground').setOrigin(0.5);

        //creating game title
        this.gameTitle = this.add.text(800, 150, 'CONTAINER RUSH', { fontFamily: 'Stencil', fontSize: 128, color: '#046187' }).setOrigin(0.5);
        this.gameTitle.setStroke('#002636', 18);

        //creating start & end point for ship
        var startP = -200;
        var stopP = this.game.scale.width+200;

        //adding a ship
        this.mShip = this.add.sprite(startP, 583, 'mShip').setOrigin(0.5);

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
    
        this.startButton = new startButton(this, 800, 310, 'InstrScene');
        this.creditsButton = new creditsButton(this, 800, 430);
        this.soundButton = new soundButton(this, 1390, 1140);
    }
    update(){
        //turn off sounds if soundButton = OFF
        this.startButton.isSoundOn = this.soundButton.isSoundOn;
        this.creditsButton.isSoundOn = this.soundButton.isSoundOn;

        //create a variable holding sound mode (ON/OFF) that'll be available to use in other scenes
        window.soundMode = this.soundButton.isSoundOn;
    }
}
