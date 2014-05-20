/*
 * Simulation of maybe monad (from Haskell) in javascript.
 * The type monad will be encoded by a function that return an object
 * With either Just property or Nothing.
 * data Maybe a = Nothing | Just a
 */

Nothing = {Nothing : 'Nothing'};
Just = function(a){ return {Just : a}; };

var Maybe = function(a) {
    if (a === undefined) return Nothing;
    else return Just(a);
};


/*
 * Inject implementation for maybe monad
 * Note that we can inject Nothing
 */
var inject = function(value){ return Just(value);};

/*
 * Bind implementation for maybe monad
 */
var bind = function(ma, fmb){
    if(equals(ma , Nothing)) return Nothing;
    else return fmb(ma.Just);

};

/*
 * Handy equals function. Is used for our defined objects
 */
var equals = function(obj, other){
  if(other === undefined) return obj === undefined;
  else if (obj.hasOwnProperty('Just')){
         return obj.Just  === other.Just ;
  }else if(obj.hasOwnProperty('Nothing')){
      return (obj.Nothing === other.Nothing);
 }else return obj === other;
};


/*
 * Some testes
 */
test = bind(inject(2), function(value){return inject(value + 3);});

test2 = bind(test, function(value){ return inject(value / 2) ;});

/*
 * court-circut the computation as it encounters Nothing
 */
test3 = bind(Nothing, function(value){return value + 3;});
var isNothing = test3.hasOwnProperty('Nothing');
var isJust = test3.hasOwnProperty('Just');

/*
 * More complex combination
 */

test4 = bind(test3, function(value){ return inject(value + 10);});
var mustbeNothing = test4.hasOwnProperty('Nothing');
