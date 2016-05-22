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
    let container
        , deepSpy
        , wrapperFactory
        ;

    beforeEach( function() {
        container = {
            target: function() { }
        };
        deepSpy = sinon.spy( container, 'target' );
        wrapperFactory = {
            create: function () {
                return ( ( target, args = [ ] ) => {
                    // Test that the arguments are the correct types
                    expect( typeof target ).to.equal( 'function' );
                    expect( Array.isArray( args ) ).to.be.true();
                    target.apply( this, args );
                } );
            }
        };
    } );

    describe( 'has a function `around( functionName, advice, targetObject )` that', function() {

        it( 'causes a call to the target function to execute the advice', function() {
            let wrapper = sinon.spy();
            Exedore.around( 'target', wrapper, container );

            container.target();
            expect( wrapper ).to.have.been.calledOnce();
        } );

        it( 'allows the advice to wrap a call the target', function() {
            let wrapper = sinon.spy( wrapperFactory.create() );
            Exedore.around( 'target', wrapper, container );

            // Test assumptions before going into the real test
            expect( wrapper === deepSpy ).to.be.false();
            expect( typeof wrapper ).to.equal( 'function' );
            expect( typeof container.target ).to.equal( 'function' );

            // This is the real test
            container.target( 'what' );
            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
        } );

        it( 'can chain, with the last one set up being executed around the others', function() {
            let wrapper1 = sinon.spy( wrapperFactory.create() );
            let wrapper2 = sinon.spy( wrapperFactory.create() );
            Exedore.around( 'target', wrapper1, container );
            Exedore.around( 'target', wrapper2, container );
            expect( wrapper1 === wrapper2 ).to.be.false();

            container.target();
            expect( wrapper2 ).to.have.been.calledOnce();
            expect( wrapper1 ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
            expect( wrapper2 ).to.have.been.calledBefore( wrapper1 );
        } );

        it( 'allows the advice to pass the normal arguments to the target', function() {
            let wrapper = sinon.spy( wrapperFactory.create() );
            Exedore.around( 'target', wrapper, container );

            let arg0 = 'happy';
            let arg1 = 42;
            container.target( arg0, arg1 );
            expect( deepSpy ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledWithExactly( arg0, arg1 );
        } );

        it( 'can chain and pass arguments down the chain', function() {
            let wrapper1 = sinon.spy( wrapperFactory.create() );
            let wrapper2 = sinon.spy( wrapperFactory.create() );
            Exedore.around( 'target', wrapper1, container );
            Exedore.around( 'target', wrapper2, container );
            expect( wrapper1 === wrapper2 ).to.be.false();

            let arg0 = 'happy';
            let arg1 = 42;
            container.target( arg0, arg1 );
            expect( wrapper2 ).to.have.been.calledOnce();
            expect( wrapper1 ).to.have.been.calledOnce();
            expect( wrapper2 ).to.have.been.calledBefore( wrapper1 );
            expect( deepSpy ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledWithExactly( arg0, arg1 );
        } );

        it( 'makes the target\'s return value available to the advice', function() {
            // Secret is an integer between 0 and 999,999
            let secret = Math.floor( Math.random() * 1000000 );
            let returnValue = {
                type: 'secret',
                data: {
                    name: 'setec astronomy',
                    number: secret
                }
            };
            container.target = function() {
                return returnValue
            };
            deepSpy = sinon.spy( container, 'target' );

            let wrapper = sinon.spy( ( target, args = [ ] ) => {
                // Test that the arguments are the correct types
                expect( typeof target ).to.equal( 'function' );
                expect( Array.isArray( args ) ).to.be.true();
                let result = target.apply( this, args );
                expect( result ).to.deep.equal( returnValue );
            } );
            Exedore.around( 'target', wrapper, container );

            container.target();
            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
        } );

        it( 'executes the target function in the context of its object', function() {
            let _self = null;
            class TargetClass {
                constructor() {
                    _self = this;
                }

                targetFunction() {
                    expect( _self instanceof TargetClass ).to.be.true();
                    expect( this instanceof TargetClass ).to.be.true();
                    expect( this ).to.equal( _self );
                }
            }

            // Use old school function declaration, so that `this` is not
            // lexically bound to the context of this testing function
            let wrapper = sinon.spy( function ( target, args = [ ] ) {
                // Test that the arguments are the correct types
                expect( typeof target ).to.equal( 'function' );
                expect( Array.isArray( args ) ).to.be.true();
                // expect( this instanceof TargetClass ).to.be.true();
                target.apply( this, args );
            } );

            let instance = new TargetClass();
            deepSpy = sinon.spy( instance, 'targetFunction' );
            Exedore.around( 'targetFunction', wrapper, instance );

            instance.targetFunction();
            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
        } );

        it( 'executes the advice in the context of the target\'s object', function() {
            let _self = null;
            class TargetClass {
                constructor() {
                    _self = this;
                }

                targetFunction() { }
            }

            let wrapper = sinon.spy( function( target, args = [ ] ) {
                expect( this instanceof TargetClass ).to.be.true();
                expect( this ).to.equal( _self );

                target.apply( this, args );
            } );

            let instance = new TargetClass();
            deepSpy = sinon.spy( instance, 'targetFunction' );
            Exedore.around( 'targetFunction', wrapper, instance );

            instance.targetFunction();
            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
        } );

    } );

    describe( 'has a function `next( context, targetInfo )` that', function() {

        it( 'calls the function in targetInfo.fn' );
        it( 'passes the arguments in targetInfo.args' );
        it( 'returns the value from targetInfo\'s function' );
        it( 'calls the target function in the given context' );

    } );

    describe( 'has a function `wrap( targetObject, functionName, advice )` that', function() {

        it( 'is an alias for the `around` function' );

    } );

    describe.skip( 'has a function `before( functionName, advice, targetObject )` that', function() {

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

    describe.skip( 'has a function `after( functionName, advice, targetObject )` that', function() {

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
