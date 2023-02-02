import Phaser from 'phaser'
import soundButton from '../sprites/soundButton'
import menuButton from '../sprites/menuButton'
import MenuScene from './MenuScene';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CreditsScene' }, "game");
    }

create() {
    //adding background for menu
    this.add.image(800, 600, 'bground').setOrigin(0.5);

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
    this.yPos = 1750;

    //concatenating and displaying previously created text (and modyfying it)
    this.text = this.add.text(innerWidth/2+50, this.yPos, creators+'\n'+creator1+'\n'+creator2+'\n\n'+concept+'\n'+creator1+'\n\n'+textures+'\n'+creator2+'\n\n'+code+'\n'+creator1+'\n'+creator2+'\n\n'+menuBG+'\n'+menuBGsrc+'\n\n'+sounds+'\n'+soundsSrc, { fontFamily: 'Tw Cen MT Condensed Extra Bold', fontSize: 42, color: '#046187' }).setOrigin(0.5);
    this.text.setStroke('#002636', 10);
    this.text.setShadow(1, 2, '#000000');

    this.mButton = new menuButton(this, 160, 1145);
}

update() {
    //decrement 'y' position of text (move it from the bottom of the screen to the top) 
    this.text.y -= 1;

    //reset the 'y' position of text after it disappear behind the top border of screen and switch scene to 'MenuScene'
    if (this.text.y < -560) {
        this.text.y = this.yPos;
        this.scene.switch('MenuScene');
    }

    //turn off button volume if sounds were muted in menu
    if(!window.soundMode){
        this.mButton.isSoundOn = false;
    }
}
}
