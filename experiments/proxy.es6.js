'use strict';

let expect = require( 'chai' ).expect
    , Reflect = require( 'harmony-reflect' )
    ;

// Blow up if Proxy support is not available
let testProxySupport = new Proxy( {}, {} );

describe( 'Node.js 4.1.x with Proxy and Reflect enabled', () => {

    it( 'should pass a sanity test', () => {
        expect( true ).to.equal( true );

        let target = {
            foo: 27,
            bar: 'zyx'
        };

        let yum = new Proxy( target, {} );

        expect( typeof yum ).to.equal( 'object' );
        expect( typeof Proxy ).to.equal( 'function' );
        expect( typeof Reflect.get ).to.equal( 'function' );
    });

    it( 'should use a proxy object as a prototype', () => {
        let message = ''
            , target = {
                foo: 27,
                bar: 'zyx'
            }
            ;

        let prototypeProxy = new Proxy( target, {
            get: function ( target, key, receiver ) {
                message = `getting ${key}!`;
                //console.log( message );
                return Reflect.get( target, key, receiver );
            },
            set: function ( target, key, value, receiver ) {
                //message = `setting ${key}!`;
                console.log( message );
                return Reflect.set( target, key, value, receiver );
            }
        });

        let yum = Object.create( prototypeProxy );
        //noinspection BadExpressionStatementJS
        yum.foo;    // ignore return value
        expect( message ).to.equal( 'getting foo!' );

        yum.bar = 9;
        expect( message ).to.equal( 'setting bar!' );

        // Top is defined on the instance, not the prototype, so the proxy is
        // not invoked
        yum.top = 75;
        expect( message ).to.equal( 'setting bar!' );
    });

});
