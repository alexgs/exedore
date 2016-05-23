import Exedore from './index';
import advice from './advice';

let _a = new WeakMap();
let _b = new WeakMap();

export default class TestClass {
    constructor( valueA, valueB ) {
        _a.set( this, valueA );
        _b.set( this, valueB );
    }

    add() {
        let a = _a.get( this );
        let b = _b.get( this );
        return hiddenPlus( a, b );
    }
}

let hiddenPlus = function( a, b ) {
    return a + b;
};

// This does not work!!
// +++ Exedore.around( 'hiddenPlus', advice, this );
