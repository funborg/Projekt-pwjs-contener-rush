import Phaser, { Structs } from 'phaser'
import Player_ship from '../sprites/player_ship';
import AssetsKeys from '../helpers/AssetsKeys';
import rock from '../sprites/rock';
import port from '../sprites/ports';
import events from '../helpers/Events';
import MenuScene from './MenuScene';
import GameOverScene from './GameOverScene';

export default class GameScene extends Phaser.Scene
{
constructor()
{
    super({key: 'GameScene'},"game");
}
init()
{
   
//keyboard inputs
	this.keys = this.input.keyboard.addKeys
    ({
        left:     'A',
        right:    'D',
        foward:   'W',
        backward: 'S',
        break:    'SPACE',
        interact: 'E'
    })
    this.ChunkSize=300;
    this.ChunksWidth=20;
//boundry data
    this.boundry=
    {
        Width:  this.ChunksWidth*this.ChunkSize,
        Height: this.ChunksWidth*this.ChunkSize
    }
//array of basic colors
    this.colorsarr=
    {
        red:    0xFF0000,
        blue:   0x0000FF,
        green:  0x00FF00,
        yellow: 0xFFFF00,
        purple: 0xFF00FF,
        aqua:   0x00FFFF,
        white:  0xFFFFFF
    }
}  
create()
{
    
    //background color
    this.cameras.main.setBackgroundColor("#2961b5");
    //set world bounds
    this.matter.world.setBounds
    (
        0, 
        0,
        this.boundry.Width,
        this.boundry.Height
    );
    
    //particle emitter
    this.foam = this.add.particles('seaFoam') 

    //create ship in the middle
    //play area is divide into 200x200 squares each 
    //square can contain only one object
    this.chunks= new Phaser.GameObjects.Group();
    var k=0
    for(let i=0;i<this.boundry.Height;i+=this.ChunkSize)
        for(let j=0;j<this.boundry.Width;j+=this.ChunkSize){
            this.chunks.add(new chunk(this,k,j,i,this.ChunkSize))
            
            k++}
    
        


    //debug lines TO BE REMOVED
    for(let i=0;i<this.boundry.Height;i+=this.ChunkSize)
        this.add.line(0,0,0,i,this.boundry.Width*2,i,0x000000);
    for(let i=0;i<this.boundry.Width;i+=this.ChunkSize)
       this.add.line(0,0,i,0,i,this.boundry.Height*2,0x000000);       

    this.ship = new Player_ship(this,this.boundry.Width/2,this.boundry.Height/2);

    //group containing all rocks
    this.rocks= new Phaser.GameObjects.Group();
    for(let i=0;i<10;i++){
    let p =  this.place(40)
    this.rocks.add(new rock(this,p.x,p.y,p.chunk,i))
    
    }


    //group containing all ports
    this.ports= new Phaser.GameObjects.Group();
    for(let i=0;i<7;i++){
        let p =  this.place(40)
        this.ports.add(
        new port( this,p.x,p.y,p.chunk,i,
        this.colorsarr[Object.keys(this.colorsarr)[i%7]]))
    }
    //method of accesing specific rock/port by id from game scene
    //this.rocks.getFirstNth(id,true)
    
    //lock camera on the ship
    this.cameras.main.startFollow(this.ship);
    //load ui
    this.ui = this.scene.launch('Uiscene')

    //add rock upon completed delivery
    this.events.on('completed_delivery',()=>{
    if(this.rocks.getLength()<200){
        let p =  this.place(40)
        this.rocks.add(new rock(this,p.x,p.y,p.chunk,this.rocks.getLength()))
        }
    })
    
    //game over sequence
    this.events.on('game_over',()=>{
        //if ship was destroyed fade it out
        if(this.ship.health<=0){
        this.ship.trailL.stop();
        this.ship.trailR.stop();
        this.add.tween({
            targets:this.ship,
            alpha:0.05,
            duration:3000,
        })
        }
        //fade out camera game over
        this.scene.stop('Uiscene')
        this.time.delayedCall(1000, () => {
        this.cameras.main.fadeOut(2000, 0, 0, 0)})
        
    })
    //on camera fade out change scene
	this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
		this.time.delayedCall(1000, () => {this.scene.start('GameOverScene',)})})

 
    //wave on the ocean
    this.waves = this.foam.createEmitter({
        frequency: 600,
        quantity: 20,
        rotate:{min:-20,max:-70},
        scale:{start:0,end:1.5,ease:'Back'},
        alpha:{start:0.8,end:0,ease:'Sine'},
        lifespan:  {min:1000,max:5000},
        x:         {min:0,   max:this.boundry.Width},
        y:         {min:0,   max:this.boundry.Height},
        speedX:      -200,
        speedY:      200,
        
    });
    
    this.cameras.main.fadeIn(1000)
}
update()
{

//ship position update
    if(this.ship!==undefined)
        this.ship.update(this.keys);
    for(let i=0;i<this.ports.getLength();i++){
        this.ports.getFirstNth(i,true).isready(this.ship.x,this.ship.y)
        this.ports.getFirstNth(i,true).brother.isready(this.ship.x,this.ship.y)
    }

}
//method of finding unoccupied chunk
place(frame=0,limit=5000){

    let cam=new Phaser.Geom.Rectangle
    do{
    //get new chunk
    var rId =Math.floor(Math.random()*(this.chunks.getLength()));
    var rchunk = this.chunks.getFirstNth(rId,true)

    //inflated camera bounds
    Phaser.Geom.Rectangle.CopyFrom(this.cameras.main.worldView,cam)
    Phaser.Geom.Rectangle.Inflate(cam,rchunk.size,rchunk.size)
    limit--
    //check if limit has not been reached
    if(limit==0)
        break;
    //check if chunk is not occupied,is not in camera
    }while(rchunk.occupied||cam.contains(rchunk.x,rchunk.y))
    rchunk.occupied=true
    return rchunk.getcoor(frame)
}

}
//chunk object for tracking objects located inside of it
class chunk extends Phaser.GameObjects.Zone{
    constructor(scene,ID,x,y,size)
    { 

    super(scene,x,y,size,size)
    this.size=size
    this.occupied=false
    this.ID=ID

    }
    //return random coordinates and this object 
    getcoor(frame=0){
        return {x: this.x+Math.floor(Math.random()*(this.size-frame*2+1))+frame,
                y: this.y+Math.floor(Math.random()*(this.size-frame*2+1))+frame,
                chunk:this}
    }           

}