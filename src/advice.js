import Exedore from './index';

let advice = function( target, args ) {
    let result = Exedore.next( {}, target, args );
    console.log( `-+- ${result} -+-` );
    return result;
};

export default advice;
