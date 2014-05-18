% Monads in JavaScript
% Massyl Nait Mouloud, Architect/Developer at Sfeir
% 3 Mars 2014



# Functional programming history

* First high-level FP language Lisp (McCarthy), developed in the late 1950s

* Lisp the seed for functional languages family

* Haskell originally designed in the late 1980s (Hudak, Wadler, 1988), inspired by languages developed by David Turner in the early 1980s.

Named after the logician Haskell B. Curry, with Alonzo Church, established the theoretical foundations of functional programming (Lambda Calculus)


# Introduction

- Functional programs works with VALUES not STATE. Their tools are EXPRESSIONS not COMMANDS

- Immutability is the backbone of all FP programs.

# Reminders

## Currying

## Higher order functions


# Advanced functional programming techniques (Monad, Functor, Applicative ...)

## Introduction

- The functional programming community divides into two camps. Pure languages such as Haskell, and impure languages such as ML, Scheme.
  Pure languages are easier to reason about and may benefit from lazy evaluation. Impure languages in the other hand offer efficiency benefits
  and sometimes make possible a more compact mode of expression


## Pure function and explicit data flow

- One of the big advantage of pure languages is making the flow of the data explicit.

- Explicit data flow ensures that the value of an expression depends only on its free variables.
  Hence substitution of equals to equals(reference transparency) is valid (easy to reason about such programs).

- Explicit data flow also ensures that the order of evaluations are irrelevant, making lazy evaluation possible.

- Sometimes, when managing state for instance, it becomes really painful to thread explicitly the intermediate state.

## Monad to rescue

- The concept of monad came from Category theory, and applied by Moggi to structure the denotational semantics of programming languages.

### Definitions

- Monads offer a solution to integrate the benefit of pure and impure schools.

- Monads provide a convenient framework for simulating effects found in other languages, such as Global state, exception handling, IO, or non-determinism.

- A monad is a way to structure computations in terms of values and sequences of computations using those values. Monads allow the programmer to build up computations  using sequential building blocks, which can themselves be sequences of computations. The monad determines how combined computations form a new computation and frees  the programmer from having to code the combination manually each time it is required.


### Benefits of monads for programmers

Monads are useful tools for structuring functional programs. They have 4 main properties that make them especially useful:

1. Modularity  - They allow computations to be composed from simpler computations and separate the combination strategy
                 from the actual computations being performed.

2. Flexibility - They allow functional programs to be much more adaptable than equivalent programs written without monads.
                 This is because the monad distills the computational strategy into a single place instead of requiring it be
                 distributed throughout the entire program.

3. Isolation   - They can be used to create imperative-style computational structures which remain safely isolated from
                 the main body of the functional program. This is useful for incorporating side-effects (such as I/O) and
                 state (which violates referential transparency) into a pure functional language like Haskell.

4. Abstraction - They enforce interface based programming. Monads offer a single interface (bind, inject) for all monad instances.
                 We do not have to take care of the underlying implementation to use monad types.

### Mathematical lows

1. Left identity :  bind(inject(a), f) = f a ( return a >>= f =  f a)

2. Right identity:  bind(f, function(value){return inject(value)}) = f (f >>= return = f)

3. Associativity : bind(f, function(x){ return bind(g(x), h)}) = bind(bind(f,g),h) f >>= (\x -> g x >>= h) = (f >>= g) >>= h

A structure with Left, Right identity and a binary operation that is associative is called a Monoid.

### Example of State Monad

As an exercise we implement a Reverse Polish Calculator using State Monad
