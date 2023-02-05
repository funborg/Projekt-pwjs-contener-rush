import Phaser from 'phaser'
import MenuScene from './MenuScene';
import Button from '../sprites/Button';


export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' }, "game");
    }

create() {
    //adding background for menu
    this.add.image(this.game.scale.width / 2, this.game.scale.height / 2, 'bground').setOrigin(0.5);

    //creating text (in this form it'll be easier to concatenate)
    var creators = "Game Creators :";
    var creator1 = "Jakub Gołoś";
    var creator2 = "Damian Kozak";
    var concept = "Game Concept:";
    var textures = "Game Textures:"; 
    var code = "Game Code: ";
    var menuBG = "Menu Background :"; 
    var menuBGsrc = "nansimuz.com/site/portfolio/warped-ocean-view";
    var sounds = "Music & Sound Effects :";
    var soundsSrc = "mixkit.co/free-sound-effects\nzapsplat.com";

    //defining initial 'y' position of text 

    //concatenating and displaying previously created text (and modyfying it)
    this.text = this.add.text(this.game.scale.width * 0.5, this.game.scale.height*2, creators+'\n'+creator1+'\n'+creator2+'\n\n'+concept+'\n'+creator1+'\n\n'+textures+'\n'+creator2+'\n\n'+code+'\n'+creator1+'\n'+creator2+'\n\n'+menuBG+'\n'+menuBGsrc+'\n\n'+sounds+'\n'+soundsSrc, { fontFamily: 'Tw Cen MT Condensed Extra Bold', fontSize: 42, color: '#046187' }).setOrigin(0.5);
    this.text.setStroke('#002636', 10);
    this.text.setShadow(1, 2, '#000000');

    //adding menu button
    this.mButton = new Button(this, this.game.scale.width * 0.94, this.game.scale.height * 0.95,'MENU',this.switch);
}

update() {
    //decrement 'y' position of text (move it from the bottom of the screen to the top) 
    this.text.y -= 1;

    //reset the 'y' position of text after it disappear behind the top border of screen and switch scene to 'MenuScene'
    if (this.text.y < -560) {
        this.text.y = this.game.scale.height;
        this.scene.switch('MenuScene');
    }

    //turn off button volume if sounds were muted in menu

}
switch(){
    this.scene.restart('CreditsScene');
    this.scene.switch('MenuScene');

}
}
