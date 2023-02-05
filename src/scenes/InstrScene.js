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
        this.add.image(this.game.scale.width / 2, this.game.scale.height / 2, 'bground').setOrigin(0.5);

        //creating rounded, filled rectangle (as a background for text & buttons) 
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

        //adding 'HOW TO PLAY' text 
        this.gameOver = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.13, 'HOW TO PLAY', { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' }).setOrigin(0.5);
        this.gameOver.setStroke('#133b54', 15);
        this.gameOver.setShadow(1, 2, '#000000');

        //adding decorational line
        var lineOne = new Phaser.Geom.Line(this.game.scale.width * 0.265, this.game.scale.height * 0.18, this.game.scale.width * 0.735, this.game.scale.height * 0.18);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineOne);

        //adding 'MOVEMENT' text
        this.movement = this.add.text(this.game.scale.width * 0.4, this.game.scale.height * 0.23, 'MOVEMENT', { fontFamily: 'Stencil', fontSize: 46, color: '#085b80' }).setOrigin(0.5);
        this.movement.setStroke('#133b54', 10);
        this.movement.setShadow(1, 2, '#000000');

        //adding movement buttons text 

        //w
        this.wButton = this.add.text(this.game.scale.width * 0.4, this.game.scale.height * 0.30, 'MOVE FORWARD : W', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.wButton.setStroke('#133b54', 8);
        this.wButton.setShadow(1, 2, '#000000');

        //s
        this.sButton = this.add.text(this.game.scale.width * 0.4, this.game.scale.height * 0.37, 'MOVE BACKWARD : S', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.sButton.setStroke('#133b54', 8);
        this.sButton.setShadow(1, 2, '#000000');

        //a
        this.aButton = this.add.text(this.game.scale.width * 0.4, this.game.scale.height * 0.44, 'TURN LEFT : A', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.aButton.setStroke('#133b54', 8);
        this.aButton.setShadow(1, 2, '#000000');

        //d
        this.dButton = this.add.text(this.game.scale.width * 0.4, this.game.scale.height * 0.51, 'TURN RIGHT : D', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.dButton.setStroke('#133b54', 8);
        this.dButton.setShadow(1, 2, '#000000');

        //adding other buttons text

        //adding 'OTHER' text
        this.other = this.add.text(this.game.scale.width * 0.625, this.game.scale.height * 0.23, 'OTHER', { fontFamily: 'Stencil', fontSize: 46, color: '#085b80' }).setOrigin(0.5);
        this.other.setStroke('#133b54', 10);
        this.other.setShadow(1, 2, '#000000');

        //space
        this.spaceButton = this.add.text(this.game.scale.width * 0.625, this.game.scale.height * 0.30, 'BREAK : SPACE', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.spaceButton.setStroke('#133b54', 8);
        this.spaceButton.setShadow(1, 2, '#000000');

        //e
        this.eButton = this.add.text(this.game.scale.width * 0.625, this.game.scale.height * 0.37, 'INTERACT : E', { fontFamily: 'Stencil', fontSize: 24, color: '#085b80' }).setOrigin(0.5);
        this.eButton.setStroke('#133b54', 8);
        this.eButton.setShadow(1, 2, '#000000');

        //function that changes text color to give the player the possibility to check if he's pressing correct key
        this.changeColor = function (condition, textVariable) {
            if (condition) {
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
        var lineTwo = new Phaser.Geom.Line(this.game.scale.width * 0.265, this.game.scale.height * 0.555, this.game.scale.width * 0.735, this.game.scale.height * 0.555);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineTwo);

        //adding short instruction (in 4 different lines, because of better look) what the game is about
        this.instruction1 = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.59, 'Take the ship to the port', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction1.setStroke('#133b54', 8);
        this.instruction1.setShadow(1, 2, '#000000');

        this.instruction2 = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.63, 'Load the container', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction2.setStroke('#133b54', 8);
        this.instruction2.setShadow(1, 2, '#000000');

        this.instruction3 = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.67, 'Transport it to the indicated place', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction3.setStroke('#133b54', 8);
        this.instruction3.setShadow(1, 2, '#000000');

        this.instruction4 = this.add.text(this.game.scale.width * 0.5, this.game.scale.height * 0.71, 'Earn points and gain more game time!', { fontFamily: 'Stencil', fontSize: 28, color: '#085b80' }).setOrigin(0.5);
        this.instruction4.setStroke('#133b54', 8);
        this.instruction4.setShadow(1, 2, '#000000');

        //adding 3rd decorational line
        var lineThree = new Phaser.Geom.Line(this.game.scale.width * 0.265, this.game.scale.height * 0.745, this.game.scale.width * 0.735, this.game.scale.height * 0.745);
        var graphics = this.add.graphics({ lineStyle: { width: 10, color: 0x012636 } });
        graphics.strokeLineShape(lineThree);

        //creating menu & restart buttons 
        this.menuB = new Button(this, this.game.scale.width * 0.395, this.game.scale.height * 0.83, "MENU", () => {
            this.scene.restart('CreditsScene');
            this.scene.switch('MenuScene');
        });
        this.startB = new Button(this, this.game.scale.width * 0.60, this.game.scale.height * 0.83, "START", () => {
            //fade out into game and remove interactive buttons
            this.menuB.removeInteractive()
            this.cameras.main.fadeOut(1000, 0, 0, 0)
            this.startB.removeInteractive()

        });
        //change scenes when faded
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.time.delayedCall(500, () => { this.scene.start('GameScene',) })
        })
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
