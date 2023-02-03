import Phaser from 'phaser'

export default class SoundButton extends Phaser.GameObjects.Text {
    constructor(scene, x, y) {
        //setting position and text of start button
        super(scene, x, y, 'SOUND: ON', { fontFamily: 'Stencil', fontSize: 64, color: '#085b80' });
        
        this.setOrigin(0.5);
        this.setStroke('#012636', 10);
        this.setInteractive();
        this.isSoundOn = true;

        //creating border and background of start button
        this.sRect = scene.add.graphics();
        this.sRect.lineStyle(15, 0x002a3d);
        this.sRect.strokeRect(x-190, y-40, 380, 80, 100);
        this.sRect.fillStyle(0x076d8f, 0.9);
        this.sRect.fillRect(x-190, y-40, 380, 80);

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
        this.on('pointerup', this.toggleSound, this);

        //adding object to the scene
        scene.add.existing(this);
    }

    //turning sound ON only if sound button is set to "ON"
    toggleSound() {
        if(this.isSoundOn){
            this.setText("SOUND: OFF");
            this.isSoundOn = false;
        }
        else {
            this.scene.sound.play('buttonClicked');
            this.setText("SOUND: ON");
            this.isSoundOn = true;
        }
    }
}