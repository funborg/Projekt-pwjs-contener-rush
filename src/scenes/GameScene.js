import Phaser from 'phaser'
import Player_ship from '../sprites/player_ship.js';
import rock from '../sprites/rock.js';
import port from '../sprites/ports.js';

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
        green:  0x008000,
        yellow: 0xFFFF00,
        purple: 0xFF00FF,
        lightB: 0x2973B8,
        white:  0xFFFFFF,
        hotpink: 0xFF69B4,
       
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
    this.foam.setDepth(1)
    //create ship in the middle
    //play area is divide into 200x200 squares each 
    //square can contain only one object
    this.chunks= new Phaser.GameObjects.Group();
    var k=0
    for(let i=0;i<this.boundry.Height;i+=this.ChunkSize)
        for(let j=0;j<this.boundry.Width;j+=this.ChunkSize){
            this.chunks.add(new chunk(this,k,j,i,this.ChunkSize))
            
            k++}
    k=0
    //decorative to fill sides with water not for use in game
    this.decorchunks= new Phaser.GameObjects.Group();
    for(let i=-this.ChunkSize;i<this.boundry.Height;i+=this.ChunkSize){
            this.decorchunks.add(new chunk(this,k,i,-this.ChunkSize,this.ChunkSize))
            k++
    }
    for(let i=-this.ChunkSize;i<this.boundry.Height;i+=this.ChunkSize){
            this.decorchunks.add(new chunk(this,k,-this.ChunkSize,i,this.ChunkSize))
            k++
    }



    //cliffs border
    this.cliffs= new Phaser.GameObjects.Group(this)
    for(let i=0;i<this.boundry.Height;i+=this.ChunkSize){
        this.cliffs.add(
            new Phaser.GameObjects.Image
            (this,
            0-this.ChunkSize/2,
            i+this.ChunkSize/2,
            'cliffside'),true)

            
        this.cliffs.add(
            new Phaser.GameObjects.Image
            (this,
            this.boundry.Width+this.ChunkSize/2,
            i+this.ChunkSize/2,
            'cliffside'),true)
        this.cliffs.getLast(true).setAngle(180)


        this.cliffs.add(
            new Phaser.GameObjects.Image
            (this,
            i+this.ChunkSize/2,
            0-this.ChunkSize/2,
            'cliffside'),true)
        this.cliffs.getLast(true).setAngle(90)


        this.cliffs.add(
            new Phaser.GameObjects.Image(
            this,
            i+this.ChunkSize/2,
            this.boundry.Height+this.ChunkSize/2,
            'cliffside'),true)
        this.cliffs.getLast(true).setAngle(-90)
    }

    //cliffs corners
    this.cliffs.add(
        new Phaser.GameObjects.Image
            (this,
            this.boundry.Width+this.ChunkSize/2,
            0-this.ChunkSize/2,
            'cliffCorner'),true) 



    this.cliffs.add(
        new Phaser.GameObjects.Image
            (this,
            0-this.ChunkSize/2,
            this.boundry.Height+this.ChunkSize/2,
            'cliffCorner'),true) 
             
    this.cliffs.getLast(true).setAngle(180)  
 

    this.cliffs.add(
        new Phaser.GameObjects.Image
            (this,
            0-this.ChunkSize/2,
            0-this.ChunkSize/2,
            'cliffCorner'),true)
                
    this.cliffs.getLast(true).setAngle(-90)  

        
    this.cliffs.add(
        new Phaser.GameObjects.Image
            (this,
            this.boundry.Width+this.ChunkSize/2,
            this.boundry.Height+this.ChunkSize/2,
            'cliffCorner'),true) 
            
    this.cliffs.getLast(true).setAngle(90) 
    //cliffs outside
    let rangle=[0,90,-90,180] 
    for(let i=-(this.ChunkSize*3);i<this.boundry.Height+(this.ChunkSize*3);i+=this.ChunkSize)
        for(let j=-(this.ChunkSize*3);j<this.boundry.Width+(this.ChunkSize*3);j+=this.ChunkSize)
            if((i<-this.ChunkSize||i>this.boundry.Height)||(j<-this.ChunkSize||j>this.boundry.Width)){
                this.cliffs.add(        
                    new Phaser.GameObjects.Image
                    (this,
                    j+this.ChunkSize/2,
                    i+this.ChunkSize/2,
                    'grass'),true)
                this.cliffs.getLast(true).setAngle(-90)
            }
        
    





    //scale cliffs tile to chunk size
    this.cliffs.children.each((G)=>{G.setScale(this.ChunkSize/G.width)
    G.texture.setFilter(Phaser.ScaleModes.NEAREST)})   
    this.cliffs.setDepth(2)
        


    //debug lines TO BE REMOVED
    //for(let i=0;i<this.boundry.Height;i+=this.ChunkSize)
     //   this.add.line(0,0,0,i,this.boundry.Width*2,i,0x000000);
    //for(let i=0;i<this.boundry.Width;i+=this.ChunkSize)
     //  this.add.line(0,0,i,0,i,this.boundry.Height*2,0x000000);       

    this.ship = new Player_ship(this,this.boundry.Width/2,this.boundry.Height/2);

    //group containing all rocks
    this.rocks= new Phaser.GameObjects.Group(this);
    for(let i=0;i<10;i++){
    let p =  this.place(40)
    this.rocks.add(new rock(this,p.x,p.y,p.chunk,i))
    
    }


    //group containing all ports
    this.ports= new Phaser.GameObjects.Group(this);
    for(let i=0;i<8;i++){
        let p =  this.place(40)
        this.ports.add(
        new port( this,p.x,p.y,p.chunk,i,
        this.colorsarr[Object.keys(this.colorsarr)[i%Object.keys(this.colorsarr).length]]))
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
    this.avgtime=0
    this.delivcompleted=0
    this.gametime=0
    this.events.on('completed_delivery',(ID,time)=>{
        this.delivcompleted++
        //add measured time to avarege time
        this.avgtime+=(time-this.avgtime)/this.delivcompleted
    })
    this.clock = this.time.addEvent({
        delay:100,
        repeat:1,
        callback:()=>{this.gametime++},
        loop:true,
    })
    //on camera fade out change scene
	this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
		this.time.delayedCall(1000, () => {
        //turns off listiners
        this.events.off('completed_delivery');
        this.events.off('interact');
        this.events.off('package_exchange');
        this.events.off('completed_delivery');
        this.events.off('game_over');

        this.scene.start('GameOverScene',{
            avg:this.avgtime,
            count:this.delivcompleted,
            time:this.gametime})
        })})

 
    //waves on the ocean
    this.waves = this.foam.createEmitter({
        frequency: 600,
        quantity: 20,
        rotate:{min:-170,max:-130},
        scale:{start:0,end:1.5,ease:'Back'},
        alpha:{start:1,end:0,ease:'Cubic.easeIn'},
        lifespan:  {min:1000,max:5000},
        x:         {min:0,   max:this.boundry.Width},
        y:         {min:0,   max:this.boundry.Height},
        speedX:      200,
        speedY:      200,
        
    });
    this.waves.texture.setFilter(Phaser.ScaleModes.NEAREST)
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

    //water animation
    this.water= new Phaser.GameObjects.Image(scene,x+this.size/2,y+this.size/2,'water')

    this.water.setScale(this.size/this.water.width)
    scene.add.existing(this.water);
    this.water.texture.setFilter(Phaser.ScaleModes.NEAREST)
    this.water.setDepth(0)
    this.scene.add.tween({
        targets:this.water,
        x:this.water.x+this.size,
        y:this.water.y+this.size,
        repeat:-1,
        duration: 5000,
    })
    }
    
    //return random coordinates and this object 
    getcoor(frame=0){
        return {x: this.x+Math.floor(Math.random()*(this.size-frame*2+1))+frame,
                y: this.y+Math.floor(Math.random()*(this.size-frame*2+1))+frame,
                chunk:this}
    }           

}