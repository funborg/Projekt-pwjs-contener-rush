import GameScene from './scenes/GameScene'
import UiScene from './scenes/UiScene'

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
    scene: [GameScene,UiScene]
});