# Exedore

Exedore is a JavaScript library for aspect-oriented programming (AoP). It is based on [Aop.js][1] by Fredrik Appelberg and Dave Clayton, and on the unit tests in Chapter 2 of _Reliable JavaScript: How to Code Safely in the World's Most Dangerous Language_ by Seth Richards and Lawrence Spencer (ISBN 9781119028727).

[1]: https://github.com/davedx/aop

## Current Goals

- Implement `around` method
- Implement `next` method
- Create a method `wrap` that is an alias for `around`
- Add decent documentation with examples (in an `examples.js` file), including 
    - usage with ES6 classes and their prototypes
    - manipulating arguments and return values
    - recommendations and precautions for using with module loaders and npm modules
        - only modify prototypes that you own
        - only wrap instances of modules objects
        - use custom factory or class if you need to wrap every instance (show example) 

## (Possible) Future Directions

- Implement `before` and `after` methods, as in [Aop.js][1]
- Update `before` method to accept a function argument that modifies the arguments to the original function
- Update `after` method to accept a function argument that modifies the return value from the original function

## Usage

When defining an "advice" or "wrapper" function, do **NOT** user [arrow functions][2] (aka "fat arrows"). Use the old school function declaration:

```javascript
let advice = function( target, args ) { /* do stuff */ }
```

This is because arrow functions lexically bind the value of `this` to the contact where they are defined, which is the opposite of what we want in aspect-oriented programming.

[2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
