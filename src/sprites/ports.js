import Phaser, { GameObjects, Tweens } from 'phaser'
import AssetsKeys from '../helpers/AssetsKeys';
import Events from '../helpers/Events';

//port origin
export default class port extends Phaser.Physics.Matter.Image {
    /**
     * @param {Phaser.Scene} scene 
     */
    constructor(scene, x, y, chunk, ID, color = 0xFFFFFF) {
        super(
            scene.matter.world, x, y, 'port', null, { isStatic: true, key: ID }
        );
        //set meta data
        this.setData('type', 'portA');
        this.color = color
        this.setTint(this.color)
        this.HasPackage = true;
        this.satisfied = false;
        this.ID = ID
        //occupied chunk
        this.chunk = chunk;

        //interact area 
        //should be invisible in realese
        this.InteractArea = new Phaser.GameObjects.Rectangle
            (this.scene, this.x, this.y, this.width * 3.5, this.height * 3.5, 0x00ff00, 0.5)
        scene.matter.world.scene.add.existing(this.InteractArea)
        //item
        this.item = new Phaser.GameObjects.Image(scene, x, y - this.height, 'container')
        this.item.setAngle(90)
        this.item.setAlpha(0.66)
        this.item.setTint(this.color)
        scene.matter.world.scene.add.existing(this.item);

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
        scene.matter.world.scene.add.existing(this);

        //listen for interaction
        this.scene.events.on('interact', (ship) => this.interact(ship))
        //adding brother

        this.loadContain = this.scene.sound.add('loadContainer', { volume: 0.5 });
        this.delivContain = this.scene.sound.add('delivContainer', { volume: 0.5 });
        this.addbrother(this.scene, color)
    }
    addbrother(scene, color) {

        //adds packege destination
        let p = scene.place(40)
        this.brother = new portB(scene, p.x, p.y, p.chunk, this.ID, color, this)
    }

    fadeout() {
        this.satisfied = true
        this.scene.tweens.add({
            targets: [this, this.InteractArea, this.item],
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => { this.relocate() }
        });

    }
    //change location of it's objects,resets and reappear
    relocate() {
        let p = this.scene.place(this.height / 2)
        this.x = p.x
        this.y = p.y
        this.setAlpha(1)
        this.InteractArea.x = p.x
        this.InteractArea.y = p.y
        this.InteractArea.setAlpha(1)
        this.item.setX(p.x)
        this.item.setY(p.y - this.height)
        this.item.setVisible(!this.item.visible)
        this.item.setAlpha(0.66)
        this.HasPackage = !this.HasPackage
        this.satisfied = false
    }
    interact(ship) {
        //if ship is close by
        if (this.InteractArea.getBounds().contains(ship.x, ship.y)) {

            if (this.HasPackage) {
                //place packege in first aviable place
                for (let i = 0; i < ship.inventory.length; i++)
                    if (ship.inventory[i] == -1) {
                        ship.inventory[i] = this.ID
                        this.HasPackage = false
                        this.scene.events.emit(Events.PACKAGE_EXCHANGE, this.ID, ship.inventory, this.color)
                        this.item.setVisible(false)
                        this.loadContain.play()
                        break;
                    }
            } else {
                //remove macthing packege from ships inventory
                for (let i = 0; i < ship.inventory.length; i++)
                    if (ship.inventory[i] == this.ID) {
                        ship.inventory[i] = -1
                        this.HasPackage = true
                        this.scene.events.emit(Events.PACKAGE_EXCHANGE, this.ID, ship.inventory, this.color)
                        this.item.setVisible(true)
                        this.loadContain.play()
                        break;
                    }
            }



        }
    }


}
//port destination
class portB extends port {
    constructor(scene, x, y, chunk, ID, color, port) {
        super(scene, x, y, chunk, ID, color);
        this.setData('type', 'portB');
        this.HasPackage = false;
        this.brother = port
        this.item.setAlpha(0)
        this.scene.events.on('package_exchange', (ID) => this.completeDelivery(ID))
    }
    //overwrite addbrother function to prevent stack overflow
    addbrother() { }
    relocate() {
        super.relocate()
        this.scene.events.emit(Events.PACKAGE_EXCHANGE, this.ID, this.scene.ship.inventory, this.color)

        this.scene.events.emit(Events.COMPLETED_DELIVERY, this.ID)
    }
    //fade out itself and  it's brother
    fadeout() {
        this.brother.fadeout()
        super.fadeout()
    }

    completeDelivery(ID) {
        //check if delivery was completed
        if (this.ID === ID && this.HasPackage) {
            this.delivContain.play()
            this.fadeout()
        }
    }


}

