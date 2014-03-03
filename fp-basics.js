/*
 * Implementation of some higher order functions in JavaScript
 * First there is an imperative implementation and then an
 * alternative recursive one.
 */

/*
 * mapIter maps a function throw a list of values.
 * It is not curried and uses for loop internally
 */
var mapIter = function(list, fn){
    var result = [];
    for(var i=0; i< list.length; i++){
        result.push(fn(list[i]));
    }
    return result;
};

var mapped = mapIter ([1,2], function(a){ return "mapped " + a;});

/*
 * filterIter filters a list of values using a specified predicate.
 * It is not curried and uses a for loop
 */
var filterIter = function(list, predicate){
    var result = [];
    for(var i=0; i< list.length; i++){
        if(predicate(list[i])){
            result.push(list[i]);
        };
    };
    return result;
};

var uncurriedFoldL = function(f, acc, list){
    if(list.length == 0) return acc;
    else{
        var newAcc = f(acc, list[0]);
        return uncurriedFoldL(f, newAcc,list.slice(1));
    }
};

var r = uncurriedFoldL([1,2,3], function(a,b){ return a+b;}, 0);

var uncurriedFoldR = function(f, acc, list){
    if(list.length === 0) return acc;
    else{
        var first = list[0];
        return f(first, uncurriedFoldR(f, acc, list.slice(1)));
    }
};


var concatinate = function(list1, list2){return list1.concat(list2);};
var test1 = uncurriedFoldR(concatinate, [4,5],[[1],[2],[3]]);
var test2 = uncurriedFoldL(concatinate,[4,5],[[1],[2],[3]]);

/*
 * Curried implementation of foldl
 * foldl = (a -> b-> a)-> a -> [b] -> a
 */

var foldl = function(f){
    return function(acc){
        return function(list){
            if(list.length === 0) return acc;
            else{
                var newAcc = f(acc, list[0]);
                return foldl(f)(newAcc)(list.slice(1));
            }
        };
    };
};

/*
 * Curried implementation of foldr
 * foldr = (a -> b-> b)-> b -> [a] -> b
 */
var foldr = function(f){
    return function(acc){
        return function(list){
            if(list.length === 0) return acc;
            else{
                var first = list[0];
                return f(first, foldr(f)(acc)(list.slice(1)));
            }
        };
    };
};

var test3 = foldr(concatinate)([4,5])([[1],[2],[3]]);
var test4 = foldl(concatinate)([4,5])([[1],[2],[3]]);

/*
 * Curried implementation of map using foldr.
 * map = (a -> b) -> [a] -> [b]
 */
var map = function(f){
    return function(list){
        return foldr(function(a, acc){
            return f(a).concat(acc);
        })([])(list);
    };
};

/*
 * Curried implementation of filter using foldr
 * filter = (a -> Bool) -> [a] -> [a]
 */
var filter = function(predicate){
    return function(list){
        return foldr(function(a, acc){
            if(predicate(a)){ return acc.concat(a);}
            else return acc;
        })([])(list);
    };
};


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

/*
 * Function composition.
 * comp = (b -> c) -> (a -> b) -> a -> c
 */
var comp = function(f, g){
    return function(x){
        return g(f(x));
    };
};

/*
 * repeat takes a value and returns a list of the same value with
 * list.length = value.
 * repeat 3 = [3,3,3]
 * repeat 5 = [5,5,5,5,5]
 */
var repeat = function(value){
    var result = [];
    for(var i=0; i< value; i++){
        result.push(value);
    };
    return result;
};
