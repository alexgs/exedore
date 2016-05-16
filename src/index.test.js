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

// TODO Add TypeScript definitions for Mocha and Chai to WebStorm's JavaScript Libraries

describe( 'Exedore', function() {

    beforeEach( function() {
    } );

    describe( 'has a function `around( functionName, advice, targetObject )` that', function() {

        it( 'causes a call to the target function to execute the advice', function() {
            let targetObject = {
                targetFn: function() { }
            };
            let spy = sinon.spy();
            Exedore.around( 'targetFn', spy, targetObject );

            targetObject.targetFn();
            expect( spy ).to.have.been.calledOnce();
        } );

        it( 'allows the advice to wrap a call the target', function() {
            let container = {
                target: function() { }
            };
            let deepSpy = sinon.spy( container, 'target' );
            let wrapper = sinon.spy( ( target ) => {
                // This is part of the real test
                expect( typeof target ).to.equal( 'function' );
                target();
            } );
            Exedore.around( 'target', wrapper, container );

            // Test assumptions before going into the real test
            expect( wrapper === deepSpy ).to.be.false();
            expect( typeof wrapper ).to.equal( 'function' );
            expect( typeof container.target ).to.equal( 'function' );

            // This is the real test
            container.target();
            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
        } );

        it( 'can chain, with the last one set up being executed around the others' );
        it( 'allows the advice to pass the normal arguments to the target' );
        it( 'makes the target\'s return value available to the advice' );
        it( 'executes the target function in the context of its object' );
        it( 'executes the advice in the context of the target' );

    } );

    describe( 'has a function `next( context, targetInfo )` that', function() {

        it( 'calls the function in targetInfo.fn' );
        it( 'passes the arguments in targetInfo.args' );
        it( 'returns the value from targetInfo\'s function' );
        it( 'calls the target function in the given context' );

    } );

    describe( 'has a function `before( functionName, advice, targetObject )` that', function() {

        describe( 'when advice succeeds', function() {
            it( 'causes a call to the target function to execute the advice '
                + 'followed by the target' );
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

    describe( 'has a function `after( functionName, advice, targetObject )` that', function() {

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
