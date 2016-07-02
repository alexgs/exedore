
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

    next: function( contextObject, functionRef, args = [ ] ) {
        return functionRef.apply( contextObject, args );
    },

    wrap: function( targetObject, functionName, advice ) {
        Exedore.around( functionName, advice, targetObject );
    }
};

export default Exedore;
