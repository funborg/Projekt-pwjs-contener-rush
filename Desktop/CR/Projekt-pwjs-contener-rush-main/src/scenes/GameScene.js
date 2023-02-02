import Phaser from 'phaser'
import Player_ship from '../sprites/player_ship';
import AssetsKeys from '../helpers/AssetsKeys';
import rock from '../sprites/rock';
import port from '../sprites/ports';
import events from '../helpers/Events';
import MenuScene from './MenuScene';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' }, "game");
    }
    preload() {
        this.load.atlas
            (
                AssetsKeys.TEXTURES,
                '/images/spritesheet.png',
                '/images/spritesheet.json'
            );
    }
    init() {

        //keyboard inputs
        this.keys = this.input.keyboard.addKeys
            ({
                left: 'A',
                right: 'D',
                foward: 'W',
                backward: 'S',
                break: 'SPACE',
                interact: 'E'
            })
        //boundry data
        this.boundry =
        {
            Width: this.game.scale.gameSize.width * 2,
            Height: this.game.scale.gameSize.height * 2
        }
        //array of basic colors
        this.colorsarr =
        {
            red: 0xFF0000,
            blue: 0x0000FF,
            green: 0x00FF00,
            yellow: 0xFFFF00,
            purple: 0xFF00FF,
            aqua: 0x00FFFF,
            white: 0xFFFFFF
        }
    }
    create() {

        //background color
        this.cameras.main.setBackgroundColor("#0084a5");
        //this.boundry constants

        //set world bounds
        this.matter.world.setBounds
            (
                0,
                0,
                this.boundry.Width,
                this.boundry.Height
            );

        //debug lines
        for (let i = 0; i < this.boundry.Height; i += 200)
            this.add.line(0, 0, 0, i, this.boundry.Width * 2, i, 0x000000);
        for (let i = 0; i < this.boundry.Width; i += 200)
            this.add.line(0, 0, i, 0, i, this.boundry.Height * 2, 0x000000);

        //array containing all rocks
        let k = 0
        this.rocks = []
        //temporary rock spawning algorithm TO BE REWORKED
        for (let i = 800; i < this.boundry.Height; i += 800)
            for (let j = 800; j < this.boundry.Width; j += 800) {
                this.rocks[k] = new rock(this,
                    j + Math.floor(Math.random() * 1600 - 800),
                    i + Math.floor(Math.random() * 1600 - 800), k);
                k++;
            }

        //temp port spawning
        this.ports = []
        for (let i = 0; i < 7; i++) {
            this.ports[i] = new port(this,
                Math.floor(Math.random() * this.boundry.Width),
                Math.floor(Math.random() * this.boundry.Height),
                i, this.colorsarr[Object.keys(this.colorsarr)[i % 7]])
        }

        //method of accesing specific rock/port with id=k from game scene
        //this.rocks.find(R=>R.ID==k)
        //example:
        //console.log(k,this.rocks.find(R=>R.ID==k).x,this.rocks.find(R=>R.ID==k).y);

        //create ship in the middle
        this.ship = new Player_ship(this, this.boundry.Width / 2, this.boundry.Height / 2);
        //lock camera on the ship
        this.cameras.main.startFollow(this.ship);

        //load ui
        this.scene.launch('Uiscene');

        //add sounds
        this.oceanSound = this.sound.add('oceanSound', { loop: true });
        this.moveSound = this.sound.add('movingShip', { loop: true });
        this.staySound = this.sound.add('stayingShip', { loop: true });
        this.shipDestroyed = this.sound.add('destroyShip');
        this.loadContain = this.sound.add('loadContainer');
        this.delivContain = this.sound.add('delivContainer');
        this.sCrash = this.sound.add('smallCrash');
        this.bCrash = this.sound.add('bigCrash');

        //oceanSound ON if soundMode = true ; oceanSound OFF if soundMode = false;
        if (window.soundMode) {
            this.oceanSound.play();
        }
    }
    update() {
        //ship position update
        if (this.ship !== undefined) {
            this.ship.update(this.keys);
        }

        //sound ON if soundMode = true ; sound OFF if soundMode = false;
        if (window.soundMode) {

            //set anyKeyDown to false (player ship is not moving)
            let keysDown = false;

            //checking if keys 'W' or 'S' are pressed - if yes - change sound to movingShip - if not - change sound to stayingShip
            for (let key in this.keys) {
                if (key === 'break' || key === 'interact' || key === 'left' || key === 'right') continue;
                if (this.keys[key].isDown) {
                    keysDown = true;
                    break;
                }
            }

            if (keysDown) {
                this.staySound.stop();
                if (!this.moveSound.isPlaying) {
                    this.moveSound.play();
                }
            } else {
                this.moveSound.stop();
                if (!this.staySound.isPlaying) {
                    this.staySound.play();
                }
            }

            // if ( /* condition: if ship is loading container - play loadContain sound */ ){
            //     this.loadContain.play();
            // }

            // if ( /* condition: if ship is loading container - play loadContain sound */ ){
            //     this.delivContain.play();
            // }

            //if ( /* condition: if ship hits rock OR iceberg OR map bounds OR port */ ) {
            //   //if ship speed is low - play smallCrash sound after hitting an abstacle; if ship speed is high - play bigCrash sound hitting an abstacle
            //   if (this.ship.engine.value <= 10) { 
            //        this.sCrash.play();
            //    } else {
            //        this.bCrash.play();
            //    }
            //}
        }

        //if ship health == 0 or lower - play shipDestroy sound, then turn off all looped sounds, stop GameScene & UiScene and start GameOverScene
        if (this.ship.health <= 0) {
            if (window.soundMode) {
                this.shipDestroyed.play();
            }
            this.oceanSound.stop();
            this.moveSound.stop();
            this.staySound.stop();
            this.scene.stop('Uiscene');
            this.scene.stop('GameScene');
            this.scene.launch('GameOverScene');
        }

        //creating global variables holding score that player has & how many contrainers has player delivered
        window.playerScore = this.ship.playerScore;
        window.deliveredContainers = this.ship.deliveredContainers;
        window.avgDeliveryTime = 0; // add code that'll count the average time of delivery & assign it here to windows.avgDeliveryTime
    }
}
