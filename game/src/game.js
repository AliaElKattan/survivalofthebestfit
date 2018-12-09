import * as PIXI from "pixi.js";

import { Howl, Howler } from "howler";
import keyboard from "./keyboard";
import hitTestRectangle from "./hit_test";

let guy_image_path = require("../images/guy.png");
// import guy_image_path from "../images/guy.jpg";
import displace_path from "../images/displace_big.png";
import fran_image_path from "../images/fran.png";
import fran_1_image_path from "../images/fran_1.png";
import fran_2_image_path from "../images/fran_2.png";
import fran_3_image_path from "../images/fran_3.png";
import line_image_path from "../images/line.png";
import carrot_image_path from "../images/carrot.png";
import pole_image_path from "../images/pole.png";
import blank_image_path from "../images/blank.gif";

import clink_sound_path from "../audio/glass_clink.mp3";

let image_paths = [
  guy_image_path,
  displace_path,
  fran_image_path,
  line_image_path,
  carrot_image_path,
  fran_1_image_path,
  fran_2_image_path,
  fran_3_image_path,
  pole_image_path,
  blank_image_path
];

export default class Game {
  constructor(parent_element) {
    // this.app = new PIXI.Application({ width: 400, height: 700 });
    this.app = new PIXI.Application({ width: 600, height: 400 });

    // just for hmr, so we don't get infinite
    parent_element.innerHTML = "";

    //Add the canvas that Pixi automatically created for you to the HTML document
    parent_element.appendChild(this.app.view);

    // make it full page
    this.app.renderer.view.style.position = "absolute";
    this.app.renderer.view.style.display = "block";
    this.app.renderer.view.style.width = window.innerWidth + "px";
    this.app.renderer.view.style.height = window.innerHeight + "px";

    this.app.renderer.backgroundColor = 0xffffff;

    this.container = new PIXI.Container();
    this.app.stage.addChild(this.container);
    this.setup_sprites = this.setup_sprites.bind(this);
    this.game_loop = this.game_loop.bind(this);
    this.state = {};
    // this.setup_sprites();
    // cheap hack for hmr
    if (!PIXI.loader.resources[guy_image_path]) {
      PIXI.loader.add(image_paths).load(this.setup_sprites);
    } else {
      this.setup_sprites();
      // console.log("!");
    }
  }
  setup_sprites() {
    // declare the variable for our sprite, so we can use it in both functions below

    let tilingSprite = new PIXI.extras.TilingSprite(
      PIXI.loader.resources[line_image_path].texture,
      this.app.screen.width,
      // this.app.screen.height
      this.app.screen.height + 100
    );
    tilingSprite.x = -400;
    tilingSprite.scale.x = 3;
    tilingSprite.anchor.x = 0.5;
    // tilingSprite.y = 300;
    // tilingSprite.scale.y = 1.5;
    // tilingSprite.addChild(pole);
    this.container.addChild(tilingSprite);

    // console.log(this.container);
    let guy = new PIXI.Sprite(PIXI.loader.resources[guy_image_path].texture);
    let carrot = new PIXI.Sprite(
      PIXI.loader.resources[carrot_image_path].texture
    );
    let pole = new PIXI.Sprite(PIXI.loader.resources[pole_image_path].texture);
    // fran = new PIXI.Sprite(PIXI.loader.resources[fran_image_path].texture);
    let fran_textures = [
      PIXI.loader.resources[fran_1_image_path].texture,
      PIXI.loader.resources[fran_2_image_path].texture,
      PIXI.loader.resources[fran_3_image_path].texture
    ];

    this.container.addChild(carrot);
    this.container.addChild(pole);
    this.container.addChild(guy);
    let fran = new PIXI.extras.AnimatedSprite(fran_textures);
    this.container.addChild(fran);

    fran.y = 600;
    fran.x = 450;
    fran.vx = 0;
    fran.vy = 0;
    fran.anchor.set(0.5);
    fran.scale.set(0.35);
    // fran.scale.set(0.5);
    fran.animationSpeed = 0.15;

    fran.play();

    guy.anchor.set(0.5);
    guy.x = 800;
    // guy.scale.set(5);
    guy.scale.set(3);
    guy.rotation = 0.4;

    carrot.anchor.set(0.5);
    carrot.scale.set(0.25);
    carrot.x = 200;
    carrot.y = 150;
    // guy.scale.x = 0.5;
    // guy.scale.y = 0.5;

    pole.anchor.set(0.5);
    pole.scale.x = 0.5;
    pole.scale.y = 0.75;
    pole.x = 750;
    pole.y = -250;
    pole.rotation = 0.1;

    this.sprites = { fran, pole, carrot, tilingSprite, guy };

    //Capture the keyboard arrow keys
    let left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);

    left.press = () => {
      fran.vx = -3;
      fran.animationSpeed = 0.3;
    };
    right.press = () => {
      fran.vx = 3;
      fran.animationSpeed = 0.3;
    };
    up.press = () => {
      fran.vy = -1;
      fran.animationSpeed = 0.3;
    };
    down.press = () => {
      fran.vy = 1;
      fran.animationSpeed = 0;
    };

    left.release = () => {
      fran.vx = 0;
      fran.animationSpeed = 0.15;
      // console.log("left arrow key pressed");
    };
    right.release = left.release;

    down.release = () => {
      fran.vy = 0;
      fran.animationSpeed = 0.15;
    };
    up.release = down.release;

    // this.container.interactive = true;
    this.app.stage.interactive = true;
    // mouse + touch too
    // this.container.on("pointerdown", event => {
    this.app.stage.on("pointerdown", event => {
      let x_dif = event.data.global.x - this.sprites.fran.x;
      let y_dif = event.data.global.y - this.sprites.fran.y;
      if (Math.abs(x_dif) < Math.abs(y_dif)) {
        y_dif < 0 ? up.press() : down.press();
      } else {
        x_dif < 0 ? left.press() : right.press();
      }
    });
    this.app.stage.on("pointerup", event => {
      fran.animationSpeed = 0.15;
      fran.vx = 0;
      fran.vy = 0;
    });

    // add the warp effect, comment out to disable
    this.add_filters(this.container);

    this.app.ticker.add(delta => this.game_loop(delta));
  }

  add_filters(base) {
    var displacementSprite = PIXI.Sprite.fromImage(displace_path);
    var displacementFilter = new PIXI.filters.DisplacementFilter(
      displacementSprite
    );

    base.addChild(displacementSprite);
    // this.app.stage.addChild(displacementSprite);

    let color_filter = new PIXI.filters.ColorMatrixFilter();
    // color_filter.lsd(true);
    base.filters = [displacementFilter, color_filter];

    let warp_scale = 700;
    // let warp_scale = 1;

    // this one sets the intensity of the effect, not the size
    displacementFilter.scale.x = warp_scale;
    displacementFilter.scale.y = warp_scale;

    displacementSprite.anchor.set(0.5);
    displacementSprite.x = 400;
    displacementSprite.y = 600;
    // this one effects the size (but also the intensity, as it's over a larger area)
    displacementSprite.scale.x = 2.5;
    displacementSprite.scale.y = 2.5;
  }

  game_loop(delta) {
    let { fran, pole, carrot, tilingSprite, guy } = this.sprites;

    // guy.y += 1;
    let fran_movement = Math.min(0, fran.vy) * 2;
    guy.y += 2 - fran_movement;
    carrot.y += 1 - fran_movement;
    fran.x += fran.vx;
    fran.y += fran.vy;
    tilingSprite.tilePosition.y -= fran_movement;
    tilingSprite.tilePosition.y += 1;

    // this makes it even crazier, rotate everything
    // container.rotation += fran.vx / 500;

    pole.y += 1 - fran_movement;

    if (pole.y > 1200) {
      pole.y = -150;
      let r = Math.random();
      pole.x = r > 0.5 ? r * 200 : this.app.screen.width - r * 200;
      pole.rotation = r > 0.5 ? -0.1 : 0.1;
    }
    if (carrot.y > 800) {
      carrot.y = 0;
      carrot.x = Math.random() * this.app.screen.width;
      carrot.rotation = Math.random() > 0.5 ? 0 : 3.14;
      carrot.visible = true;
    }
    if (guy.y > 2000) {
      guy.y = -200;
      let r = Math.random();
      guy.x = r > 0.5 ? r * 100 : this.app.screen.width - r * 100;
      guy.rotation = r > 0.5 ? -0.3 : 0.3;
    }

    if (hitTestRectangle(fran, carrot)) {
      if (carrot.visible) {
        carrot.visible = false;
        console.log("hit");
        // clink_sound.play();
      }
      fran.tint = 0xffa500;
    } else {
      // console.log(fran.tint);
      // no tint
      fran.tint = 16777215;
    }

    // fran.x += 1;
  }
}
