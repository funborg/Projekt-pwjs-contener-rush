import Phaser, { Structs } from 'phaser'
import Player_ship from '../sprites/player_ship';
import AssetsKeys from '../helpers/AssetsKeys';
import rock from '../sprites/rock';
import port from '../sprites/ports';
import events from '../helpers/Events';
import MenuScene from './MenuScene';

export default class GameScene extends Phaser.Scene
{
constructor()
{
    super({key: 'GameScene'},"game");
}
preload()
{
    this.load.atlas
    (
    AssetsKeys.TEXTURES, 
    '/images/spritesheet.png', 
    '/images/spritesheet.json'
    );
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
    this.ChunkSize=200;
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
    this.cameras.main.setBackgroundColor("#0084a5");
    //set world bounds
    this.matter.world.setBounds
    (
        0, 
        0,
        this.boundry.Width,
        this.boundry.Height
    );
    
    //create ship in the middle
    this.ship = new Player_ship(this,this.boundry.Width/2,this.boundry.Height/2);
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
}
update()
{
    
//ship position update
    if(this.ship!==undefined)
        this.ship.update(this.keys);
    
}
//method of finding unoccupied chunk
place(frame=0,limit=5000){
    //inflated camera bounds
    let cam=new Phaser.Geom.Rectangle
    Phaser.Geom.Rectangle.CopyFrom(this.cameras.main.worldView,cam)
    Phaser.Geom.Rectangle.Inflate(cam,rchunk.size,rchunk.size)

    do{
    var rId =Math.floor(Math.random()*(this.chunks.getLength()));
    var rchunk = this.chunks.getFirstNth(rId,true)

    limit--
    //check if chunk is not occupied,is not in camera and limit is not reached
    }while(rchunk.occupied||cam.contains(rchunk.x,rchunk.y)||limit==0)
    rchunk.occupied=true
    return rchunk.getcoor(frame)
}

}

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