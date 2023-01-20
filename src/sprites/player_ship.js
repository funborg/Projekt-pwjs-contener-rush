import Phaser from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';
import events from '../helpers/Events';


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
        this.helm={
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
        if(this.health<=0){
            //game crashes if it's destroyeeed
            //this.destroy();
            this.health=0
            this.engine.value=0;
            return;
        }
        //emit signal for interaction with current position every half second
        if(this.scene.input.keyboard.checkDown(keys.interact,500)){
            this.scene.events.emit(events.INTERACT,this.x,this.y)
        }



        //swivel helm
        if ((keys.right.isDown && this.helm.value<this.helm.max) 
        || (keys.break.isDown && this.helm.value<-this.helm.step)){
            //rotate right if right key is held up to limit
            //or straigthens if breaks are held down rotates towards left 
            this.helm.value+=this.helm.step;
        }else if ((keys.left.isDown && this.helm.value>-this.helm.max) 
        || (keys.break.isDown && this.helm.value>this.helm.step))
            //rotate left if left key is held up to limit
            //or straigthens if breaks are held down rotates towards right 
            this.helm.value-=this.helm.step;



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


        //rotate sprite based on helm value
        this.setRotation(this.rotation+this.helm.value);
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
        this.helm.value=    this.fade(this.helm.value   ,0.95, this.helm.step/2)
        this.engine.value=  this.fade(this.engine.value ,0.995,this.engine.step/2)
        this.BounceVec.x=   this.fade(this.BounceVec.x  ,0.95, this.engine.step/2)
        this.BounceVec.y=   this.fade(this.BounceVec.y  ,0.95, this.engine.step/2)

    }
    fade(currval,strength,min){
        //multiplies value by strength this function works only if 0<strength>1
        currval*=strength;
        //if under minimal value set to zero
        if(currval<min&&currval>-min)
            currval=0
        return currval
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
            //emit singal for health change with current health
            this.gameObject.scene.events.emit(events.HEALTH_CHANGE,this.gameObject.health)
            //destroys hit object if its type = rock
            if (bodyA.gameObject)
                if (bodyA.gameObject.getData('type') === 'rock')
                    bodyA.gameObject.shipCollision();
                
        }
    }
}