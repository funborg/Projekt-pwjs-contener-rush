import GameScene from './scenes/GameScene.js'
import UiScene from './scenes/UiScene.js'
import PreloadAssets from './helpers/PreloadAssets.js'
import MenuScene from './scenes/MenuScene.js'
import InstrScene from './scenes/InstrScene.js'
import CreditsScene from './scenes/CreditsScene.js'
import GameOverScene from './scenes/GameOverScene.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    
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