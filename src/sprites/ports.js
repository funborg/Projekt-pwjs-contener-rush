import Phaser, { GameObjects, Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';

//port origin
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
        this.setData('type','portA');
        this.ID=ID;
        this.setTint(color)

        //interact area
        this.InteractArea=new Phaser.GameObjects.Rectangle
        (this.scene,this.x,this.y,this.width*3,this.height*3,0x00ff00,0.5)
        scene.matter.world.scene.add.existing(this.InteractArea)
        
        
        scene.matter.world.scene.add.existing(this);

        //listen for interaction
        this.scene.events.on('interact',(x,y)=>this.interact(x,y))
        //adding brother
        this.addbrother(this.scene,color)
    }
    interact(x,y){
        //if ship is close by
        if(this.InteractArea.getBounds().contains(x,y)){
            console.log(this.ID)
        }

    }
    addbrother(scene,color){
        //adds packege destination
        this.brother = new portB(scene,this.x+400,this.y,this.ID,color)
    }
  
}
//port destination
class portB extends port
{
    constructor(scene,x,y,ID,color)
    {
        super(scene,x,y,ID,color);
    }
    //overwrite addbrother function to prevent stack overflow
    addbrother(){}

    interact(x,y){
    //if ship is close by
        if(this.InteractArea.getBounds().contains(x,y)){
            console.log(-this.ID)
        }
    }
}