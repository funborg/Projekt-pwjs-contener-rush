import Phaser from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';

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
    this.health = new HealthBar(this,50,this.game.scale.gameSize.height-90, 300,45)
    //temoray static timer 
    this.timer = this.add.text(30, 20, 'time: 0', { font: '48px Arial', fill: '#0040FF' });
    //listen for health changes
    this.gamescene.events.on('health_change',hp=>{
        this.health.hp = hp;
        this.health.draw();
    })
    //draw healthbar
    this.health.hp= this.gamescene.ship.health
    this.health.draw();
    //array with ship slots
    this.slots=[]
    for(let i=0;i<3;i++){
        this.slots[i]=new slot(this,this.game.scale.gameSize.width-60,this.game.scale.gameSize.height-60-(100*i))
    }
    //inventory update upon event
    this.gamescene.events.on('package_exchange',(ID,inventory)=>this.inventoryUpdate(ID,inventory))

}

inventoryUpdate(ID,inventory){
    for(let i=0;i<inventory.length;i++){
        if(ID==inventory[i]){//if there's item set visible and update color
            this.slots[i].setitem(this.gamescene.colorsarr[Object.keys(this.gamescene.colorsarr)[ID%7]],1)
        }else if(inventory[i]==-1){//if no item found set invisible and reset color 
            this.slots[i].setitem(0xFFFFFF,0)
        }
    }

}
}
class slot extends Phaser.GameObjects.Image{
constructor(scene,x,y)
{
    super(scene,x,y,AssetsKeys.TEXTURES,'slot')
    scene.add.existing(this);
    //ad container graphic and set invisble
    this.item = new Phaser.GameObjects.Image(scene,x,y,AssetsKeys.TEXTURES,'container')
    this.item.setAlpha(0)
    scene.matter.world.scene.add.existing(this.item);
  
    
}
setitem(color,alpha)
{
    this.item.setTint(color)
    this.item.setAlpha(alpha)
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
}
draw()
{
    if(this.hp<0)
        this.hp=0
    
    this.bar.clear();
    //background
    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x-10, this.y-10, this.w+20, this.h+20);

    //empty healthbar
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x , this.y,  this.w, this.h);

    //set color of health bar
    if (this.hp < 30)
        this.bar.fillStyle(0xff0000);
    else
        this.bar.fillStyle(0x00ff00);

    this.bar.fillRect(this.x , this.y , Math.floor(this.onepoint * this.hp), this.h);
}
}