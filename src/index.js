
let Exedore = {
    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            let args = Array.from( arguments );
            return advice.apply( targetObject, [ oldFunction, args ] );
        }
    },

    before: function( targetObject, functionName, advice ) {
        this.wrap( targetObject, functionName, function( originalFunction, args ) {
            advice.apply( {}, [ originalFunction, args ] );
            return Exedore.next( {}, originalFunction, args );
        } );
    },

    next: function( contextObject, functionRef, args = [ ] ) {
        return functionRef.apply( contextObject, args );
    },

    wrap: function( targetObject, functionName, advice ) {
        this.around( functionName, advice, targetObject );
    }
};

export default Exedore;
