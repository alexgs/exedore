
let Exedore = {
    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            let args = Array.from( arguments );
            return advice.apply( targetObject, [ oldFunction, args ] );
        }
    },

    next: function( contextObject, functionRef, args = [ ] ) {
        return functionRef.apply( contextObject, args );
    },

    wrap: function( targetObject, functionName, advice ) {
        this.around( functionName, advice, targetObject );
    }
};

export default Exedore;
