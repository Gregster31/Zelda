import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Tile from "./Tile.js";
import Player from "../entities/Player.js";
import Pot from './Pot.js';
import Hitbox from "../../lib/Hitbox.js";


export default class Heart extends GameObject {
	static FULL_HEART = 4;
	static HALF_HEART = 2;
	static EMPTY_HEART = 0;
	static HEART_WIDTH = Tile.TILE_SIZE;
	static HEART_HEIGHT = Tile.TILE_SIZE;
    static FULL_HEART_REGEN = 2;

    constructor(dimensions, position, room) {
        super(dimensions, position);

		this.isConsumable = true;
		this.isCollidable = true;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			Heart.HEART_WIDTH,
			Heart.HEART_HEIGHT
		);

		this.currentFrame = Heart.FULL_HEART;

        this.room = room;
    }

    onCollision(collider) {
		super.onCollision(collider);

		if (collider instanceof Player) {
            // Consumes the heart making it disappear
            this.wasConsumed = true;
            // Adds life to the player
            collider.addLife(Heart.FULL_HEART_REGEN)
		}
	}
}