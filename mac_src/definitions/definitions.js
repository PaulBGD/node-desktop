const objc = require('nodobjc');
const EventLoop = require('../loop');
EventLoop.initObjC(objc);

objc.import('Cocoa');

module.exports = objc;

const pool = objc.NSAutoreleasePool('alloc')('init');
const eventLoop = new EventLoop();

eventLoop.start();

pool('release');
