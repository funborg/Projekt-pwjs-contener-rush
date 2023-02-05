import { homedir } from 'os';
import Phaser, { GameObjects, Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';
import Events from '../helpers/Events';

//port origin
export default class port extends Phaser.Physics.Matter.Image
{
/**
 * @param {Phaser.Scene} scene 
 */
constructor(scene,x,y,chunk,ID,color=0xFFFFFF)
{
    super(
        scene.matter.world, x, y,'port',null,{isStatic:true,key: ID}
    );
    this.setScale(1.5)
    
    //set meta data
    this.setData('type','portA');
    this.color = color
    this.setTint(this.color)
    this.HasPackage = true;
    this.satisfied = false;
    this.ID= ID
    //occupied chunk
    this.chunk=chunk;
    this.setAngle(Phaser.Math.Angle.RandomDegrees())
    //interact area 
    //should be invisible in realese

    this.InteractArea=new Phaser.GameObjects.Rectangle
    (this.scene,this.x,this.y,this.width*1.5+275,this.height*1.5+275,0x00ff00,0)
    //highlight for when ship is close by 
    this.highlight = new Phaser.GameObjects.Image(this.scene,this.x,this.y,'port')
    this.highlight.setAlpha(0.75)
    this.highlight.setVisible(false)
    this.highlight.setAngle(this.angle)
    this.highlight.setDepth(4)  
    this.highlight.setScale(this.scale)
    //item
    this.item = new Phaser.GameObjects.Image(scene,x,y-this.height*1.5,'container')
    this.item.setAngle(90)
    this.item.setAlpha(0.66)
    this.item.setTint(this.color)   
    this.setDepth(2)  
    this.item.setDepth(2)  
    

    this.itemfloat = this.scene.tweens.add({
            targets: this.item,
            scaleX: 1.1,
            scaleY: 1.1,
            ease: 'sine.easeInOut',
            hold: 50,
            loopDelay: 50,
            duration: 2000,
            yoyo: true,
            repeat: -1

    })

    scene.matter.world.scene.add.existing(this.InteractArea)
    scene.matter.world.scene.add.existing(this.item);
    scene.matter.world.scene.add.existing(this);
    scene.matter.world.scene.add.existing(this.highlight)
    this.timeelapsed=0
    //timer for trakcing time
    this.stopwatch = this.scene.time.addEvent({
        delay:100,
        repeat:1,
        callback:()=>{this.timeelapsed++},
        loop:true,
        paused:true,
    })
    //listen for interaction
    this.scene.events.on('interact',(ship)=>this.interact(ship))
    //adding brother
    
    this.loadContain = this.scene.sound.add('loadContainer',{volume:0.5});
    this.delivContain = this.scene.sound.add('delivContainer',{volume:0.5});
    this.addbrother(this.scene,color)
}
addbrother(scene,color){

    //adds packege destination
    let p = scene.place(40)
    this.brother = new portB(scene,p.x,p.y,p.chunk,this.ID,color,this)
}
//check for ship in interact area           
isready(x,y){
    //highlight if ship is in interact area
    if(this.InteractArea.getBounds().contains(x,y)){
        this.highlight.setTintFill(0xC0C0C0)
        this.highlight.setVisible(true)
    //else lowlight if doesn't have packege
    }else if(!this.HasPackage){
        this.highlight.setTintFill(0x000000)
        this.highlight.setVisible(true)
    //else no changes
    }else{
        this.highlight.setVisible(false)
    }
}

fadeout()
{
this.satisfied = true
this.scene.tweens.add ({
    targets: [this,this.InteractArea,this.item,this.highlight],
    alpha: 0,
    duration: 300,
    ease: 'Power2',
    onComplete: () =>{     
        this.setPosition(-700,-700)
        this.InteractArea.setPosition(-700,-700)
        this.item.setPosition(-700,-700)
        this.highlight.setPosition(-700,-700)   
        this.scene.time.delayedCall(5000, this.relocate,null,this)} 
});


}    
//change location of it's objects,resets and reappear
relocate(){
    let p=this.scene.place(this.height/2)
    this.setPosition(p.x,p.y)
    this.setAlpha(1)
    this.InteractArea.setPosition(p.x,p.y)
    this.InteractArea.setAlpha(1)
    this.highlight.setPosition(p.x,p.y)
    this.highlight.setAlpha(0.25)
    this.item.setPosition(p.x,p.y-this.height)          
    this.item.setVisible(!this.item.visible)
    this.item.setAlpha(0.66)
    this.chunk.occupied=false
    this.chunk=p.chunk
    this.HasPackage=!this.HasPackage
    this.satisfied=false
}
interact(ship){
//if ship is close by
if(this.InteractArea.getBounds().contains(ship.x,ship.y)){
    
    if(this.HasPackage&&!this.satisfied){
        //place packege in first aviable place
        for(let i=0;i<ship.inventory.length;i++)
            if(ship.inventory[i]==-1){

                ship.inventory[i]=this.ID
                this.HasPackage=false

                this.scene.events.emit(Events.PACKAGE_EXCHANGE,this.ID,ship.inventory,this.color)
                //start timer on first pickup
                if(this.stopwatch.paused)
                    this.stopwatch.paused=false

                this.item.setVisible(false)
                if(this.scene.game.isSoundOn)
                    this.loadContain.play()
                break;
            }
    }else{
        //remove macthing packege from ships inventory
        for(let i=0;i<ship.inventory.length;i++)
            if(ship.inventory[i]==this.ID){

                ship.inventory[i]=-1
                this.HasPackage=true

                this.scene.events.emit(Events.PACKAGE_EXCHANGE,this.ID,ship.inventory,this.color)


                this.item.setVisible(true)
                if(this.scene.game.isSoundOn)
                    this.loadContain.play()
                break;
            }
    }
    
    
}
}


/////////////////////////////////////////////////////////////////////////////////////

}
//port destination
class portB extends port
{
constructor(scene,x,y,chunk,ID,color,port)
{
    super(scene,x,y,chunk,ID,color);
    this.setData('type','portB');
    this.HasPackage=false;
    this.brother=port
    this.item.setAlpha(0)
    this.scene.events.on('package_exchange',(ID)=>this.completeDelivery(ID))
    this.stopwatch = null

}
//overwrite addbrother function to prevent stack overflow
addbrother(){}
    //fade out itself and  it's brother
    fadeout() {
        this.brother.fadeout()
        super.fadeout()
    }
isready(x,y){
    //lowligth if brother has packege
    if(this.brother.HasPackage){
        this.highlight.setTintFill(0x000000)
        this.highlight.setVisible(true)
    //else higlight if ship is in inreact area
    }else if(this.InteractArea.getBounds().contains(x,y)){
        this.highlight.setTintFill(0xC0C0C0)
        this.highlight.setVisible(true)
    }else{
    //else no changes
        this.highlight.setVisible(false)
    } 
}
completeDelivery(ID){
    //check if delivery was completed
    if(this.ID===ID&&this.HasPackage){
        if(this.scene.game.isSoundOn)
            this.delivContain.play()
        this.scene.events.emit(Events.COMPLETED_DELIVERY, this.ID,this.brother.timeelapsed)
        if(this.brother.stopwatch){
            this.brother.stopwatch.paused=true
            this.brother.timeelapsed=0
        }
        this.fadeout()
    }
}  


}

