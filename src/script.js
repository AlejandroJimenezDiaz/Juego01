

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics:{
        default :"arcade",
            arcade: {
                gravity : {y:300},
                debug : false
            }

    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

var score = 0;
var scoreText;

function preload() {
    this.load.image('fondoretro', 'assets/fondoretro.jpg');
    this.load.image("barra", "assets/barra.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star","assets/star.png");
    this.load.image("bomb","assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png",{frameWidth : 32,frameHeight:48});
}

function create() {
    this.add.image(400, 300, 'fondoretro');
    

    platforms = this.physics.add.staticGroup();

    platforms.create(400,568,"barra");
    platforms.create(600,400,"barra");
    platforms.create(50,250,"barra");
    platforms.create(750,220,"barra");
    platforms.create(120,550, "barra");

    player = this.physics.add.sprite(100,450,"dude");

    player.setCollideWorldBounds(true)
    player.setBounce(0.3);

    this.anims.create({
        key : "left",
        frames : this.anims.generateFrameNumbers("dude",{start:0, end : 3}),
        frameRete: 8,
        repeat : -1
    });
    this.anims.create({
        key : "turn",
        frames : [{key :"dude",frame :4}],
        frameRete: 10,
    });
    this.anims.create({
        key : "right",
        frames : this.anims.generateFrameNumbers("dude",{start:5, end : 8}),
        frameRete: 8,
        repeat : -1
    });

   // player.body.setGravityY(300);

    this.physics.add.collider(player,platforms);


    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: "star",
        repeat : 11,
        setXY: {x :12, y:0,stepX: 70}
    });

    stars.children.iterate(function(child){
        child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
    });

    this.physics.add.collider(stars,platforms)

    this.physics.add.overlap(player,stars,collectStart,null,true)

    scoreText = this.add.text(16,16,"score: 0", {fontSize:"32px", fill :"white"});
}

function update() {

    if(cursors.left.isDown){
        player.setVelocityX(-160);
        player.anims.play("left",true);
    }else if(cursors.right.isDown){
        player.setVelocityX(160);
        player.anims.play("right",true);
    }else{
        player.setVelocityX(0);
        player.anims.play("turn",true);
    }
    
if(cursors.up.isDown && player.body.touching.down){
    player.setVelocityY(-230);
}

}

function collectStart(player,star){
    star.disableBody(true,true)  
    
    score +=10;
    scoreText.setText("Score : "+ score)
}
