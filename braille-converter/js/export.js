function myCanvas() {
    var canva = document.getElementById("myCanvas");
    var imglen = document.querySelectorAll(".brailleImg").length;
    var sizewid = imglen;
    var sizehei = 1;
    var tempwid = imglen;
    if(imglen>10){
        sizewid = 10;
    }
    while(tempwid>10){
        sizehei+=1;
        tempwid-=10;
    }
    var hei_loop = 0;
    var wid = (sizewid * 344) + 400;
    canva.width = wid;
    canva.height = 500 * sizehei;
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var imgs = document.querySelectorAll(".brailleImg");
    for (let i = 0; i < imgs.length; i++) {
        if (imgs.length <= 10) {
            const img = imgs[i];
            ctx.drawImage(img, (i * 344) + 10, 10);
        }
        else{
            var j = i;
            
            if((j/10)-1>=hei_loop){
                hei_loop+=1;
            }
            const img = imgs[i];
            ctx.drawImage(img, ((i%10) * 344) + 10, (hei_loop*500)+10);
            
        }
    }
}