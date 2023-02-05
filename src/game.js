import GameScene from './scenes/GameScene'
import UiScene from './scenes/UiScene'
import PreloadAssets from './helpers/PreloadAssets'
import MenuScene from './scenes/MenuScene'
import InstrScene from './scenes/InstrScene'
import CreditsScene from './scenes/CreditsScene'
import GameOverScene from './scenes/GameOverScene'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,

    pixelArt:true,
    
    //turns off anti aliasing and pixel smoothing
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    fps: {
        target: 60, 
        forceSetTimeOut: true
    },
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0
            },
            debug: false
            
        }
    },
    //mute variable
    isSoundOn:true,
    scene: [PreloadAssets,GameOverScene,MenuScene,InstrScene,CreditsScene,GameScene,UiScene]
});