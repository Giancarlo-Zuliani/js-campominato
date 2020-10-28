
// GLOBAL VARIABLES
var bombArray=[];
var field = document.querySelector('main');
var activeBlocks;
var blockNum;
var disabled = [];
var flags;
var flagged = [];
var reset;
var left = 0;
var bombInside = document.getElementById('bombsleft');
var spaceLeft = document.getElementById('spaceleft');

// IMAGES
var flagTag = '<img src="resources/flag.svg" class="flag hidden" alt="">';
var bomb = '<img src="resources/bomb-solid.svg" class="flag" alt="">';

// SOUND
var bombSound = new Audio ('resources/Bomb.mp3');
var victorySound = new Audio ('resources/fanfare.mp3');
var shovelSound = new Audio ('resources/shovel.wav');
var put = new Audio ('resources/put.wav');

bombSound.volume = 0.05;
shovelSound.volume = 0.15;
put.volume = 0.4;

//FIELD  GENERATOR

document.getElementById('buildbutton').addEventListener('click', function(){
  bombArray = [];
  disabled = [];
  flagged = [];
  //WIN/LOSE BANNER ADD TO HTML
  field.innerHTML='<div id="losebanner"><h1>U LOSE</h1><button type="button" id="reset" name="button" onclick="location.reload()"  >again?!</button></div>';
  field.innerHTML += '<div id="winbanner" class="hidden"><h1>WINNER WINNER CHICKEN DINNER</h1><button type="button" id="again"  onclick="location.reload()"  name="button">Again?!</button></div>';
  field.style.border = "solid #4B5320 8px";
  field.style.borderRadius = "7px";
  //GENERATE BLOCKS
  blockNum = document.getElementById('blocknumsel').value;
  for(var i = 0 ; i < blockNum ; i++){
    var child = document.createElement('div');
    child.setAttribute("oncontextmenu" , 'rightClick('+ i +')');
    child.setAttribute("onclick" , 'check(' + i +')');
    child.setAttribute("class" , "square");
    child.innerHTML = flagTag;
    field.appendChild(child);
  }
  //GENERATE BOMBS
  var level = document.getElementById('level').value;
  generateBombs(blockNum , level);
  activeBlocks = document.querySelectorAll('.square');
  flags = document.querySelectorAll('.flag');
  // PREVENT RIGHT CLICK DROPDOWN MENU
  for(i=0; i < activeBlocks.length ; i++){
    activeBlocks[i].addEventListener('contextmenu', event => event.preventDefault());
  }
  // INFOS SHOW AND WRITE
  document.getElementById('infos').classList.toggle('hidden');
  bombInside.innerHTML = 'there are ' + bombArray.length + ' bombs in the field';
  spaceLeft.innerHTML = (blockNum - bombArray.length) + ' space left';
});


// FUNCTION FOR BOMB GENERATION

function generateBombs(block , level){
  var num = (block / 100) * level;
  for(var i = 0 ; i < num.toFixed(0) ; i++){
    var bomb = Math.floor(Math.random() * block) ;
    bombArray.includes(bomb) ? i-- : bombArray.push(bomb);
  }
}

//CHECK IF WE'VE CLICKED  A BOMB

function check(square){
  if(disabled.includes(square) === false && flagged.includes(square) === false){
    shovelSound.play();
    if(bombArray.includes(square)){
      setTimeout(function(){
        activeBlocks[square].innerHTML = bomb;
        bombSound.play();
        showBombs();
        document.getElementById('losebanner').style.display = "flex";
      },300);
    }else{
      disabled.push(square);
      nearBomb(square);
      winCheck();
    }
  }
}

//THIS FUNCTION DETERMINATE WITCH ARRAY WE ARE GONA USE FOR FIND NEAR BOMBS

function nearBomb(square){
  var near = 0 ;
  if(square >= 0 && square < blockNum){
    if((square + 1 ) % 20 === 0){
      near =  countNear(countArrayRight , square);
    }else if(square % 20 === 0){
      near =  countNear(countArrayLeft , square);
    }else{
      near = countNear(countArrayCenter , square);
    }
    activeBlocks[square].innerHTML = near;
    activeBlocks[square].style.color = nearColor(near);
  }
}

// ARRAY FOR FIND NEAR BOMBS

var countArrayCenter = [1,20,21,19,-20,-21,-19,-1];
var countArrayLeft = [1,20,21,-20,-19];
var countArrayRight = [-1,-20,-21,20,19];

//FUNCTION FOR COUNT HOW MANY BOMBS THERE ARE NEAR

function countNear(arr , init){
  var count = 0;
  var y = init;
  for(var i = 0 ; i<arr.length ; i++){
    var x = y + arr[i];
    if(bombArray.includes(x)){
      count++;
    }
  }
  if(count === 0){
    for(var i = 0 ; i<arr.length ; i++ ){
      var x = y + arr[i];
      if (x >= 0 && x < blockNum){
        check(x);
      }
    }
  }
  return count;
}


//NUMBER COLOR

function nearColor(x){
  if(x === 0){
    return "blue";
  }else if (x > 0 && x < 3){
    return "yellow";
  }else if(x >= 3 &&  x < 5){
    return "crimson";
  }else{
    return "purple";
  }
}


//IN CASE OF BOMB PICK SHOW ALL BOMBS IN THE FIELD

function showBombs(){
  for (i = 0; i < bombArray.length; i++){
    var x = bombArray[i];
    activeBlocks[x].innerHTML = bomb;
  }
}

// FUNCTION FOR PUT FLAGS WITH RIGHT CLICK;

function rightClick(square){
  if(disabled.includes(square) === false){
    put.play();
    flags[square].classList.toggle('hidden');
    if( flagged.includes(square) === false){
      flagged.push(square);
    }else{
      var x = flagged.indexOf(square);
      flagged.splice(x);
    }
  }
}

// CHECK IF COMPLETE

function winCheck(){
  var sum = blockNum - bombArray.length;
  left++;
    spaceLeft.innerHTML = sum - left + 'space left';
    if(disabled.length === sum){
    setTimeout(function(){
      document.getElementById('winbanner').style.display = "flex";
      victorySound.play();
    },300);
  }
}

//CHEAT

function cheat(){
  for(i=0; i <= blockNum; i++){
    check(i);
  }
}

//KEYBINDING CHEAT CODE

document.onkeyup = function(){
  var evt = window.event;
  if (evt.keyCode == 67 && evt.ctrlKey) {
    cheat();
  }
}
