import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import Direction from '../../../enums/Direction.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import { input, timer } from '../../../globals.js';
import Input from '../../../../lib/Input.js';
import Easing from '../../../../lib/Easing.js';

export default class PlayerLiftingState extends State {
    /**
     * Handles the state where the player lifts a pot.
     *
     * @param {Player} player
     */
    constructor(player) {
        super();
        this.player = player;

        this.animation = {
			[Direction.Up]: new Animation([6, 7, 8], 0.2, 1),
			[Direction.Down]: new Animation([0, 1, 2], 0.2, 1),
			[Direction.Right]: new Animation([3, 4, 5], 0.2, 1),
			[Direction.Left]: new Animation([9, 10, 11], 0.2, 1),
		};
    }

    enter() {
        this.player.sprites = this.player.liftingSprites;
        this.player.currentAnimation = this.animation[this.player.direction];
    
        // Disable the pot's collision and start tweening it above the player’s head.
        this.player.liftedPot.isSolid = false;
        this.tweenPotToHead();
    }
    

    exit() {
        this.player.positionOffset = { x: 0, y: 0 };
    }

    update() {
        if (this.player.currentAnimation.isDone()) {
            this.player.currentAnimation.refresh();
            this.player.stateMachine.change(PlayerStateName.Carrying);
        }
    }

    /**
     * Tween the pot's position to appear above the player's head.
     */
    tweenPotToHead() {
        const potOffsetX = (this.player.dimensions.x - this.player.liftedPot.dimensions.x) / 2;
        const targetX = this.player.position.x + potOffsetX;
    
        const targetY = this.player.position.y + 4;         
    
        timer.tween(
            this.player.liftedPot.position,
            { x: targetX, y: targetY },
            0.3,
            Easing.linear,
            () => {                
                this.player.liftedPot.position.x = targetX;
                this.player.liftedPot.position.y = targetY;
            }
        );
    }
}