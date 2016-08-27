'use strict';

import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Exedore from './index';

chai.use( sinonChai );
chai.use( dirtyChai );
let expect = chai.expect;

describe( 'Exedore Usage Examples:', function() {

    describe( 'Logging function calls', function() {
        let log = [ ];
        let math = {
            add( a, b ) { return a + b; },
            multiply( a, b ) { return a * b; }
        };

        let logger = function( target, args ) {
            let message = `Function ${target.name} called with ${args.toString()}`;
            // console.log( message );
            log.push( message );
            return Exedore.next( this, target, args );
        };

        it( 'with `wrap`', function() {
            Exedore.wrap( math, 'add', logger );

            expect( math.add( 1, 1 ) ).to.equal( 2 );
            expect( math.add( 2, 2 ) ).to.equal( 4 );
            expect( log.length ).to.equal( 2 );
            expect( log[0] ).to.equal( 'Function add called with 1,1' );
            expect( log[1] ).to.equal( 'Function add called with 2,2' );
        } );

    } );

} );
