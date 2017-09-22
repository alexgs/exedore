"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

let Exedore = {
    after: function (targetObject, functionName, advice, classMethod = false) {

        function instanceCallback(originalFunction, args) {
            let result = Exedore.next(targetObject, originalFunction, args);
            advice.apply(targetObject, [originalFunction, args]);
            return result;
        }

        function classCallback(originalFunction, args) {
            let result = Exedore.next(this, originalFunction, args);
            advice.apply(this, [originalFunction, args]);
            return result;
        }

        let wrapFunc = classMethod ? Exedore.wrapClassMethod : Exedore.wrap;
        let callback = classMethod ? classCallback : instanceCallback;

        wrapFunc(targetObject, functionName, callback);
    },

    around: function (functionName, advice, targetObject) {
        let oldFunction = targetObject[functionName];
        targetObject[functionName] = function () {
            let args = Array.from(arguments);
            return advice.apply(targetObject, [oldFunction, args]);
        };
    },

    before: function (targetObject, functionName, advice, classMethod = false) {

        function instanceCallback(originalFunction, args) {
            advice.apply(targetObject, [originalFunction, args]);
            return Exedore.next(targetObject, originalFunction, args);
        }

        function classCallback(originalFunction, args) {
            advice.apply(this, [originalFunction, args]);
            return Exedore.next(this, originalFunction, args);
        }

        let wrapFunc = classMethod ? Exedore.wrapClassMethod : Exedore.wrap;
        let callback = classMethod ? classCallback : instanceCallback;

        wrapFunc(targetObject, functionName, callback);
    },

    next: function (contextObject, functionRef, args = []) {
        return functionRef.apply(contextObject, args);
    },

    wrap: function (targetObject, functionName, advice) {
        Exedore.around(functionName, advice, targetObject);
        // TODO Experiment with the original "match" function from Aop.js
        // If we go back to the original "match" function from Aop.js, can we
        // wrap loose functions (e.g. private functions in a module) as well as
        // functions that are attached to an object?
    },

    wrapClassMethod: function (targetClass, functionName, advice) {
        let originalMethod = targetClass.prototype[functionName];
        targetClass.prototype[functionName] = function () {
            let args = Array.from(arguments);
            return advice.apply(this, [originalMethod, args]);
        };
    }
};

exports.default = Exedore;