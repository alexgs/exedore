
export let Exedore = {
    around: function( functionName, advice, targetObject ) {
        let oldFunction = targetObject[ functionName ];
        targetObject[ functionName ] = function() {
            advice( oldFunction );
        }
    }
};
