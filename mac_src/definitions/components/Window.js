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

        this._listeners = {
            'move': [],
            'resize': [],
            'close': []
        };

        const WindowDelegate = objc.NSObject.extend('NSWindowDelegate');

        WindowDelegate.addMethod('windowDidMove:', 'v@:@', (self, _cmd, notif) => {
            this._listeners['move'].forEach(listener => listener());
        });
        WindowDelegate.addMethod('windowDidResize:', 'v@:@', (self, _cmd, notif) => {
            this._listeners['resize'].forEach(listener => listener());
        });
        WindowDelegate.addMethod('windowWillClose:', 'v@:@', (self, _cmd, notif) => {
            this._listeners['close'].forEach(listener => listener());
        });
        WindowDelegate.register();
        const windowDelegate = WindowDelegate('new');

        this.getHandle()('setDelegate', windowDelegate);
    }

    getPosition() {
        const frame = this.getHandle()('frame');
        const screen = this.getHandle()('screen')('frame');
        return {
            x: frame.origin.x,
            // basically, all other systems assume that y=0 is the top of the screen
            // mac doesn't, so we convert
            // also the y is given from the bottom left
            y: screen.size.height - frame.origin.y - frame.size.height
        };
    }

    getSize() {
        const frame = this.getHandle()('frame');
        return {
            width: frame.size.width,
            height: frame.size.height
        };
    }

    on(event, listener) {
        if (!this._listeners[event]) {
            throw new Error(`Invalid event ${event}`);
        }
        this._listeners[event].push(listener);
    }

    setTitle(title) {
        this.getHandle()('setTitle', objc(String(title)));
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
