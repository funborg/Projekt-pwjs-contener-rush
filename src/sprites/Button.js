import Phaser from 'phaser'

export default class Button extends Phaser.GameObjects.Text {
    constructor(scene, x, y, name, onpointer) {
        //setting position and text of start button
        super(scene, x, y, name, { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' });
        this.scene=scene
        this.setOrigin(0.5);
        this.setStroke('#012636', 10);
        this.setInteractive();
        this.onpointer=onpointer
        //creating border and background of start button
        this.sRect = scene.add.graphics();
        this.sRect.lineStyle(15, 0x002a3d);
        this.sRect.strokeRect(x-this.width*1.1/2, y-this.height/2, this.width*1.1, this.height);
        this.sRect.fillStyle(0x076d8f, 0.9);
        this.sRect.fillRect(x-this.width*1.1/2, y-this.height/2, this.width*1.1, this.height);

        //change text color if mouse coursor is on button
        this.on('pointerover', function () {
            this.setColor('#ba6102');
            this.setStroke('#914103', 10);
        });
        //change text color to the previous one if mouse coursor is not on the button
        this.on('pointerout', function () {
            this.setColor('#085b80');
            this.setStroke('#012636', 10);
        });
        //execute given function on click
        this.on('pointerup', onpointer, this.scene);
        //play sound if not muted
        this.on('pointerup', ()=>{
            if(this.scene.game.isSoundOn)
            this.scene.sound.play('buttonClicked');
        }, this);
        //adding object to the scene
        scene.add.existing(this);
    }

    

}
