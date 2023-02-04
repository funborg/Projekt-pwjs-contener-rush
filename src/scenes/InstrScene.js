import Phaser from 'phaser'
import Button from '../sprites/Button'
import MenuScene from './MenuScene'

export default class InstrScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstrScene' }, "game");
    }
    init() {
        //keyboard inputs
        this.keys = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D',
            foward: 'W',
            backward: 'S',
            break: 'SPACE',
            interact: 'E'
        })
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
        this.gameOver = this.add.text(innerWidth / 2 - 155, innerHeight / 2 - 270, 'HOW TO PLAY', { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' }).setOrigin(0.5);
        this.gameOver.setStroke('#133b54', 15);
        this.gameOver.setShadow(1, 2, '#000000');

        //adding decorational line
        var lineOne = new Phaser.Geom.Line(innerWidth / 2 - 620, innerHeight / 2 - 220, innerWidth / 2 + 300, innerHeight / 2 - 220);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineOne);

        //adding 'MOVEMENT' text
        this.movement = this.add.text(innerWidth / 2 - 400, innerHeight / 2 - 170, 'MOVEMENT', { fontFamily: 'Stencil', fontSize: 46, color: '#085b80' }).setOrigin(0.5);
        this.movement.setStroke('#133b54', 10);
        this.movement.setShadow(1, 2, '#000000');

        //adding movement buttons text 

        //w
        this.wButton = this.add.text(innerWidth / 2 - 400, innerHeight / 2 - 80, 'MOVE FORWARD : W', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.wButton.setStroke('#133b54', 8);
        this.wButton.setShadow(1, 2, '#000000');

        //s
        this.sButton = this.add.text(innerWidth / 2 - 400, innerHeight / 2, 'MOVE BACKWARD : S', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.sButton.setStroke('#133b54', 8);
        this.sButton.setShadow(1, 2, '#000000');

        //a
        this.aButton = this.add.text(innerWidth / 2 - 400, innerHeight / 2 + 80, 'TURN LEFT : A', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.aButton.setStroke('#133b54', 8);
        this.aButton.setShadow(1, 2, '#000000');

        //d
        this.dButton = this.add.text(innerWidth / 2 - 400, innerHeight / 2 + 160, 'TURN RIGHT : D', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.dButton.setStroke('#133b54', 8);
        this.dButton.setShadow(1, 2, '#000000');

        //adding other buttons text

        //adding 'OTHER' text
        this.other = this.add.text(innerWidth / 2 + 120, innerHeight / 2 - 170, 'OTHER', { fontFamily: 'Stencil', fontSize: 46, color: '#085b80' }).setOrigin(0.5);
        this.other.setStroke('#133b54', 10);
        this.other.setShadow(1, 2, '#000000');

        //space
        this.spaceButton = this.add.text(innerWidth / 2 + 120, innerHeight / 2 - 80, 'BREAK : SPACE', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.spaceButton.setStroke('#133b54', 8);
        this.spaceButton.setShadow(1, 2, '#000000');

        //e
        this.eButton = this.add.text(innerWidth / 2 + 120, innerHeight / 2, 'INTERACT : E', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.eButton.setStroke('#133b54', 8);
        this.eButton.setShadow(1, 2, '#000000');

        //function that changes text color to give the player the possibility to check if he's pressing correct key
        this.changeColor = function(condition, textVariable){
            if(condition){
                textVariable.setColor('#ba6102');
                textVariable.setStroke('#914103', 8);
                textVariable.setShadow(1, 2, '#000000');
            } else {
                textVariable.setColor('#085b80');
                textVariable.setStroke('#133b54', 8);
                textVariable.setShadow(1, 2, '#000000');
            }
        }

        //adding 2nd decorational line
        var lineTwo = new Phaser.Geom.Line(innerWidth / 2 - 620, innerHeight / 2 + 210, innerWidth / 2 + 300, innerHeight / 2 + 210);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //adding short instruction (in 4 different lines, because of better look) what the game is about
        this.instruction1 = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 242, 'Take the ship to the port', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction1.setStroke('#133b54', 8);
        this.instruction1.setShadow(1, 2, '#000000');

        this.instruction2 = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 287, 'Load the container', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction2.setStroke('#133b54', 8);
        this.instruction2.setShadow(1, 2, '#000000');

        this.instruction3 = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 332, 'Transport it to the indicated place', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction3.setStroke('#133b54', 8);
        this.instruction3.setShadow(1, 2, '#000000');

        this.instruction4 = this.add.text(innerWidth / 2 - 155, innerHeight / 2 + 377, 'Earn points and gain more game time!', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction4.setStroke('#133b54', 8);
        this.instruction4.setShadow(1, 2, '#000000');

        //adding 3rd decorational line
        var lineThree = new Phaser.Geom.Line(innerWidth / 2 - 620, innerHeight / 2 + 410, innerWidth / 2 + 300, innerHeight / 2 + 410);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineThree);

        //creating menu & restart buttons 
        this.menuB = new Button(this, innerWidth / 2 - 400, innerHeight / 2 + 490,"MENU",()=>{
            this.scene.restart('CreditsScene');
            this.scene.switch('MenuScene');
        });
        this.startB = new Button(this, innerWidth / 2 + 65, innerHeight / 2 + 490,"START",()=>this.cameras.main.fadeOut(2000, 0, 0, 0));
        //change scenes when faded
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.time.delayedCall(1000, () => {this.scene.start('GameScene',)})})
    }
    update() {
        //changing texts colors when buttons are pressed
        this.changeColor(this.keys.foward.isDown, this.wButton);
        this.changeColor(this.keys.backward.isDown, this.sButton);
        this.changeColor(this.keys.left.isDown, this.aButton);
        this.changeColor(this.keys.right.isDown, this.dButton);
        this.changeColor(this.keys.break.isDown, this.spaceButton);
        this.changeColor(this.keys.interact.isDown, this.eButton);
    }

}
