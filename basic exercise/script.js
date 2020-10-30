var bombsNum = 16;
var size = 100;
var bombsArray=[];
var pickedNums = [];

function generateBombs(n , max){
  for(i=0; i < n ; i++){
    var bomb = Math.floor(Math.random() * max)+1;
    bombsArray.includes(bomb) ? i-- : bombsArray.push(bomb);
  }
  console.log(bombsArray);
}

function game(){
  bombsArray=[];
  pickedNums = [];
  var end = false;
  generateBombs(bombsNum,size);
  while(end === false){
    var userPick= parseInt(prompt('inserisci un numero'));
    if (userPick <= 100 && userPick > 0 && isNaN(userPick)=== false){
      if(pickedNums.includes(userPick) === false){
        if(bombsArray.includes(userPick)){
          alert('Hai perso,hai totalizzato ' + pickedNums.length + ' punti');
          end = true;
          game();
        }
        else{
          pickedNums.push(userPick)
          console.log(pickedNums)
          if (pickedNums.length === (size - bombsNum)){
            alert('hai vinto');
            end = true;
            game();
          }
        }
      }else{
        alert('numero gia inserito');
      }
    }else{
      alert('inserisci un numero da 1 a 100');
    }
  }
};


game();
