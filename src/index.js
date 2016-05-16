
export let Exedore = {
    around: function( functionName, advice, targetObject ) {
        targetObject[ functionName ] = advice;
    }
};
