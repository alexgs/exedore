'use strict';

/*
 * "Passing arrow functions to Mocha is discouraged" ([source][1]).
 *
 * [1]: http://mochajs.org/#arrow-functions
 */

import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Exedore } from './index';

chai.use( sinonChai );
chai.use( dirtyChai );
let expect = chai.expect;

describe( 'Exedore', function() {

    beforeEach( function() {
    } );

    describe( 'has a function `around(fnName, advice, targetObj)` that', function() {

        it( 'causes a call to the target function to execute the advice' );
        it( 'allows the advice to wrap a call the target' );
        it( 'can chain, with the last one set up being executed around the others' );
        it( 'allows the advice to pass the normal arguments to the target' );
        it( 'makes the target\'s return value available to the advice' );
        it( 'executes the target function in the context of its object' );
        it( 'executes the advice in the context of the target' );

    } );

    describe( 'has a function `next(context,targetInfo)` that', function() {
        
        it( 'calls the function in targetInfo.fn' );
        it( 'passes the arguments in targetInfo.args' );
        it( 'returns the value from targetInfo\'s function' );
        it( 'calls the target function in the given context' );

    } );

    describe( 'has a function `before(fnName, advice, targetObj)` that', function() {

        describe( 'when advice succeeds', function() {
            it( 'causes a call to the target function to execute the advice followed by the target' );
            it( 'provides the arguments to the advice' );
            it( 'provides the arguments to the target function' );
            it( 'can chain, with the last one set up executing first' );
            it( 'causes a call to the target to return its normal value' );
            it( 'executes the advice in the context of the target' );
        } );

        describe( 'when advice throws', function() {
            it( 'does not execute the next advice' );
            it( 'does not execute the target' );
        } );

    } );

    describe( 'has a function `after(fnName, advice, targetObj)` that', function() {

        describe( 'when target has succeeded', function() {
            it( 'executes after the target' );
            it( 'executes with the target\'s arguments' );
            it( 'executes in the context of the target' );
            it( 'returns the return value of the target' );
            it( 'can chain, with the first one set up executing first' );
        } );

        describe( 'when target has thrown an exception', function() {
            it( 'does not execute' );
        } );

    } );

} );
