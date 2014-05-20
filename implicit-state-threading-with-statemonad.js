////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Monad simulation in JS. We rely on Function Object type to
 * Simulate Haskell type constructor with one parameter (m a) with a function
 * that takes one parameter (function(value){})
 */


/*
 * Making the Stack an instance of Monad, By implementing bind and inject.
 * The Corresponding Haskell bind funtion (>>=)
 * It takes a monadic value `ma` unwraps it and then passes
 * the resulting value to the continuation function `mf`
 * Here m a <=> function(stack){ {value:value, stack:stack}} (a = {value:value, stack:stack})
 */
var bind = function(ma, mf){
    return function(stack){
        var result = ma(stack)();
        return mf(result.value)(result.stack);
    };
};

/*
 * The unit element of a Monad. It is the equivalent of Haskell return function
 */
var inject = function(value){
    return function(stack){
        return function(){return {value:value, stack:stack};};
    };
};

/*
 * Like bind() function but discards the result of the first computation.
 * It is the equivalent of Haskell (>>)
 */
var bind_ = function(ma, mb){
    return bind(ma, function(){ return mb;});
};

/*
 * Some Monad State handy functions
 */

/*
 * Runs the computation with the initialState and then return (finalResult,finalState)
 */
var runState   = function (stateComputation, initialState){
    return stateComputation(initialState)();
};

/*
 * Runs the computation with the initialState and return just the finalResult.It discards the finalState
 */
var evalState = function(stateComputation, initialState){
    var result = stateComputation(initialState)();
    return result.value;
};


/*
 * Runs the computation with the initialState and return just the finalState. It discards the finalResult.
 */
var execState = function(stateComputation, initialState){
    var result = stateComputation(initialState)();
    return result.stack;
};

////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Stack implementation based on Monads.
 */

/*
 * Push function that do not mutate the Stack
 */
var push = function (value){
    return function(stack){
        var newStack = [value].concat(stack);
        return inject(undefined)(newStack);
    };
};

/*
 * Pop function that not mutate the Stack
 */
var pop = function (){
    return function(stack){
        var value = stack[0];
        var newStack = stack.slice(1);
        return inject(value)(newStack);
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 * Using bind operation to chain computations.
 * Manually threading state (stack) during succession of computations
 *
 */
var computation1 = bind(push(1), function(Nothing1){
    return bind(push(2), function(Nothing2){
      return bind(pop(), function(value1){
        return bind(pop(), function(value2){
          return inject(value2 + " : "+ value1);
        });
      });
    });
});


var computation2 = bind(push(3), function(Nothing1){
    return bind(push(4), function(Nothing2){
        return bind(pop(), function(value1){
            return bind(pop(), function(value2){
                return bind(push(5), function(Nothing3){
                    return inject(value2 + " : "+ value1);
                }) ;
            });
        });
    });
});

/*
 * Some Monads computation sequencing
 * push(5) >> push(6) >> push(7) >> push(8) >> push(9)
 */

var comp3 = bind_(push(5), bind_(push(6), bind_(push(7), bind_(push(8), push(9)))));

/*
 * Composite computation, that combines two composite computations.
 * Note that we use the same way to compose even more complex computations.
 */

var compositeComputation = bind(computation1, function(value1){
    return bind(computation2, function(value2){
        return inject(value1.concat(" : ").concat(value2));
    });
});

var state = [];
var compositeResult = runState(compositeComputation, state);

////////////////////////////////////////////////////////////////////////////////////////////////////

/*
 * Handy helper functions. Inspired by the same functions in Haskell
 *
 */
/*
 * Simple map implementation
 */
var map = function(list, fn){
    var result = [];
    for(var i=0; i< list.length; i++){
        result.push(fn(list[i])());
    }
    return result;
};

/*
 * Sequence : is a function that takes a list of Monadic actions, runs them in sequence,
 * Gathers the result of each and then returns a Single Monadic action that holds the result
 * of each action. It's the equivalent of Haskell sequence action.
 */
// var sequence = function(computations){return computations.reduce(bind_);};
var sequence = function(computations){
    var acc  = computations[0];
    var list = computations.slice(1);
    return foldl(combine)(acc)(list);
};

/*
 * Executes two actions and returns an object that holds the result of each action.
 */
 var combine = function(ma, mb){
     return bind(ma, function(v1){
         return bind(mb, function(v2){
              return inject([v1].concat(v2));
         });});
 };

 var sequence_ = function(computations){
     var acc = computations[0];
     var list= computations.slice(1);
     return foldl(combine_)(acc)(list);
 };

 var combine_ = function(ma, mb){
     return bind_(bind_(ma, mb), inject(undefined));
 };

 //Test
 var ca = function(a){ return function(b){ return inject(a + b);};};
 var ma = sequence([ca(1)(2), ca(4)(5)]);
 var mb = sequence([push(5), push(6), push(7), push(8), push(9)]);
 var mc = sequence_([push(5), push(6), push(7), push(8), pop()]);

 var execSeq = function(a){
     return function(result){
        var rs = a();
         return inject([rs.value].concat(result))(rs.stack);
     };
 };

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
  * Maps a function `fn` (a -> m a) throw a list of pure values and then sequence the resulting
  * monadic actions to gather and return the list of result.
  */
 var mapM = function(list, fn){
     return sequence(map(list, fn));
 };

 ////////////////////////////////////////////////////////////////////////////////////////////////////
 // Reverse polish calculator implementation using State Monad.
 // Note the computational aspect of all operations.
 // Note also the lack of explicit state threading
 ////////////////////////////////////////////////////////////////////////////////////////////////////

 var evaluate = function(expression){
     return mapM(expression.split(' '), reverseCalculator);
 };

 /*
  * Function that relies on State Monad to do its work.
  * It takes a `op` parameter that can be an binary operation or an operand.
  * If the `op` parameter represent a binary operation, it pops 2 values from the State and then push the result
  * of applying this operation to the popped values, otherwise if it is a simple value(operand), it just pushes it.
  */

 var ops = ['+', '*', '-', '/'];
 var reverseCalculator = function(op){
     return function(){
         if(ops.indexOf(op) !== -1){
            return  bind(pop(), function(value1){
                 return bind(pop(), function(value2){
                     return push(eval(value1 +  op +  value2));
                 });
             });
         }else {
             return push(op);
         };
     };
 } ;

 /*
  * Some computations expressed using functions defined above.
  *
  */
 var initialState = [];
 var op = reverseCalculator("*");

 var operand1 = reverseCalculator(4);
 var operand2 = reverseCalculator(9);
 var compute = bind_(bind_(operand1(), operand2()), op());
 var calculationResult = runState(compute, initialState);

 /*
  * Test of the Reverse Polish calculator
  *
  */
 var calculation = evaluate("1 2 + 3 5 * + 10 -");
 var result = runState(calculation, initialState);
 var resultValue = execState(calculation, initialState);
n
