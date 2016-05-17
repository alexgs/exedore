
export let Exedore = {
    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            let args = Array.from( arguments );
            // advice.apply( {}, [ oldFunction, args ] );
            advice( oldFunction, args );
        }
    }
};
