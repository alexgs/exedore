'use strict';

import Exedore from '../src/index';

const log = [ ];
const math = {
    add: function( a, b ) { return a + b; },
    multiply: function( a, b ) { return a * b; }
};

const loggerAfter = function( target, args, result ) {
    const afterMessage = `Function '${target.name}' returned ${result}`;
    log.push( afterMessage );
};

// MAIN
Exedore.after( math, 'add', loggerAfter );
Exedore.after( math, 'multiply', loggerAfter );

math.multiply( 3, 9 );
math.add( 1, 1 );
math.multiply( 4, 4 );
math.add( 2, 2 );

console.log( `The log has ${log.length} entries` );
log.forEach( entry => console.log( entry ) );
