import Phaser from 'phaser'

export default class rock extends Phaser.Physics.Matter.Image {
    /**
     * @param {Phaser.Scene} scene 
     */
constructor(scene,x,y,chunk,ID)
{
    super(
    scene.matter.world, x, y,'iceBerg',null,{isStatic:true,key: ID}
    );
    this.setScale(1.5)
    this.setBody({
        type:'circle',
        radius: this.width*0.70
        
    },{isStatic:true,key: ID})
    //set meta data
    this.setData('type','rock');
    this.ID=ID;
    //occupied chunk
    this.chunk=chunk;
    //add rock to world
    scene.matter.world.scene.add.existing(this);
    //console.log(this.x,this.y,this.ID)
    this.setTint(0x2F4F4F)
    this.texture.setFilter(Phaser.ScaleModes.NEAREST)
    this.setAngle(Phaser.Math.Angle.RandomDegrees())
}
//collision with ship
shipCollision(){
    //fade out and destroy
    this.scene.tweens.add ({
        targets: this,
        alpha: 0,
        duration: 300,
        ease: 'Power2',
        onComplete: () =>{this.relocate()}
        
    });
}
//change location of this rock
relocate(){
    let p=this.scene.place(40)
    this.chunk.occupied=false

    this.x=p.x
    this.y=p.y
    this.chunk=p.chunk
    this.setAlpha(1)
}
    

}