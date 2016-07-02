
let Exedore = {
    after: function( targetObject, functionName, advice ) {
        Exedore.wrap( targetObject, functionName, function( originalFunction, args ) {
            let result = Exedore.next( targetObject, originalFunction, args );
            advice.apply( targetObject, [ originalFunction, args ] );
            return result;
        } );
    },

    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            let args = Array.from( arguments );
            return advice.apply( targetObject, [ oldFunction, args ] );
        }
    },

    before: function( targetObject, functionName, advice ) {
        Exedore.wrap( targetObject, functionName, function( originalFunction, args ) {
            advice.apply( targetObject, [ originalFunction, args ] );
            return Exedore.next( targetObject, originalFunction, args );
        } );
    },

    // beforeClassMethod: function( targetConstructor, functionName, advice ) {
    //     Exedore.wrap( targetConstructor.prototype, functionName, function( originalFunction, args ) {
    //         advice.apply( this, [ originalFunction, args ] );
    //         return Exedore.next( this, originalFunction, args );
    //     } );
    // },

    next: function( contextObject, functionRef, args = [ ] ) {
        return functionRef.apply( contextObject, args );
    },

    wrap: function( targetObject, functionName, advice ) {
        Exedore.around( functionName, advice, targetObject );
        // TODO Experiment with the original "match" function from Aop.js
        // If we go back to the original "match" function from Aop.js, can we
        // wrap loose functions (e.g. private functions in a module) as well as
        // functions that are attached to an object?
    },

    wrapClassMethod: function( targetClass, functionName, advice ) {
        let originalMethod = targetClass.prototype[ functionName ];
        targetClass.prototype[ functionName ] = function() {
            let args = Array.from( arguments );
            return advice.apply( this, [ originalMethod, args ] );
        }
    }
};

export default Exedore;
