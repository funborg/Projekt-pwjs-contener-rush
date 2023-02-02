import GameScene from './scenes/GameScene'
import UiScene from './scenes/UiScene'
import PreloadAssets from './helpers/PreloadAssets'
import MenuScene from './scenes/MenuScene'
import InstrScene from './scenes/InstrScene'
import CreditsScene from './scenes/CreditsScene'
import GameOverScene from './scenes/GameOverScene'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 1600,
    height: 1200,
    scale: {
        mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
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
            debug: true
            
        }
    },
    scene: [PreloadAssets,GameOverScene,MenuScene,InstrScene,CreditsScene,GameScene,UiScene]
});