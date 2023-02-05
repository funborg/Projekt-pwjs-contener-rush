import Phaser from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';
import events from '../helpers/Events';
export default class UiScene extends Phaser.Scene
{
constructor()
{
    super({key: 'Uiscene'},"game");
}

create()
{
    //get main game data
    this.gamescene = this.scene.get('GameScene');
    //health bar creation
    this.health = new HealthBar(this,250,60, 300,40,this.gamescene.ship.health)
    //listen for health changes

    //draw healthbar
    //timer
    this.timer = new texttimer(this,this.game.scale.width-250,80)
    //group of ship inventory slots 

    //offset vector for slots
    let offest =[{x:-20,y:45},{x:20,y:45},{x:-20,y:-55},{x:20,y:-55}]
    this.slots=new Phaser.GameObjects.Group();
    for(let i=0;i<this.gamescene.ship.inventory.length;i++){
        this.slots.add(
        new slot(this,
        this.game.scale.gameSize.width/2+offest[i].x,
        this.game.scale.gameSize.height/2+offest[i].y,
        i))
    }
    //compas arrows
    this.compas = new Phaser.GameObjects.Group();
    for(let i=0;i<this.gamescene.ports.getLength();i++){
        this.compas.add(
            new arrow(
            this,
            0,
            0,
            this.gamescene.ports.getFirstNth(i,true)))
    }
    //inventory update upon event
    this.gamescene.events.on('package_exchange',(ID,inventory,color)=>this.inventoryUpdate(ID,inventory,color))

}
update()
{
    for(let i=0;i<this.compas.getLength();i++)
        this.compas.getFirstNth(i,true).compassUpdate(
            this.gamescene.ship.x,this.gamescene.ship.y)

    for(let i=0;i<this.slots.getLength();i++)
        this.slots.getFirstNth(i,true).positionUpdate(this.gamescene.ship.angle)
}


inventoryUpdate(ID,inventory,color){
    if(inventory)
    for(let i=0;i<inventory.length;i++){
        if(ID==inventory[i]){//if there's item set visible and update to color 
            this.slots.getFirstNth(i+1,true).setitem(color,true)
        }else if(inventory[i]==-1){//if no item found set i slot invisible and reset color 
            this.slots.getFirstNth(i+1,true).setitem(0xFFFFFF,false)
        }
    }

}

}
class slot extends Phaser.GameObjects.Image{
constructor(scene,x,y,ID)
{
    super(scene,x,y,'container',null,{key: ID})
    this.scene=scene
    //ad container graphic and set invisble
    this.setVisible(false)
    scene.add.existing(this);
    
  
    
    
}

positionUpdate(angle){
    let rotate=Phaser.Math.Angle.ShortestBetween(this.angle,angle)*Math.PI/180

    Phaser.Math.RotateAround(this,
        this.scene.game.scale.gameSize.width/2,
        this.scene.game.scale.gameSize.height/2,
        rotate)
    this.setAngle(angle)
        
}
setitem(color,vis)
{
    this.setTint(color)
    this.setVisible(vis)
}
}
class arrow extends Phaser.GameObjects.Graphics {
constructor(scene,x,y,destination){

    super(scene)

    this.x = x;
    this.y = y;
    this.ID = destination.ID;
    this.destination=destination;
    this.target={x:this.destination.x,y:this.destination.y}
    //arrow creation
    scene.add.existing(this);
    this.fillStyle(0x012636);
    this.fillTriangle(this.x-3, this.y+33,this.x-3, this.y-33,this.x+35, this.y);
    this.fillStyle(destination.color);
    this.fillTriangle(this.x, this.y+25,this.x, this.y-25,this.x+30, this.y);
    //on packege exchange change targets
    this.scene.gamescene.events.on('package_exchange',(ID,inventory)=>this.targetchange(inventory))
    //dissapear if destination is satisfied
    this.scene.gamescene.events.on('completed_delivery',(ID)=>{
        if(this.ID===ID){
        this.setVisible(false)
        this.scene.time.delayedCall(6000,()=>{
            this.target={x:this.destination.x,y:this.destination.y}
            this.setVisible(true)})}
    })

}
    

compassUpdate(x,y){
    //get direction of ship to destination  
    let direction=Phaser.Math.Angle.Between(x,y,this.target.x,this.target.y)
    //ratio of distance to boundry width
    let distance =Phaser.Math.Distance.Between(x,y,this.target.x,this.target.y)/this.scene.gamescene.boundry.Width
    //rotate arrow around the middle of screen
    Phaser.Math.RotateTo(this,
        this.scene.game.scale.gameSize.width/2,
        this.scene.game.scale.gameSize.height/2,
        direction,
        (300*distance+50))

    //point the arrow in the direction of destination
    this.rotation=direction
    //object scales and fades depending on player distance from destination down to 60%
    if((1-distance)>0.30){
    this.setScale((1-distance)+0.30)
    this.setAlpha((1-distance)+0.30)
    }else{
    this.setScale(0.60)
    this.setAlpha(0.60)
    }
}
targetchange(inventory){
        

    //check for items in inventory
    //if it's in inventory change targets to port brother 
    //else change target to main port
    for (let i=0;i<inventory.length;i++)
        if(inventory[i]==this.ID){
            this.target={x:this.destination.brother.x,y:this.destination.brother.y}
            break;
        }else{
            this.target={x:this.destination.x,y:this.destination.y}
        }
    this.compassUpdate(this.scene.gamescene.ship.x,this.scene.gamescene.ship.y)

}

}
class texttimer extends Phaser.GameObjects.Text{
    constructor (scene,x,y){
        super(scene,x,y,'time left ',{ fontFamily: 'Stencil', fontSize: 60, color: '#085b80' })

    //time value in seconds
    this.timeleft= 180;
    //time bonus given upon a succesful delivery
    this.timebonus=10
    this.updatetime();
    this.setOrigin(0.5);
    //timer background
    this.backgorund = new Phaser.GameObjects.Graphics(scene)
    this.backgorund.lineStyle(15, 0x002a3d);
    this.backgorund.strokeRect(x-this.width*1.1/2, y-this.height/2, this.width*1.1, this.height);
    this.backgorund.fillStyle(0x076d8f,0.9);
    this.backgorund.fillRect(x-this.width*1.1/2, y-this.height/2, this.width*1.1, this.height);

    //feedbakc for delivery
    this.feedbacktxt = new Phaser.GameObjects.Text
    (scene,x+100,y+25,'+'+this.timebonus,{ fontFamily: 'Stencil', fontSize: 58, color: '#ba6102' })
    this.feedbacktxt.setVisible(false)
    this.feedbacktxt.setStroke('#914103', 10);


    this.scene.add.existing(this.backgorund)
    this.scene.add.existing(this)
    this.scene.add.existing(this.feedbacktxt)
    //add time on succesful delivery
    this.scene.gamescene.events.on('completed_delivery',()=>{this.timeadded})
    //tickdown the timer
    this.timedevent = this.scene.time.addEvent({
        delay:1000,
        repeat:1,
        callback: this.tickdown,
        callbackScope: this,
        loop:true
    })
    
    }
timeadded(){
    //give feeback
    this.feedbacktxt.setVisible(true)
    this.scene.tweens.add({
        targets:this.feedbacktxt,
        y:this.feedbacktxt.y+75,
        duration:1500,
        alpha:0,
        ease:'Quad',
        onComplete:()=>{
            this.feedbacktxt.setVisible(false)
            this.feedbacktxt.alpha=1
            this.feedbacktxt.y=this.y+50
        }})

    //add time
    this.timeleft+=this.timebonus
    this.updatetime()
    
}
//decriment time
tickdown(){
    this.timeleft--
    this.updatetime()
    if(this.timeleft===0){
        this.timedevent.paused=true
        this.scene.gamescene.events.emit(events.GAME_OVER)
    }
}
//loop of updating the timer
updatetime(){
    
    this.setText(
        'time left '+Math.floor(this.timeleft/60).toString().padStart(2,'0')+
        ':'+(this.timeleft%60).toString().padStart(2,'0') );
    //set to orange colors if time limit under minute
    if(this.timeleft<60){
        this.setColor('#ba6102');
        this.setStroke('#914103', 10);
    }else{
        this.setColor('#085b80');
        this.setStroke('#012636', 10);
    }
}


}
class HealthBar  {
constructor (scene,x,y,width,heigth,hp=100)
{
    //healthbar properties
    this.bar = new Phaser.GameObjects.Graphics(scene)
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = heigth;
    this.hp = hp;
    this.onepoint = this.w/this.hp
    scene.add.existing(this.bar);
    scene.gamescene.events.on('health_change',hp=>{
        this.hp = hp;
        this.draw();
    }) 
    this.draw();
    
    //life text
    this.text=new Phaser.GameObjects.Text
    (scene,x-100,y+this.h/2,'life :',{ fontFamily: 'Stencil', fontSize: 56, color: '#085b80' })

    this.text.setColor('#085b80');
    this.text.setStroke('#012636', 10);
    this.text.setOrigin(0.5)

    this.txtbackgorund = new Phaser.GameObjects.Graphics(scene)
    this.txtbackgorund.lineStyle(15, 0x002a3d);

    this.txtbackgorund.strokeRect(
        this.text.x-this.text.width*1.1/2,
        this.text.y-this.text.height/2, 
        this.text.width*1.1, 
        this.text.height);

    this.txtbackgorund.fillStyle(0x076d8f,0.9);
    
    this.txtbackgorund.fillRect(
        this.text.x-this.text.width*1.1/2,
        this.text.y-this.text.height/2,
        this.text.width*1.1,
        this.text.height);
    
    scene.add.existing(this.txtbackgorund);
    scene.add.existing(this.text);
}
draw()
{
    if(this.hp<0)
        this.hp=0
    
    this.bar.clear();
    //background
    this.bar.fillStyle(0x002a3d);
    this.bar.fillRect(this.x-10, this.y-10, this.w+20, this.h+20);

    //empty healthbar
    this.bar.fillStyle(0x076d8f);
    this.bar.fillRect(this.x , this.y,  this.w, this.h);

    //set color of health bar
    if (this.hp < 30)
        this.bar.fillStyle(0x914103);
    else
        this.bar.fillStyle(0xba6102);

    this.bar.fillRect(this.x , this.y , Math.floor(this.onepoint * this.hp), this.h);
}
}