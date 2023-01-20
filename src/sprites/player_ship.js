import Phaser from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';


export default class Player_ship extends Phaser.Physics.Matter.Sprite
{
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene,x,y)
    {
        super(
            scene.matter.world, x, y, AssetsKeys.TEXTURES, 'ship',{isStatic:false}
        );
        scene.matter.body.setInertia(this.body, Infinity);
        //set bounce value
        this.setBounce(0.5);
        //player sway properties
        this.rudder={
        value: 0,
        max: 0.05,
        step: 0.0015
        }
        //players momentum
        this.engine={
        value: 0,
        max: 16,
        step: 0.15
        }
        
        //players health
        this.health=100;
        
        
        //collision procedure
        this.setOnCollide(this.oncollision);
        //bounce vector
        this.BounceVec = {x:0,y:0};
        this.bounced=false;
        //add this element
        scene.matter.world.scene.add.existing(this);
        
    }
    //player update
    update(keys)
    {
        if(this.health<0){
            //game crashes if it's destroyed
            //this.destroy();
            this.engine.value=0;
            return;
        }
        //console.log(this.body.speed)
        //console.log(this.engine)
        //swivel rudder
        if ((keys.right.isDown && this.rudder.value<this.rudder.max) 
        || (keys.break.isDown && this.rudder.value<-this.rudder.step)){
            //rotate right if right key is held up to limit
            //or straigthens if breaks are held down rotates towards left 
            this.rudder.value+=this.rudder.step;
        }else if ((keys.left.isDown && this.rudder.value>-this.rudder.max) 
        || (keys.break.isDown && this.rudder.value>this.rudder.step))
            //rotate left if left key is held up to limit
            //or straigthens if breaks are held down rotates towards right 
            this.rudder.value-=this.rudder.step;



        //engine control
        if (( keys.foward.isDown&&this.engine.value<this.engine.max) 
        || (keys.break.isDown&&this.engine.value<-this.engine.step)){
            //moves foward if foward key is held down and under engine limit
            //or breaks are held down and engine is in backward momentum 
            this.engine.value+=this.engine.step;
        }else if ((keys.backward.isDown && this.engine.value-this.engine.max/2) 
        || (keys.break.isDown && this.engine.value>this.engine.step*0.75)){
            //move backward if backward key is held down and under engine limit
            //or breaks are held down and engine is in fowards momentum  
            this.engine.value-=this.engine.step*0.75;
        }
        //rotate sprite based on rudder value
        this.setRotation(this.rotation+this.rudder.value);
        //save bounce vector before overwriting it
        if(this.bounced){
            this.BounceVec.x =  this.body.velocity.x;
            this.BounceVec.y =  this.body.velocity.y;
            this.bounced = false;
        }
        //propel player in the direction that player is facing by the value of engine 
        //and added bounce vector after collision 
        this.setVelocityX(this.BounceVec.x+  Math.sin(this.rotation) * this.engine.value);
        this.setVelocityY(this.BounceVec.y+ -Math.cos(this.rotation) * this.engine.value);
        //values drag
        this.rudder.value*=0.95;
        this.engine.value*=0.995;
        this.BounceVec.x*=0.95;
        this.BounceVec.y*=0.95;
    }
    //collision procedure
    oncollision(data)
    {
        //colided object data
        const {bodyA} = data;

        //get bounce value on the next frame
        this.gameObject.bounced=true;
        //reset players momentum
        this.gameObject.engine.value=0;
        //ignore collision damage if under speed       
        if(this.gameObject.body.speed>5){
            
            //health deduction is speed*2 rounded down
            this.gameObject.health-=Math.floor(this.gameObject.body.speed*2)
            //destroys hit object if its type = rock
            if (bodyA.gameObject)
                if (bodyA.gameObject.getData('type') === 'rock')
                    bodyA.gameObject.shipCollision();
                
        }
        //console.log(this.gameObject.health)
        //console.log(this.gameObject.body.speed)
    }
}