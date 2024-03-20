

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



var score = 0;
var scoreText;
var gameOver = false;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('fondoretro', 'assets/fondoretro.jpg');
    this.load.image("barra", "assets/barra.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star","assets/star.png");
    this.load.image("bomb","assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png",{frameWidth : 32,frameHeight:48});
}

function create() {
    this.add.image(config.width / 2, config.height / 2, 'fondoretro');
    

    platforms = this.physics.add.staticGroup();

    platforms.create(500,500,"barra");
    platforms.create(60,450,"barra");
    platforms.create(750,420,"barra");
    platforms.create(600,420,"barra");
    platforms.create(250,420,"barra");
    platforms.create(120,550, "barra"); 
    platforms.create(400,268,"barra");
    platforms.create(500,200,"barra");
    platforms.create(60,150,"barra");
    platforms.create(750,320,"barra");
    platforms.create(600,120,"barra");
    platforms.create(250,120,"barra");
    platforms.create(120,350, "barra"); 
    platforms.create(400,368,"barra");
 

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
   

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs,platforms);

    this.physics.add.collider(player,bombs,hitBomb,null,this);
}

function update() {
    if (gameOver){
        finalText = this.add.text(200,300,"score: 0", {fontSize:"40px", fill :"dark"});
        finalText.setText("GAME OVER : "+ score)
        return;

    }
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
    player.setVelocityY(-250);
}

}

function collectStart(player,star){
    star.disableBody(true,true)  
    
    score +=10;
    scoreText.setText("Score : "+ score)

    if(stars.countActive(true) ===0){
        stars.children.iterate(function(child) {
            child.enableBody(true,child.x,0,true,true);
        });
        var x = (player.x<400) ? Phaser.Math.Between(400,800) : Phaser.Math.Between(0,400)
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200,200),20);
    }


}

function hitBomb(player,bomb){

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}
