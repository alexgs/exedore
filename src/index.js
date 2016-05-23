
export let Exedore = {
    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            let args = Array.from( arguments );
            advice.apply( targetObject, [ oldFunction, args ] );
            // advice.apply( this, [ oldFunction, args ] );
        }
    },

    next: function( contextObject, functionRef, args = [ ] ) {
        return functionRef.apply( contextObject, args );
    }
};
