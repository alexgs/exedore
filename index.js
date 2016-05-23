"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var Exedore = {
    around: function around(functionName, advice, targetObject) {
        var oldFunction = targetObject[functionName];
        targetObject[functionName] = function () {
            var args = Array.from(arguments);
            return advice.apply(targetObject, [oldFunction, args]);
        };
    },

    next: function next(contextObject, functionRef) {
        var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

        return functionRef.apply(contextObject, args);
    },

    wrap: function wrap(targetObject, functionName, advice) {
        this.around(functionName, advice, targetObject);
    }
};

exports.default = Exedore;
//# sourceMappingURL=index.js.map
