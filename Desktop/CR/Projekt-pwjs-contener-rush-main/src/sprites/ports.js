import Phaser, { GameObjects, Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';
import Events from '../helpers/Events';

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
    this.HasPackage = true;

    //interact area
    this.InteractArea=new Phaser.GameObjects.Rectangle
    (this.scene,this.x,this.y,this.width*3.5,this.height*3.5,0x00ff00,0.5)
    scene.matter.world.scene.add.existing(this.InteractArea)

    scene.matter.world.scene.add.existing(this);
    //listen for interaction
    this.scene.events.on('interact',(ship)=>this.interact(ship))
    //adding brother
    this.addbrother(this.scene,color)
}
addbrother(scene,color){
    //adds packege destination
    this.brother = new portB(scene,this.x+400,this.y,this.ID,color,this)
}

fadeout()
{

this.scene.tweens.add ({
    targets: [this,this.InteractArea],
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () =>{this.relocate()} 
});

}
relocate(){
    //relocation to be added
    this.destroy();
}
interact(ship){
    //if ship is close by
    if(this.InteractArea.getBounds().contains(ship.x,ship.y)){
        if(this.HasPackage){
            //place packege in first aviable place
            for(let i=0;i<ship.invetory.length;i++)
                if(ship.invetory[i]==-1){
                    ship.invetory[i]=this.ID
                    this.HasPackage=false
                    this.scene.events.emit(Events.PACKAGE_EXCHANGE,this.ID,ship.invetory)
                    break;
                }
        }else{
            //remove macthing packege from ships inventory
            for(let i=0;i<ship.invetory.length;i++)
                if(ship.invetory[i]==this.ID){
                    ship.invetory[i]=-1
                    this.HasPackage=true
                    this.scene.events.emit(Events.PACKAGE_EXCHANGE,this.ID,ship.invetory)
                    break;
                }
        }
            
        
        
    }
}

  
}
//port destination
class portB extends port
{
constructor(scene,x,y,ID,color,port)
{
    super(scene,x,y,ID,color);
    this.HasPackage=false;
    this.oldbro= port
    this.scene.events.on('package_exchange',(ID)=>this.completeDelivery(ID))
}
//overwrite addbrother function to prevent stack overflow
addbrother(){}
//fade out itself and  it's brother
fadeout(){
    this.oldbro.fadeout()
    super.fadeout()
}



completeDelivery(ID){
    //check if delivery was completed
    if(this.ID===ID&&this.HasPackage)
        this.fadeout()

}  

        
}
    
