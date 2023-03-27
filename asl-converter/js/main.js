function annotate(){
  var typed= document.getElementById("fname").value;
  document.getElementById("printchatbox").innerHTML= typed;
}
setInterval(annotate, 1000);
