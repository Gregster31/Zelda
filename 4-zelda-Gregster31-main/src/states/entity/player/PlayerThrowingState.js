import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import Direction from '../../../enums/Direction.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import { input, timer } from '../../../globals.js';
import Input from '../../../../lib/Input.js';
import Easing from '../../../../lib/Easing.js';
import Room from '../../../objects/Room.js';
import Slime from '../../../entities/enemies/Slime.js';
import Skeleton from '../../../entities/enemies/Skeleton.js';
import Heart from '../../../objects/Heart.js';
import Vector from '../../../../lib/Vector.js';
import { getRandomPositiveInteger } from '../../../../lib/Random.js';

export default class PlayerThrowingState extends State {
    /**
     * Handles the state where the player lifts a pot.
     *
     * @param {Player} player
     */
    constructor(player) {
        super();
        this.player = player;

        this.animation = {
			[Direction.Up]: new Animation([8, 7, 6], 0.2, 1),
			[Direction.Down]: new Animation([2, 1, 0], 0.2, 1),
			[Direction.Right]: new Animation([5, 4, 3], 0.2, 1),
			[Direction.Left]: new Animation([11, 10, 9], 0.2, 1),
		};
    }

    enter() {
        this.player.sprites = this.player.throwingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    
        this.throwPot();
        if (this.player.direction == Direction.Down) {
            setTimeout(() => {
                this.player.liftedPot.isSolid = true; 
            }, 1000);
        } else {
            this.player.liftedPot.isSolid = true; 
        }
    }
    
    

    exit() {
        this.player.positionOffset = { x: 0, y: 0 };
    }

    update() {
        if (this.player.currentAnimation.isDone()) {
            this.player.currentAnimation.refresh();
            this.player.stateMachine.change(PlayerStateName.Walking);
        }
    }

    throwPot() {
        const potOffsetX = (this.player.dimensions.x - this.player.liftedPot.dimensions.x) / 2;
        const THROW_DISTANCE = 80;
        let targetX = null;
        let targetY = null;
    
        if (this.player.direction === 0) { 
            targetY = this.player.position.y - THROW_DISTANCE;         
            targetX = this.player.position.x + potOffsetX;
        } else if (this.player.direction === 1) {
            targetY = this.player.position.y + THROW_DISTANCE;         
            targetX = this.player.position.x + potOffsetX;
        } else if (this.player.direction === 2) {
            targetY = this.player.position.y;         
            targetX = this.player.position.x - THROW_DISTANCE + potOffsetX;
        } else if (this.player.direction === 3) { 
            targetY = this.player.position.y;         
            targetX = this.player.position.x + THROW_DISTANCE + potOffsetX;
        }
    
        const duration = 0.3; 
        const steps = 30; 
        const stepDuration = duration / steps;
        const deltaX = (targetX - this.player.liftedPot.position.x) / steps;
        const deltaY = (targetY - this.player.liftedPot.position.y) / steps;
    
        let currentStep = 0;
    
        const tweenInterval = setInterval(() => {
            this.player.liftedPot.position.x += deltaX;
            this.player.liftedPot.position.y += deltaY;
    
            this.player.liftedPot.hitbox.set(
                this.player.liftedPot.position.x + this.player.liftedPot.hitboxOffsets.position.x,
                this.player.liftedPot.position.y + this.player.liftedPot.hitboxOffsets.position.y,
                this.player.liftedPot.dimensions.x + this.player.liftedPot.hitboxOffsets.dimensions.x,
                this.player.liftedPot.dimensions.y + this.player.liftedPot.hitboxOffsets.dimensions.y
            );
    
            if (this.player.liftedPot.position.x < Room.LEFT_EDGE ||
                this.player.liftedPot.position.x + this.player.liftedPot.dimensions.x > Room.RIGHT_EDGE ||
                this.player.liftedPot.position.y < Room.TOP_EDGE ||
                this.player.liftedPot.position.y > Room.BOTTOM_EDGE) {
                this.player.liftedPot.changePotToBroken();
                clearInterval(tweenInterval);
                return; 
            }
    
            for (const entity of this.player.room.entities) {
                if ((entity instanceof Slime || entity instanceof Skeleton) && this.player.liftedPot.didCollideWithEntity(entity.hitbox)) {
                    this.player.liftedPot.changePotToBroken();
                    entity.receiveDamage(this.player.damage);
                    if(getRandomPositiveInteger(1,5) == 1) {
                        this.player.room.objects.push(
                            new Heart(
                                new Vector(Heart.HEART_WIDTH, Heart.HEART_HEIGHT),
                                new Vector(entity.position.x, entity.position.y),
                                this
                        ));
                    }
                    clearInterval(tweenInterval);
                    return; 
                }
            }
    
            currentStep++;
            if (currentStep >= steps) {
                clearInterval(tweenInterval);
                this.player.liftedPot.position.x = targetX;
                this.player.liftedPot.position.y = targetY;
                this.player.liftedPot.changePotToBroken();

            }
        }, stepDuration * 1000);
    }    
    
}