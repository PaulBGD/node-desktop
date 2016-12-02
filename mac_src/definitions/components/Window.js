const Widget = require('./Widget');
const objc = require('../definitions');

const defaultMask = objc.NSTitledWindowMask | objc.NSMiniaturizableWindowMask | objc.NSResizableWindowMask | objc.NSClosableWindowMask;

module.exports = class Window extends Widget {
    constructor(app, options) {
        options = options || {};
        let mask = defaultMask;
        if (options.properties) {
            mask = options.properties.reduce((next, current) => next | current);
        }
        const width = options.width || 200;
        const height = options.height || 200;

        super(app, objc.NSWindow('alloc')(
            'initWithContentRect', objc.NSMakeRect(0, 0, width, height),
            'styleMask', mask,
            'backing', objc.NSBackingStoreBuffered,
            'defer', true
        ));

        const WindowDelegate = objc.NSObject.extend('NSWindowDelegate');

        WindowDelegate.addMethod('windowDidMove:', 'v@:@', (self, _cmd, notif) => {
            console.log('moved', notif);
        });
        WindowDelegate.addMethod('windowDidResize:', 'v@:@', (self, _cmd, notif) => {
            console.log('resize', notif);
        });
        WindowDelegate.register();
        const windowDelegate = WindowDelegate('new');

        this.getHandle()('setDelegate', windowDelegate);
    }

    center() {
        this.getHandle()('center');
    }

    show() {
        this.getHandle()('makeKeyAndOrderFront', this.getHandle());
    }
};

module.exports.WindowStyles = {
    TITLE: objc.NSTitledWindowMask,
    MINIATURIZABLE: objc.NSMiniaturizableWindowMask,
    RESIZABLE: objc.NSResizableWindowMask,
    CLOSABLE: objc.NSClosableWindowMask
};
