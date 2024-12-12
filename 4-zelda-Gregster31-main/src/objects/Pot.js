import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds } from "../globals.js";
import Tile from "./Tile.js";
import { context, DEBUG, input} from "../globals.js";
import Player from "../entities/Player.js";
import Hitbox from "../../lib/Hitbox.js";
import Input from '../../lib/Input.js';
import PlayerStateName from '../enums/PlayerStateName.js';
import Direction from "../enums/Direction.js";
import Animation from "../../lib/Animation.js";
import SoundName from "../enums/SoundName.js";

export default class Pot extends GameObject {
    static WIDTH = Tile.TILE_SIZE;
	static HEIGHT = Tile.TILE_SIZE;

    constructor(dimensions, position, room) {
        super(dimensions, position);
        
        this.isSolid = true;
		this.isCollidable = true;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Pots),
			Pot.WIDTH * 2,
			Pot.HEIGHT * 2
		);

        this.currentFrame = 8; // To change which pot you want

        this.room = room;

        this.hitboxOffsets = new Hitbox(0,0,0,-8);
		this.hitbox = new Hitbox(
			this.position.x + this.hitboxOffsets.position.x,
			this.position.y + this.hitboxOffsets.position.y,
			this.dimensions.x + this.hitboxOffsets.dimensions.x,
			this.dimensions.y + this.hitboxOffsets.dimensions.y,
            'green'
		);

		this.potBreakAnimation = new Animation([9,10,11], 0.2, 1);
		this.currentAnimation = null;
		this.wasConsumed = false;
    }

	render() {
		const x = this.position.x - 8;
		const y = this.position.y - 24;

		if (this.currentAnimation) {
            this.currentFrame = this.currentAnimation.getCurrentFrame();
        }

        this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y));
		if (DEBUG) {
			this.hitbox.render(context);
		}
	}

	update(dt) {
        if (this.currentAnimation) {
            this.currentAnimation.update(dt);

            if (this.currentAnimation.isDone()) {
				this.deletePot()
                this.currentAnimation = null;
                this.currentFrame = 11;
            }
        }
    }

    changePotToBroken() {
        // console.log("Pot is breaking...");
        this.currentAnimation = this.potBreakAnimation;
		sounds.play(SoundName.Shatter);
    }

	deletePot() {
		this.wasConsumed = true; 
		this.isSolid = false;
	}
}