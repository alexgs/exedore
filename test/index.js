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

import Exedore from '../src/index';

chai.use( sinonChai );
chai.use( dirtyChai );
let expect = chai.expect;

describe( 'Exedore', function() {
    let container
        , deepSpy
        , wrapperFactory
        , Pair = null
        , foo = null
        , increment = 6
        ;

    beforeEach( function() {
        container = {
            target: function() { }
        };

        deepSpy = sinon.spy( container, 'target' );

        Pair = class Pair {
            constructor( leftValue, rightValue ) {
                this.left = leftValue;
                this.right = rightValue;
            }

            static add( a, b ) {
                return a + b;
            }

            addToLeft( value ) {
                return this.left + value;
            }

            incrementRight( value ) {
                this.right = Pair.add( this.right, value );
                return this.right;
            }

            checkContext( context ) {
                expect( this ).to.equal( context );
                expect( this === context ).to.be.true();
                return this.sum();
            }

            sum() {
                return Pair.add( this.left, this.right );
            }
        };

        wrapperFactory = {
            create: function () {
                return function( targetFunction, args = [ ] ) {
                    // Test that the arguments are the correct types
                    expect( typeof targetFunction ).to.equal( 'function' );
                    expect( Array.isArray( args ) ).to.be.true();
                    targetFunction.apply( this, args );
                }
            },
            createBeforeAfter: function() {
                return function( targetFunction, args ) {
                    // Test that the arguments are the correct types
                    expect( typeof targetFunction ).to.equal( 'function' );
                    expect( Array.isArray( args ) ).to.be.true();

                    // `Exedore.next` is called inside of `Exedore.before` and
                    // `Exedore.after` so we do **NOT** need to worry about it here.
                }
            },
            createError: function () {
                return function( targetFunction, args = [ ] ) {
                    throw new Error( 'Oops!' );
                }
            },
            createWithNext: function() {
                return function ( targetFunction, args ) {
                    // Do something here
                    return Exedore.next( this, targetFunction, args );
                }
            },
            checkContext: function( context ) {
                return function ( targetFunction, args ) {
                    expect( this ).to.equal( context );
                    expect( this === context ).to.be.true();
                    return Exedore.next( this, targetFunction, args );
                }
            },
            incrementFirstArg: function() {
                return function ( targetFunction, args ) {
                    expect( args.length ).to.be.greaterThan( 0 );
                    args[0] = args[0] + increment;
                    return Exedore.next( this, targetFunction, args );
                }
            },
            incrementReturn: function() {
                return function ( targetFunction, args ) {
                    let returnValue = Exedore.next( this, targetFunction, args );
                    return returnValue + increment;
                }
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
                expect( this === _self ).to.be.true();
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

        it( 'allows the advice to return a value', function() {
            container.plus = function( a, b ) { return a + b };
            let plusSpy = sinon.spy( container, 'plus' );

            expect( container.plus( 2, 2 ) ).to.equal( 4 );
            expect( plusSpy ).to.have.been.calledOnce();

            let adviceSpy = sinon.spy( function( fn, args ) {
                return Exedore.next( container, fn, args ) + 1 ;
            } );

            Exedore.around( 'plus', adviceSpy, container );
            let result = container.plus( 2, 2 );
            expect( adviceSpy ).to.have.been.calledOnce();
            expect( plusSpy ).to.have.been.calledTwice();
            expect( result ).to.equal( 5 );
        } );

    } );

    describe( 'has a function `next( context, function, args )` that', function() {
        let targetFunction
            , secret
            ;

        beforeEach( function() {
            targetFunction = sinon.spy( function( num ) { return num * 2 } );
            secret = Math.floor( Math.random() * 1000000 );
        } );

        it( 'calls the passed-in function', function() {
            Exedore.next( this, targetFunction );
            expect( targetFunction ).to.be.calledOnce();
        } );

        it( 'passes the arguments in `args` to the passed-in function', function () {
            Exedore.next( this, targetFunction, [ secret ] );
            expect( targetFunction ).to.be.calledOnce();
            expect( targetFunction ).to.be.calledWithExactly( secret );
        } );

        it( 'returns the value from the passed-in function', function() {
            let result = Exedore.next( this, targetFunction, [ secret ] );
            expect( targetFunction ).to.be.calledOnce();
            expect( targetFunction ).to.be.calledWithExactly( secret );
            expect( result ).to.equal( targetFunction( secret ) );
        } );

        it( 'calls the passed-in function in the given context', function() {
            let _context = null;
            class TargetClass {
                constructor() {
                    _context = this;
                }

                classFunction( num ) {
                    expect( this instanceof TargetClass ).to.be.true();
                    expect( this === _context ).to.be.true();
                    expect( this ).to.equal( _context );
                    return num * 2;
                }
            }

            let instance = new TargetClass();
            let instanceSpy = sinon.spy( instance, 'classFunction' );
            let result = Exedore.next( instance, instance.classFunction, [ secret ] );
            expect( instanceSpy ).to.be.calledOnce();
            expect( instanceSpy ).to.be.calledWithExactly( secret );
            expect( result ).to.equal( instance.classFunction( secret ) );

        } );

    } );

    describe( 'has a function `wrap( targetObject, functionName, advice )` that', function() {

        it( 'is an alias for the `around` function', function () {
            let aroundSpy = sinon.spy( Exedore, 'around' );
            let wrapper = sinon.spy( wrapperFactory.create() );
            Exedore.wrap( container, 'target', wrapper );

            let arg0 = 'happy';
            let arg1 = 42;
            container.target( arg0, arg1 );

            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledWithExactly( arg0, arg1 );
            expect( aroundSpy ).to.have.been.calledOnce();
            expect( aroundSpy ).to.have.been.calledWithExactly( 'target', wrapper, container );
        } );

    } );

    describe( 'has a function `before( targetObject, functionName, advice )` that', function() {

        context( '(when the advice has completed normally)', function() {
            let wrapper, arg0, arg1;

            beforeEach( function() {
                wrapper = sinon.spy( wrapperFactory.createBeforeAfter() );
                arg0 = 'happy';
                arg1 = 42;

                Exedore.before( container, 'target', wrapper );
            } );

            it( 'causes a call to the target function to execute the advice before '
                + 'executing the target', function () {
                container.target( arg0, arg1 );
                expect( wrapper ).to.have.been.calledBefore( deepSpy );
            } );

            it( 'provides the arguments to the advice', function() {
                container.target( arg0, arg1 );
                expect( wrapper ).to.have.been.calledOnce();
                expect( wrapper ).to.have.been.calledWithExactly( sinon.match.func, [ arg0, arg1 ] );
            } );

            it( 'provides the arguments to the target function', function() {
                container.target( arg0, arg1 );
                expect( deepSpy ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledWithExactly( arg0, arg1 );
            } );

            it( 'can chain, with the most-recently added advice executing '
                + 'first', function() {
                let wrapper2 = sinon.spy( wrapperFactory.createBeforeAfter() );
                Exedore.before( container, 'target', wrapper2 );
                expect( wrapper === wrapper2 ).to.be.false();

                container.target( arg0, arg1 );
                expect( wrapper2 ).to.have.been.calledOnce();
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( wrapper2 ).to.have.been.calledBefore( wrapper );
            } );

            it( 'causes a call to the target to return its normal value', function() {
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

                Exedore.before( container, 'target', wrapper );
                let result = container.target();
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( result ).to.deep.equal( returnValue );
            } );

            it( 'executes the advice in the context of the target', function() {
                let secret = Math.floor( Math.random() * 1000000 );
                let returnValue = {
                    type: 'secret',
                    data: {
                        name: 'setec astronomy',
                        number: secret
                    }
                };

                class CoolContainer {
                    target() {
                        expect( this === footainer ).to.be.true();
                        return returnValue;
                    }

                    foo() {
                        return 'bar';
                    }

                    add( a, b ) {
                        return a + b;
                    }
                }

                let footainer = new CoolContainer();
                deepSpy = sinon.spy( footainer, 'target' );

                let foowrap = sinon.spy( function( target, args ) {
                    expect( this ).to.equal( footainer );
                    expect( this === footainer ).to.be.true();
                } );

                Exedore.before( footainer, 'target', foowrap );
                let result = footainer.target();
                expect( foowrap ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( result ).to.deep.equal( returnValue );
            } );

        } );

        context( '(when the advice has thrown an error)', function() {
            let errorWrap, wrapper;

            beforeEach( function() {
                wrapper = sinon.spy( wrapperFactory.createBeforeAfter() );
                errorWrap = sinon.spy( wrapperFactory.createError() );

                Exedore.before( container, 'target', wrapper );
                Exedore.before( container, 'target', errorWrap );
            } );

            it( 'does not execute the next advice', function() {
                expect( function() {
                    container.target();
                } ).to.throw( Error, 'Oops!' );

                expect( errorWrap ).to.have.been.calledOnce();
                expect( wrapper ).to.have.callCount( 0 );
            } );

            it( 'does not execute the target', function() {
                expect( function() {
                    container.target();
                } ).to.throw( Error, 'Oops!' );

                expect( errorWrap ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.callCount( 0 );
            } );

        } );

        it( 'accepts an optional parameter to work with the `wrapClassMethod` function', function() {
            let ptr = Exedore.wrapClassMethod;
            let exedoreSpy = sinon.spy( Exedore, 'wrapClassMethod' );
            deepSpy = sinon.spy( Pair.prototype, 'addToLeft' );

            let wrapper = sinon.spy( wrapperFactory.createBeforeAfter() );
            Exedore.before( Pair, 'addToLeft', wrapper, true );

            let left = 16, right = 27;
            let foo = new Pair( left, right );
            let result = foo.addToLeft( increment );

            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
            expect( exedoreSpy ).to.have.been.calledOnce();
            expect( result ).to.equal( left + increment );

            // Restore the original function and verify
            exedoreSpy.restore();
            expect( ptr === Exedore.wrapClassMethod ).to.be.true();
        } );

    } );

    describe( 'has a function `after( targetObject, functionName, advice )` that', function() {

        context( '(when the target has completed normally)', function() {
            let wrapper, arg0, arg1;

            beforeEach( function() {
                wrapper = sinon.spy( wrapperFactory.createBeforeAfter() );
                arg0 = 'happy';
                arg1 = 42;

                Exedore.after( container, 'target', wrapper );
            } );

            it( 'executes after the target', function() {
                container.target();

                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( wrapper ).to.have.been.calledAfter( deepSpy );
            } );

            it( 'executes with the target\'s arguments', function() {
                container.target( arg0, arg1 );

                expect( wrapper ).to.have.been.calledWith( sinon.match.func, [ arg0, arg1 ] );
            } );

            it( 'executes in the context of the target', function() {
                let secret = Math.floor( Math.random() * 1000000 );
                let returnValue = {
                    type: 'secret',
                    data: {
                        name: 'setec astronomy',
                        number: secret
                    }
                };

                class Context {
                    target() {
                        return returnValue;
                    }
                }
                container = new Context();
                deepSpy = sinon.spy( container, 'target' );
            } );

            it( 'returns the return value of the target', function() {
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

                Exedore.after( container, 'target', wrapper );
                let result = container.target();
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( result ).to.deep.equal( returnValue );
            } );

            it( 'can chain, with the most-recently added advice executing '
                + 'last', function() {
                let wrapper2 = sinon.spy( wrapperFactory.createBeforeAfter() );
                Exedore.after( container, 'target', wrapper2 );
                expect( wrapper === wrapper2 ).to.be.false();

                container.target( arg0, arg1 );
                expect( wrapper2 ).to.have.been.calledOnce();
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( wrapper ).to.have.been.calledBefore( wrapper2 );
            } );

        } );

        context( '(when the target has thrown an error)', function() {

            it( 'does not execute', function() {
                container = {
                    target: function() {
                        throw new Error( 'Oops!' );
                    }
                };
                deepSpy = sinon.spy( container, 'target' );
                let wrapper = sinon.spy( function( target, args ) {
                    // Test that the arguments are the correct types
                    expect( typeof target ).to.equal( 'function' );
                    expect( Array.isArray( args ) ).to.be.true();
                } );

                Exedore.after( container, 'target', wrapper );
                expect( function() {
                    container.target();
                } ).to.throw( Error, 'Oops!' );
                expect( wrapper ).to.have.callCount( 0 );
            } );

        } );

        it( 'accepts an optional parameter to work with the `wrapClassMethod` function', function() {
            let ptr = Exedore.wrapClassMethod;
            let exedoreSpy = sinon.spy( Exedore, 'wrapClassMethod' );
            deepSpy = sinon.spy( Pair.prototype, 'addToLeft' );

            let wrapper = sinon.spy( wrapperFactory.createBeforeAfter() );
            Exedore.after( Pair, 'addToLeft', wrapper, true );

            let left = 16, right = 27;
            let foo = new Pair( left, right );
            let result = foo.addToLeft( increment );

            expect( wrapper ).to.have.been.calledOnce();
            expect( deepSpy ).to.have.been.calledOnce();
            expect( exedoreSpy ).to.have.been.calledOnce();
            expect( result ).to.equal( left + increment );

            // Restore the original function and verify
            exedoreSpy.restore();
            expect( ptr === Exedore.wrapClassMethod ).to.be.true();
        } );

    } );

    describe( 'has a function `wrapClassMethod( targetClass, functionName, advice )` that', function() {
        let left = 99, right = 27;

        context( '(on the class prototype)', function() {

            it( 'replaces the target function', function() {
                let wrapper = function( targetFunction, args ) {
                    return 99;
                };
                let ptr = Pair.prototype.addToLeft;
                let pair1 = new Pair( 9, 2 );

                Exedore.wrapClassMethod( Pair, 'addToLeft', wrapper );
                expect( Pair.prototype.addToLeft === ptr ).to.be.false();

                // Note that `Pair.prototype.addToLeft !== wrapper` because the
                // advice is itself wrapped inside an anonymous function that
                // is put on the prototype in place of the original function.
            } );

        } );

        context( '(on an instance of the class)', function () {

            beforeEach( function() {
                foo = new Pair( left, right );
            } );

            it( 'causes a call to the target function to execute the advice', function() {
                let wrapper = sinon.spy( wrapperFactory.createWithNext() );
                Exedore.wrapClassMethod( Pair, 'sum', wrapper );

                let result = foo.sum();
                expect( wrapper ).to.have.been.calledOnce();
            } );

            it( 'causes a call to the target function to execute the original function', function() {
                deepSpy = sinon.spy( Pair.prototype, 'sum' );
                let wrapper = sinon.spy( wrapperFactory.createWithNext() );
                Exedore.wrapClassMethod( Pair, 'sum', wrapper );

                let result = foo.sum();
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
            } );

            it( 'returns the result of the target function', function() {
                let wrapper = sinon.spy( wrapperFactory.createWithNext() );
                Exedore.wrapClassMethod( Pair, 'sum', wrapper );
                let result = foo.sum();
                expect( result ).to.equal( left + right );
            } );

            it( 'allows the advice to pass the normal arguments to the target', function() {
                // Sanity checks
                expect( foo.left ).to.equal( left );
                expect( Pair.add( foo.left, increment ) ).to.equal( left + increment );
                expect( foo.addToLeft( increment ) ).to.equal( left + increment );

                // Do the wrap
                deepSpy = sinon.spy( Pair.prototype, 'addToLeft' );
                let wrapper = sinon.spy( wrapperFactory.createWithNext() );
                Exedore.wrapClassMethod( Pair, 'addToLeft', wrapper );

                // More sanity checks
                expect( foo.left ).to.equal( left );
                expect( Pair.add( left, increment ) ).to.equal( left + increment );

                // Check the result
                let result = foo.addToLeft( increment );
                expect( result ).to.equal( left + increment );
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledWithExactly( increment );
            } );

            it( 'executes the advice in the context of the instance object', function() {
                let wrapper = sinon.spy( wrapperFactory.checkContext( foo ) );
                Exedore.wrapClassMethod( Pair, 'addToLeft', wrapper );
                let result = foo.addToLeft( increment );
                expect( result ).to.equal( left + increment );
                expect( wrapper ).to.have.been.calledOnce();
            } );

            it( 'executes the target function in the context of the instance object', function() {
                deepSpy = sinon.spy( Pair.prototype, 'checkContext' );
                let wrapper = sinon.spy( wrapperFactory.createWithNext() );
                Exedore.wrapClassMethod( Pair, 'checkContext', wrapper );

                foo.checkContext( foo );
                expect( wrapper ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledOnce();
            } );

            it( 'allows the advice to modify the argument(s) to the target function', function() {
                deepSpy = sinon.spy( Pair.prototype, 'addToLeft' );
                let wrapper = wrapperFactory.incrementFirstArg();
                Exedore.wrapClassMethod( Pair, 'addToLeft', wrapper );

                // Remember, `increment` is added to the first argument in
                // `incrementFirstArg`, so we check for (increment * 2) in
                // these tests.
                let result = foo.addToLeft( increment );
                expect( deepSpy ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledWithExactly( increment * 2 );
                expect( result ).to.equal( foo.left + ( increment * 2 ) );
            } );

            it( 'allows the advice to modify the return value of the target function', function() {
                deepSpy = sinon.spy( Pair.prototype, 'addToLeft' );
                let wrapper = wrapperFactory.incrementReturn();
                Exedore.wrapClassMethod( Pair, 'addToLeft', wrapper );

                // Remember, `increment` is added to the the result of the
                // target function in `incrementReturn`, so we check for
                // (increment * 2) in the result.
                let result = foo.addToLeft( increment );
                expect( deepSpy ).to.have.been.calledOnce();
                expect( deepSpy ).to.have.been.calledWithExactly( increment );
                expect( result ).to.equal( foo.left + ( increment * 2 ) );
            } );

        } );

    } );

} );
