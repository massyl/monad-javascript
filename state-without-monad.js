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
    return {value:undefined, stack:newstack};
};

/*
 * Pop function that not mutate the Stack
 */
var pop = function (stack){
    var value = stack[0];
    var newStack = stack.slice(1);
    return {value:value, stack:newStack};
};

/*
 * Some operations with stacks
 */
var initialStack = [];
var result0 = push(1, initialStack);
var result1 = push(2, result0.stack);
var result2 = pop(result0.stack);
var result3 = pop(result1.stack);
