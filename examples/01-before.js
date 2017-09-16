'use strict';

import Exedore from '../src/index';

const log = [ ];
const math = {
    add: function( a, b ) { return a + b; },
    multiply: function( a, b ) { return a * b; }
};

const loggerBefore = function( target, args ) {
    const beforeMessage = `Function '${target.name}' called with ${args.toString()}`;
    log.push( beforeMessage );
};

// MAIN
Exedore.before( math, 'add', loggerBefore );
Exedore.before( math, 'multiply', loggerBefore );

math.multiply( 3, 9 );
math.add( 1, 1 );
math.multiply( 4, 4 );
math.add( 2, 2 );

console.log( `The log has ${log.length} entries` );
log.forEach( entry => console.log( entry ) );
