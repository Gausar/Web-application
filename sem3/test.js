// console.log(document.body.firstChild.nodeType);
// console.log(document.body.firstChild.nextSibling.firstChild.textContent);
var btnChange = document.getElementById("btnChange");
btnChange.onclick = clickBtn;
var btnClear = document.getElementById("btnClear");
btnClear.addEventListener('click',function(){ 
    document.getElementById("p1").innerHTML = "";
});
function clickBtn(){
    var p = document.getElementById("p1");
    p.innerHTML = "<i>important</i>"
}

document.addEventListener('click', function(event){
    if(event.target.classList.contains('btn')){
        clicked(event.target);
    }
});

function clicked(btn) {
    var btn_val = btn.innerText;
    document.getElementById("display").innerHTML = btn_val;
}
// document.getElementById("b1").addEventListener("click", function(){
//   document.getElementById("display").innerHTML = "1";
// });
// document.getElementById("b2").addEventListener("click", function(){
//   document.getElementById("display").innerHTML = "2";
// });
// document.getElementById("b3").addEventListener("click", function(){
//   document.getElementById("display").innerHTML = "3";
// });