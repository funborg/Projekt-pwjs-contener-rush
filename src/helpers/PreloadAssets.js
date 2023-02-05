import Phaser from 'phaser'

export default class PreloadAssets extends Phaser.Scene {
    constructor() {
        super({ key: 'Preload Assets' }, "game");
    }

    preload(){
        this.load.image('bground', 'images/menu_bg.png'); //menu background
        this.load.image('mShip', 'images/menuShip.png'); //menu ship
        this.load.image('mContainer', 'images/menu_container.png'); //menu container
        this.load.image('cliffside', 'images/cliff_bottom.png'); //side
        this.load.image('cliffCorner', 'images/cliff_corner.png'); //corner
        this.load.image('grass', 'images/grass.png'); //grass outside boundry
        this.load.image('container', 'images/container.png'); //game container
        this.load.image('iceBerg', 'images/ice_Berg.png'); //ice berg
        this.load.image('port', 'images/port.png'); //port
        this.load.image('rock', 'images/rock.png'); //rock
        this.load.image('seaFoam', 'images/sea_foam.png'); //sea foam
        this.load.image('water', 'images/water.png'); //sea foam
        this.load.image('ship', 'images/ship.png'); //player ship
        this.load.audio('buttonClicked', 'sounds/buttonClicked.wav'); //clicked button sound
        this.load.audio('movingShip', 'sounds/MovingShipEngine.wav'); //ship engine while moving
        this.load.audio('stayingShip', 'sounds/StayingShipEngine.wav'); //ship engine while staying
        this.load.audio('oceanSound', 'sounds/oceanSound.wav'); //ocean sounds
        this.load.audio('destroyShip','sounds/shipDestroyed.wav'); //sound of destroying ship
        this.load.audio('loadContainer','sounds/obtainContainer.wav'); //sound when container is loaded on ship
        this.load.audio('delivContainer','sounds/deliveredContainer.wav'); //sound when container is delivered
        this.load.audio('smallCrash','sounds/smallCrash.mp3'); //small sound of hitting a stone or iceberg
        this.load.audio('bigCrash','sounds/bigCrash.mp3'); //big sound of hitting a stone or iceberg
    }
    create(){
        //global ocean sound
        this.game.oceanSound = this.sound.add('oceanSound', { loop: true,volume: 0.1 });
        //starting with 'MenuScene'
        this.scene.start('MenuScene');
    }
}