import Phaser, { Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';


export default class rock extends Phaser.Physics.Matter.Sprite
{
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene,x,y,ID)
    {
        super(
            scene.matter.world, x, y, AssetsKeys.TEXTURES, 'rock',{isStatic:true}
        );
        //set meta data
        this.setData('type','rock');
        //set rock id
        this.ID=ID;
        //add rock to world
        scene.matter.world.scene.add.existing(this);
        //console.log(this.x,this.y,this.ID)
    }
    //collision in case of
    shipCollision(){
        //fade out and destroy
        this.scene.tweens.add ({
            targets: this,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () =>{this.destroy()}
            
        });
    }
    

}