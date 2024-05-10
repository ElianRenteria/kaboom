import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";
// start the game
kaboom({
    background: [40, 40, 40],
})

// load a default sprite
loadBean()

let score = 0;

scene("game", () => {
    // define gravity
    score = 0;
    setGravity(1600)
    const scoreLabel = add([
        text(score),
        pos(24, 24)
    ]);
    // increment score every frame
    onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });
    // add character to screen, from a list of components
    const player = add([
        sprite("bean"),  // renders as a sprite
        pos(120, 80),    // position in world
        area(),          // has a collider
        body(),          // responds to physics and gravity
    ])

    // add platform
    add([
        rect(width(), 48),
        pos(0, height() - 48),
        outline(4),
        area(),
        body({ isStatic: true }),
        color(127, 200, 255),
    ])

    // add tree
    function spawnTree() {
        add([
            // add tree
            rect(48, rand(24, 64)),
            area(),
            outline(4),
            pos(width(), height() - 48),
            anchor("botleft"),
            color(255, 180, 255),
            move(LEFT, 240),
            "tree", // add a tag here
        ]);
        wait(rand(0.5, 1.5), () => {
            spawnTree();
        });
    }

    spawnTree();

    // jump when player presses "space" key
    onKeyPress("space", () => {
        // .jump() is provided by the body() component
        player.jump()
    })

    player.onCollide("tree", () => {
        addKaboom(player.pos);
        shake();
        go("gameOver");
    });
});

scene("gameOver", () => {
    add([
        sprite("bean"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);
    add([
        text("Press Space to Restart"),
        pos(width() / 2, 200),
        scale(1),
        anchor("center"),
    ]);


    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("game")
