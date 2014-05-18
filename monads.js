var rs = [1, 2].map(function(i) {
    return [3, 4].map(function(j) {
       return i + j
    })
})


var one2 = [1, 2, 3].map (function (p){
   return  "This is your number : " + p
})


bind = function(ma, func){
 var first = parseInt(ma,10);
 return func(first);
}

unit = function (a){
    return a.toString();
}
