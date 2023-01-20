import Phaser from 'phaser'

export default class UiScene extends Phaser.Scene
{
    constructor()
    {
        super({key: 'Uiscene',active:true},"game");
    }
    create()
    {
        //get main game data
        this.gamescene = this.scene.get('GameScene');
        //health bar creation
        this.health = new HealthBar(this,50,this.game.scale.gameSize.height-90, 300,45)
        //temoray static 
        this.timer = this.add.text(30, 20, 'time: 0', { font: '48px Arial', fill: '#0040FF' });
        //listen for health changes
        this.gamescene.events.on('health_change',hp=>{
            this.health.hp = hp;
            this.health.draw();
        })


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