/*
 * Monad simulation in JS. We rely on Function Object type to
 * Simulate Haskell type constructor with one parameter (m a) with a function
 * that takes one parameter (function(value){})
 */

/*
 * Push function that do not mutate the Stack
 */
var push = function (value, stack){
    var newstack = [value].concat(stack);
    return inject({value:undefined, stack:newstack});
};

/*
 * Pop function that not mutate the Stack
 */
var pop = function (stack){
    var value = stack[0];
    var newStack = stack.slice(1);
    return inject({value:value, stack:newStack});
};

/*
 * The Corresponding Haskell bind funtion (>>=)
 * It takes a monadic value `ma` unwraps it and then passes
 * the resulting value to the continuation function `mf`
 */
var bind = function(ma, mf){
    return mf(ma());
};

/*
 * The unit element of a Monad. It is the equivalent of Haskell return function
 */
var inject = function(value){
    return function(){
        return value;
    };
};

/*
 * Some operations with stacks
 */
var initialStack = [];
var result0 = push(1, initialStack);
var result1 = push(2, result0.stack);
var result2 = pop(result0.stack);
var result3 = pop(result1.stack);

/*
 * Using bind operation to chain computations.
 * Manually threading state (stack) during succession of computations
 *
 */
var computation = bind(push(1, initialStack), function(rs0){
    return bind(push(2, rs0.stack), function (rs1){
        return bind(pop(rs0.stack), function (rs2){
            return bind(pop(rs1.stack),function (rs4){
                return inject(rs2.value + " : "+ rs4.value) ;
            });
        });
    });
});
