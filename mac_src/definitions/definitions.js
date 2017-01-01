const objc = require('nodobjc');
const EventLoop = require('../loop');
EventLoop.initObjC(objc);

objc.import('Cocoa');

module.exports = objc;
module.exports.makeConstraint = function (view, attr1, relation, view2, attr2, multiplier, constant, desc) {
    const constraint = objc.NSLayoutConstraint('constraintWithItem', view,
        'attribute', attr1,
        'relatedBy', relation,
        'toItem', view2,
        'attribute', attr2,
        'multiplier', multiplier,
        'constant', constant);
    constraint('setIdentifier', objc(desc));
    return constraint;
};


const pool = objc.NSAutoreleasePool('alloc')('init');
const eventLoop = new EventLoop();

eventLoop.start();

pool('release');
