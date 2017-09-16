# Exedore

Exedore is a JavaScript library for aspect-oriented programming (AoP) in ES6 and newer versions of JavaScript.

It is based on [Aop.js][1] by Fredrik Appelberg and Dave Clayton, and on the unit tests in Chapter 2 of _Reliable JavaScript: How to Code Safely in the World's Most Dangerous Language_ by Seth Richards and Lawrence Spencer (ISBN 9781119028727). From this foundation, Exedore was extended to interoperate with ES6 classes, as easily as [Aop.js][1] works with functions defined on plain objects.

[1]: https://github.com/davedx/aop

## Understanding Aspect-Oriented Programming (AOP)

> _Aspect-Oriented Programming_ (AOP) complements Object-Oriented Programming (OOP) by providing another way of thinking about program structure. The key unit of modularity in OOP is the class, whereas in AOP the unit of modularity is the aspect. Aspects enable the modularization of concerns such as transaction management that cut across multiple types and objects. (Such concerns are often termed _crosscutting_ concerns in AOP literature.) -- [Spring Framework documentation][3]

[3]: https://docs.spring.io/spring/docs/current/spring-framework-reference/html/aop.html

The first paragraph of the [Wikipedia entry on Aspect-Oriented Programming][4] also has a good definition, which I won't bother to repeat here.

We don't deal with a lot of transaction management in the JavaScript world, so think about logging instead. You don't want to write a bunch of logging code in all of your functions. AOP allows you to write generic logging functions and then insert them before or after the specific functions that you want to log. You can see this in [example 1][5].

[4]: https://en.wikipedia.org/wiki/Aspect-oriented_programming
[5]: examples/01-before.js

In the jargon of AOP, an **aspect** is a modularization of a cross-cutting concern. An **advice** is the action that the **aspect** takes at any given point. In other words, an **advice** is the function that wraps around a target function, and an **aspect** is a library or class that contains one or more advices.

## Basic Usage

------

&#9888; **IMPORTANT** &#9888;

When defining an advice function, do **NOT** use [arrow functions][2] (aka "fat arrows"). Use the old school function declaration:

```javascript
const advice = function( target, args ) { /* do stuff */ }
```

This is because arrow functions lexically bind the value of `this` to the context where they are defined. In AOP, we want to be able to control the context of the advice. We move advice functions to many different contexts, so we don't want them to be bound to a particular context. _Don't use arrow functions._

[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions

-----

Start, of course, by importing Exedore into your file:

```javascript
import Exedore from 'exedore';
```

### Executing Advice Before the Target

Suppose that you want to monitor the usage of certain functions. This is a perfect use-case for AOP! First, we want to know when a function is called and what arguments it is called with. Here are our functions, as properties on a plain object. We are also creating an empty array to store the log messages.

```javascript
const log = [ ];
const math = {
    add: function( a, b ) { return a + b; },
    multiply: function( a, b ) { return a * b; }
};
```

#### Create the Advice Function

An advice function recieves two arguments: the original or target function, and the arguments to the target function. Our logger function will push information about the function call onto the log array

```javascript
const loggerBefore = function( target, args )  {
    const beforeMessage = `Function '${target.name}' called with ${args.toString()}`;
    log.push( beforeMessage );
}
```

#### Using the Advice

To use the advice function, we wrap the function(s) that we want to log. The `before` function takes as its arguments (1) the object that contains the target function, (2) the name of the target function as a string, and (3) the advice function.

```javascript
Exedore.before( math, 'add', loggerBefore );
Exedore.before( math, 'multiply', loggerBefore );
```

Then we use the functions and view the log.

```javascript
math.multiply( 3, 9 );
math.add( 1, 1 );
math.multiply( 4, 4 );
math.add( 2, 2 );

console.log( `The log has ${log.length} entries` );
log.forEach( entry => console.log( entry ) );
```

All of this code comes from [example 1][5], so you can see it all together in that file. To run the examples, clone this repository, install the dependencies with `npm install`, and execute `npm run example:01` (or the number of the example you want to see).

**&darr; TODO: Start here &darr;**

### Executing Advice After the Target

### Adding Multiple Advice Functions

## Advanced Usage

### Wrap

To execute the original function, in the body of the advice, call `Exedore.next`. Pass it the current context `this`, the target function, and the args to the target function.

The `next` function will return the result of calling the target function with the provided arguments. This means that Exedore will let you modify the arguments before passing them to the target!

```javascript
const result = Exedore.next( this, target, args );
```

You can also modify the result of the target function before returning it.

Putting it all together, a "logger" advice function might look like this:

```javascript
const logger = function( target, args ) {
    const beforeMessage = `Function '${target.name}' called with ${args.toString()}`;
    log.push( beforeMessage );

    const result = Exedore.next( this, target, args );

    const afterMessage = `Function '${target.name}' returned ${result}`;
    log.push( afterMessage );

    return result;
};
```

#### Use the Advice

Before we can use the `logger` advice function, we need some things to use it with. In the [example][5], these all come **before** the advice function is definied.

```javascript
const log = [ ];
const math = {
    add: function( a, b ) { return a + b; },
    multiply: function( a, b ) { return a * b; }
};
```

Next, we wrap the function(s) that we want to log. The `wrap` functions takes as its arguments (1) the object that contains the target function, (2) the name of the target function as a string, and (3) the advice function.

```javascript
Exedore.wrap( math, 'add', logger );
Exedore.wrap( math, 'multiply', logger );
```

Then we use the functions and view the log.

```javascript
math.multiply( 3, 9 );
math.add( 1, 1 );
math.multiply( 4, 4 );
math.add( 2, 2 );

console.log( `The log has ${log.length} entries` );
log.forEach( entry => console.log( entry ) );
```

All of this code comes from the [example][5], so you can see it all together in that file. To run the examples, clone this repository, install the dependencies with `npm install`, and execute `npm run example:01` (or the number of the example you want to see).

### Exedore and Classes

TODO

## Recommendations and Precautions
- recommendations and precautions for using with module loaders and npm modules
    - only modify prototypes that you own
    - only wrap instances of modules objects
    - use custom factory or class if you need to wrap every instance (show example)
