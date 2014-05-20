
///////////////////////////////////////////////////////////////////////
// Implementing List Monad
//////////////////////////////////////////////////////////////////////

var inject = function(value){ return [value];};

var bind   = function(ma, fn){
    return concatMap(fn)(ma);
};


/*
 * Curried implementation of concatMap.
 * concatMap = (a -> [b]) -> [a] -> [b]
 */
var concatMap = function(fn){
    return function(list){
        if(list.length === 0) return [];
        else return fn(list[0]).concat(concatMap(fn)(list.slice(1)));
    };
};

var test = bind(["hele", "hol", "lililili"], function(xs){ return [xs.length];});
