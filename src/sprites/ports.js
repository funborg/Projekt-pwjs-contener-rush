import Phaser, { Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';


export default class port extends Phaser.Physics.Matter.Sprite
{
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene,x,y,ID,color=0xFFFFFF)
    {
        super(
            scene.matter.world, x, y, AssetsKeys.TEXTURES, 'port',{isStatic:true}
        );
        //set meta data
        this.setData('type','port');
        //set rock id
        this.ID=ID;
        this.setTint(color)
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