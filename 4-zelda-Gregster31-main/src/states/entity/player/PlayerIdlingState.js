import Animation from '../../../../lib/Animation.js';
import State from '../../../../lib/State.js';
import Player from '../../../entities/Player.js';
import Direction from '../../../enums/Direction.js';
import PlayerStateName from '../../../enums/PlayerStateName.js';
import { input } from '../../../globals.js';
import Input from '../../../../lib/Input.js';
import Pot from '../../../objects/Pot.js';

export default class PlayerIdlingState extends State {
	/**
	 * In this state, the player is stationary unless
	 * a directional key or the spacebar is pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([8], 1),
			[Direction.Down]: new Animation([0], 1),
			[Direction.Left]: new Animation([12], 1),
			[Direction.Right]: new Animation([4], 1),
		};
	}

	enter() {
		this.player.sprites = this.player.walkingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update() {
		this.checkForMovement();
		this.checkForSwordSwing();
		this.checkPotLift();
	}

	checkForMovement() {
		if (input.isKeyPressed(Input.KEYS.S)) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.D)) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.W)) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.Walking);
		} else if (input.isKeyPressed(Input.KEYS.A)) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.Walking);
		}
	}

	checkForSwordSwing() {
		if (input.isKeyPressed(Input.KEYS.SPACE)) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}

	checkPotLift() {
		if (input.isKeyPressed(Input.KEYS.ENTER) || input.isKeyPressed(Input.KEYS.E)) {
			this.player.room.objects.forEach((object) => {
				if (object instanceof Pot && object.didCollideWithEntity(this.player.hitbox)
				&& this.goodDirection(object)) {
					this.player.liftedPot = object;
					this.player.changeState(PlayerStateName.Lifting, this.player.liftedPot);
				}
			})
		}
	}

	goodDirection(object) {
		// Had to do this because direction of the player and direction where obj is hit is confusing
		const oppositeDirections = {
			0: 1,
			1: 0, 
			2: 3,
			3: 2 
		};
		const objDirection = object.getEntityCollisionDirection(this.player.hitbox);
		return this.player.direction === oppositeDirections[objDirection];
	}
	 
}
