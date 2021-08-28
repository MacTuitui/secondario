let mario = [];
let num_frames = 7;
let frame=0;
let frame_index=0;
let scaleMario=0.75;
const FACE_LEFT=0;
const FACE_RIGHT=1;
let state=FACE_RIGHT;
let speedx=0;
let posx=0;
let prex=posx;
let posy=100;
let prey=posy;
let speedy=0;
let timeLeft=0;
let scrollx=0;
let AIRBORNE=true;
let level;
let MAX_SPEED=10;
let ACCELERATION=0.3;
let bLEFT=false;
let bRIGHT=false;
let bUP=false;
let bDead=true;
let win_x=0;
let mode=0;
const TITLE=0;
const LEVEL=1;
const WIN=2;
const END=3;
//
let messages= [];
let levelsTexts=[];
let levelsImages=[];
let  currentlevel=0;
let  hasStarted=false;
let  start=0;
let score=0;
let fontnumbers;
let fonttext;
let b1;
let b2;
let maxLevels=10;
let death;
let jump;
let bgm;

function preload() {
    console.log("pre");
    //mario = new PImage[num_frames];
    mario[0]=loadImage('assets/stand.png');
    mario[1]=loadImage('assets/walk1.png');
    mario[2]=loadImage('assets/walk2.png');
    mario[3]=loadImage('assets/walk3.png');
    mario[4]=loadImage('assets/skid.png');
    mario[5]=loadImage('assets/jump.png');
    mario[6]=loadImage('assets/dead.png');
    for(var i=0;i<maxLevels;i++){
        levelsTexts[i]=loadStrings('assets/level'+(i+1)+'.txt');
        levelsImages[i]=loadImage('assets/level'+(i+1)+'.png');
    }
    b1=loadImage('assets/cloud.png');
    b2=loadImage('assets/block.png');
    fonttext = loadFont('assets/BD_Cartoon_Shout.ttf');
    fontnumbers = loadFont('assets/digital-7-mono.ttf');
    death = loadSound('assets/death.wav');
    jump = loadSound('assets/jump.wav');
    soundFormats('mp3', 'ogg');
    bgm = loadSound('assets/Madtea-Oxigen_64kb');


}

function setup() {
      getAudioContext().suspend();

    createCanvas(640, 480);
    // put setup code here
    textAlign(CENTER);
    rectMode(CORNER);
    newLevel();
    start=millis()+10000;
    mode=0;
}
function newLevel(){
  score+=timeLeft;
  hasStarted=false;
  posx=0;
  posy=0;
  if(currentlevel<maxLevels){
   level=new Level(currentlevel);
   messages=levelsTexts[currentlevel];
   win_x=level.src.width*20 - 200;
   mode=1;
   scaleMario=0.75;
   start=millis()+10000;
   currentlevel++;
   speedx=0;
  } else {
    //file does not exist:
    //all levels done;
    //WIN GAME
    mode=3;
  }


}

function draw() {
  if (mode==0){
    //title
    background(0);
    fill(255);
    textFont(fonttext);
    text("Secondario",width/2,100);
    textSize(40);
    text("Mushroom Overdose",width/2,150);
    textSize(22);
    text("A game by Alexis Andre",width/2,height-100);
    text("imposs.ible.jp - alexisandre.com",width/2,height-60);
  } else if(mode==3){
    background(0);
    fill(255);
    textFont(fonttext);
    text("You WON!",width/2,100);
    textSize(30);
    text("Final Score: "+nf(score*100,4,-1),width/2,200);
    textSize(22);
    text("Press r to restart",width/2,height-160);
    text("A game by Alexis Andre",width/2,height-100);
    text("imposs.ible.jp - alexisandre.com",width/2,height-60);
  }else {

  let now= millis();
  if((posx>300)&&!hasStarted){
     start=millis()+10000;
     hasStarted=true;
  }

  if(mode!=2&&!bDead)timeLeft = (start-now)/1000.0;
  if(!hasStarted)timeLeft=10;
  if(timeLeft<0){
    if(!bDead)death.play();
    bDead=true;

    timeLeft=0;
  }
  let  sf = nf(timeLeft,2,2);
  //println(sf);
  textFont(fontnumbers);
  if(!bDead&&hasStarted&&mode!=2){
    scaleMario=(start-now)/500.0*0.25+0.25;
    scaleMario=6-scaleMario;
    if(scaleMario>10){
      start=now+10000;
    }//scaleMario=4;
//    println(scaleMario);
  }
  //if(scaleMario>5)start=now;
  MAX_SPEED=scaleMario*10;
  background(0,0,255);

  translate(-posx+200,0);
  fill(0);
  rect(-500,0,800,height);
  rect(win_x,0,800,height);
  fill(255);
  if(posx<500){
    for(var i=0;i<messages.length;++i){
      text(messages[i],100,100+30*i);
    }
    text("Score: "+nf(score*100,4,-1),100,130+30*messages.length);
  }
  resetMatrix();

  fill(255,0,0);
  /*
  scale(1,1);
  image(level1.src,0,0);*/
  resetMatrix();

  noStroke();
  // translate(-posx+220,0);
  //  scale(20,20);
  //image(level1.src,0,0);
  level.draw(posx-200);
  resetMatrix();
  if(mode==2){
    textFont(fonttext);
    textSize(47);
    fill(255);
    text("Congratulations!",width/2,150);
  }
  textFont(fontnumbers);
    textSize(36);
  fill(255,0,0);
  if((timeLeft*1000)%1000<20)fill(255);
  if(mode==2)fill(255);
  text(sf,width/2,30);
  translate(-posx+200,0);

  if(!bDead){

    if(bUP&&!AIRBORNE){
      if(mode==1)jump.play();
      AIRBORNE=true;
      //println("jump");
      speedy=-13;
    }
    if(!bRIGHT&&!bLEFT&&!AIRBORNE)speedx*=0.95;
    if(bRIGHT&&!AIRBORNE){
      speedx+=ACCELERATION;
      speedx=min(speedx,MAX_SPEED);
    }
    if(bLEFT&&!AIRBORNE){
      speedx-=ACCELERATION;
      speedx=max(speedx,-1*MAX_SPEED);
    }
    if(bLEFT&&AIRBORNE){
      speedx-=ACCELERATION*0.3;
      speedx=max(speedx,-1*MAX_SPEED);
    }
    if(bRIGHT&&AIRBORNE){
      speedx+=ACCELERATION*0.3;
      speedx=min(speedx,MAX_SPEED);
    }
    if(bUP&&AIRBORNE&&speedy<0){
      speedy-=0.7;
    }
  } else {
    speedx=0;
    speedy=0;
    AIRBORNE=false;
  }

  posx+=speedx;
  if(AIRBORNE)speedy+=1.6;
  posy+=speedy;


  if(posx<=0){
    posx=1;
    speedx=0;
  };
  let size_mario=int(18*scaleMario);
  if((posx+size_mario)>win_x){
    //speedx=0;
    //WIN
    mode=2;

    if((posx+size_mario)>win_x+200) {
      posx=win_x+200-size_mario;
      speedx=0;
    }
  };


  noFill();
  noStroke();
  //logic
 if(speedx>0)
  {
    //going right
    let x1=int((prex+2)/20);
    let x2=int((posx+size_mario+1)/20);
    let y2=int((prey-1)/20);
    let y1=int((prey-size_mario+2)/20);
    let xx=-1;
    for(var i=x2;i>=x1;--i){
      for(var j=y1;j<=y2;++j){
        if(!level.check(i,j)){
          //d.msg("blockright");
          if(xx==-1)xx=i;
          speedx=0;
          //put the player below y
          posx=xx*20-size_mario-1;
          break;
        }
      }
    }
  }
  else if(speedx<0)
  {
    //going left
    let x1=int((posx)/20);
    let x2=int((prex+size_mario)/20);
    let y2=int((prey-1)/20);
    let y1=int((prey-size_mario+2)/20);
    let xx=-1;
    for(var i=x1;i<=x2;++i){
      for(var j=y1;j<=y2;++j){
        if(!level.check(i,j)){
          //d.msg("blockleft");
          if(xx==-1)xx=i;

          speedx=0;
          //put the player below y
          posx=xx*20+19;
          break;
        }
      }
    }
  }





  if(speedy>0){
    //falling
    //check the blocks below
    let x1=int((prex+2)/20);
    let x2=int((prex+size_mario)/20);
    let y2=int(posy/20);
    let y1=int(prey/20);
    let yy=-1;
    for(var y=y1;y<=y2;++y){
      for(var i=x1;i<=x2;++i){
        if(!level.check(i,y)){
          //d.msg("blockdown");
          if(yy==-1)yy=y;
          AIRBORNE=false;
          speedy=0;
          //put the player above y
          posy=yy*20;
          break;
        }
      }
    }
  }
  else if(speedy<0){
    //going up
    let x1=int((prex+3)/20);
    let x2=int((prex+size_mario)/20);
    let y2=int((prey-size_mario)/20);
    let y1=int((posy-size_mario)/20);
    let yy=-1;

    for(var y=y1;y<=y2;++y){
       for(var i=x1;i<=x2;++i){
         if(!level.check(i,y)){
          //d.msg("blockup");
          if(yy==-1)yy=y;

          speedy=0;
          //put the player below y
          posy=yy*20+20+size_mario;
          break;
        }
      }
    }
  }

  if(!AIRBORNE){
    //look for holes
    var x1=int((posx+2)/20);
    var x2=int((posx+size_mario)/20);
    var y1=int((prey)/20);
    let ok=false;
    for(var i=x1;i<=x2;++i){
      if(!level.check(i,y1)) ok=true;
    }
    if(!ok)AIRBORNE=true;
  }


  //can mario fit in here?
  //(sametime left and right)

   noFill();


  //when growing check the blocks on the right
  {
    let x2=int((posx+size_mario+1)/20);
    let y2=int((prey-1)/20);
    let y1=int((prey-size_mario+2)/20);
    let xx=-1;

    let hasRight=false;
    for(var j=y1;j<=y2;++j){
      if(!level.check(x2,j)){
        //d.msg("blockright");
         if(xx==-1)xx=x2;
          speedx=0;
          //put the player below y
          posx=xx*20-size_mario-2;
        hasRight=true;
        break;
      }
    }

    if(hasRight){
       //check left
      x2=int((posx+1)/20);
      for(var j=y1;j<=y2;++j){
        if(!level.check(x2,j)){
         //d.msg("blockleft " + x2 + " " + j);
          if(!bDead)death.play();
          bDead=true;

          break;
        }
      }
    }

     fill(0,60);
    //check up down
    let x1=int((posx+2)/20);
    x2=int((posx+size_mario)/20);
    y2=int(posy/20);

    let hasDown=false;
      for(var i=x1;i<=x2;++i){
        if(!level.check(i,y2)){
         //d.msg("blockdown");
         hasDown=true;
          break;
        }
      }
      if(hasDown){
        y2=int((posy-size_mario)/20);
        for(var i=x1;i<=x2;++i){
          if(!level.check(i,y2)){
            //d.msg("blockup");
            if(!bDead)death.play();
            bDead=true;

            break;
          }
        }
      }
    }


 if((posy)>height-1){
   if(!bDead)death.play();
    bDead=true;
  }





  //RENDERING
  translate(prex,prey);
  scale(scaleMario, scaleMario);
  if(bDead){
    image(mario[6],0,0-18);
  } else {
    frame+=abs(speedx*0.2);
    frame_index=int((frame)%3);
    if(AIRBORNE){
      switch(state){
      default:
      case FACE_RIGHT:
        image(mario[5],0,0-18);
        break;
      case FACE_LEFT:
        scale(-1,1);
        image(mario[5],-18,0-18);
        break;
      }
    }
    else if(abs(speedx)>0.03){
      if(speedx>0){
        if(bLEFT&&!bRIGHT){
          //skid
          state = FACE_LEFT;
          speedx-=0.1;
          scale(-1,1);
          image(mario[4],-0-18,0-18);
        }
        else {
          state = FACE_RIGHT;
          image(mario[frame_index+1],0,0-18);
        }
      }
      else {
        if(!bLEFT&&bRIGHT){
          //skid
          speedx+=0.1;
          state = FACE_RIGHT;
          image(mario[4],0,0-18);
        }
        else {
          scale(-1,1);
          state = FACE_LEFT;
          image(mario[frame_index+1],-0-18,0-18);
        }
      }
    }
    else {
      //stand
      switch(state){
      default:
      case FACE_RIGHT:
        image(mario[0],0,0-18);
        break;
      case FACE_LEFT:
        scale(-1,1);
        image(mario[0],-0-18,0-18);
        break;
      }
    }
  }

  /*
  resetMatrix();
   translate(-prex+200,0);
   translate(prex,prey);
   scale(scaleMario,scaleMario);
   noFill();
   stroke(255,0,0);
   rect(0,-18,18,18);
   resetMatrix();
  */
  prex=posx;
  prey=posy;

 // d.draw();
  }

}

class Level{
    //based on a PImage (would be better with extends but...)
    constructor(i){
        this.src = levelsImages[i];
        this.src.loadPixels();
        console.log(this.src);
    }

    isOk(x,y){
        //fill(255);
        // rect(x-5,y-5,10,10);
        let xx= int((x)/20);
        let yy= int((y)/20);
        //fill(10,50);
        rect(xx*20,yy*20,20,20);
        let c = this.src.pixels[4*(yy*src.width+xx)];

        //println("checking " + xx + " " + yy + " -> "+hex(c));
        if (c==255)
            return true;
        return false;
    }
    check(x,y){
        // fill(10,50);
        //rect(x*20,y*20,20,20);
        if(y<0)return true;
        if(y>23)return true;
        let c=color(255);
        if((x>=0)&&(x<this.src.width)){
            c = this.src.pixels[4*(y*this.src.width+x)];
        }
        //println("checking " + xx + " " + yy + " -> "+hex(c));
        if (c==255){
            return true;
        } else {
            return false;
        }
    }

    draw(fx){
        let ofset=int(fx/20);
        if(fx<0)ofset--;
        push();
        //println(ofset);
        translate(-(fx-ofset*20),0);
        for(var i=ofset;i<33+ofset;++i){
            for(var j=0;j<24;++j){
                let c=255;
                if(j==23&&i<0)c=0;
                if((i>=0)&&(i<this.src.width))
                    c = this.src.pixels[4*(j*this.src.width+i)];


                if(c!=255)
                    image(b2,(i-ofset)*20,j*20);
            }
        }
        pop();

    }

}



function keyPressed(){
    userStartAudio();
    if(bgm.isLooping()==false) bgm.loop();
    if(key =='a' || keyCode == LEFT_ARROW){
        bLEFT=true;
    } else if(key =='d' || keyCode == RIGHT_ARROW){
        bRIGHT=true;
    } else if(key =='w' || keyCode == UP_ARROW || key == ' '){
        bUP=true;
        if(bDead){
            //reset
            start=millis()+10000;
            bDead=false;
            prex=posx=0;
            prey=posy=100;
            hasStarted=false;
            scaleMario=0.75;
            bUP=false;
            mode=1;
        }
        if(mode==2){
            bUP=false;
            newLevel();
        }
    } else if(key =='r'){
        if(mode==3){
            start=millis()+10000;
            bDead=false;
            prex=posx=0;
            prey=posy=100;
            hasStarted=false;
            scaleMario=0.75;
            bUP=false;
            mode=1;
            currentlevel=0;
            score=0;
            timeLeft=0;
            newLevel();
        } else {
            if(!bDead)death.play();
            bDead=true;
        }
    }
}

function keyReleased(){
    if(key =='a' || keyCode == LEFT_ARROW){
        bLEFT=false;
    } else if(key =='d' || keyCode == RIGHT_ARROW){
        bRIGHT=false;
    } else if(key =='w' || keyCode == UP_ARROW || key == ' '){
        bUP=false;
    }
}

