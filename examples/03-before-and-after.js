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

const loggerAfter = function( target, args, result ) {
    const afterMessage = `Function returned ${result}`;     // TODO Note why this message differs slightly
    log.push( afterMessage );
};

// MAIN
Exedore.before( math, 'add', loggerBefore );
Exedore.after( math, 'add', loggerAfter );

Exedore.before( math, 'multiply', loggerBefore );
Exedore.after( math, 'multiply', loggerAfter );

math.multiply( 3, 9 );
math.add( 1, 1 );
math.multiply( 4, 4 );
math.add( 2, 2 );

console.log( `The log has ${log.length} entries` );
log.forEach( entry => console.log( entry ) );
