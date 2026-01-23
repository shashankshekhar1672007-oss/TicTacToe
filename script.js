let boxes = document.querySelectorAll(".text");
let result = document.querySelector(".result");
console.log(boxes);
let ox = "X";
const win = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
for(let i=0; i<9; i++){

}

boxes.forEach((box)=>{
    box.addEventListener("click", ()=>{
        console.log("Clicked");
        box.innerText = ox;
        if(ox==="X") ox="O";
        else ox = "X";
        box.disabled = true;
        checkWinner();
    });
});

const checkWinner = ()=>{
    for(i of win){
        let a = boxes[i[0]].innerText;
        let b = boxes[i[1]].innerText; 
        let c = boxes[i[2]].innerText;
        if(a=="X" && b=="X" && c=="X"){
            showResult("X");
        }
        if(a=="O" && b=="O" && c=="O"){
            showResult("O");
        }
    }
};
const showResult = (winner)=>{
    result.innerText = "Winner is: "+ winner;
    boxes.forEach((box)=>{
        box.disabled = true;
    });
};