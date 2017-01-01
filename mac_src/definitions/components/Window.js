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
        this._margined = false;
        this._child = null;
        this._constraints = {};

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

    _removeConstraints() {
        const constraints = this._constraints;
        const view = this.getHandle()('contentView');

        ['leading', 'top', 'trailingGreater', 'trailingEqual', 'bottomGreater', 'bottomEqual'].forEach(key => {
            const value = constraints[key];
            if (value) {
                view('removeConstraint', value);
                constraints[key] = null;
            }
        });
    }

    _relayout() {
        this._removeConstraints();

        if (!this._child) {
            return;
        }
        const child = this._child;
        const childView = child.getHandle();
        const view = this.getHandle()('contentView');
        const constraints = this._constraints;
        const margin = this.margined ? 20 : 0;

        constraints.leading = objc.makeConstraint(view, objc.NSLayoutAttributeLeading,
            objc.NSLayoutRelationEqual,
            childView, objc.NSLayoutAttributeLeading,
            1, -margin,
            "leading constraint");
        view('addConstraint', constraints.leading);

        constraints.top = objc.makeConstraint(view, objc.NSLayoutAttributeTop,
            objc.NSLayoutRelationEqual,
            childView, objc.NSLayoutAttributeTop,
            1, -margin,
            "top constraint");
        view('addConstraint', constraints.top);

        constraints.trailingGreater = objc.makeConstraint(view, objc.NSLayoutAttributeTrailing,
            objc.NSLayoutRelationGreaterThanOrEqual,
            childView, objc.NSLayoutAttributeTrailing,
            1, margin,
            "trailing greater constraint");
        if (child._hugsEdge()) {
            constraints.trailingGreater('setPriority', objc.NSLayoutPriorityDefaultLow);
        }
        view('addConstraint', constraints.trailingGreater);

        constraints.trailingEqual = objc.makeConstraint(view, objc.NSLayoutAttributeTrailing,
            objc.NSLayoutRelationEqual,
            childView, objc.NSLayoutAttributeTrailing,
            1, margin,
            "trailing equal constraint");
        if (!child._hugsEdge()) {
            constraints.trailingEqual('setPriority', objc.NSLayoutPriorityDefaultLow);
        }
        view('addConstraint', constraints.trailingEqual);

        constraints.bottomGreater = objc.makeConstraint(view, objc.NSLayoutAttributeBottom,
            objc.NSLayoutRelationGreaterThanOrEqual,
            childView, objc.NSLayoutAttributeBottom,
            1, margin,
            "bottom greater constraint");
        if (child._hugsEdge()) {
            constraints.bottomGreater('setPriority', objc.NSLayoutPriorityDefaultLow);
        }
        view('addConstraint', constraints.bottomGreater);

        constraints.bottomEqual = objc.makeConstraint(view, objc.NSLayoutAttributeBottom,
            objc.NSLayoutRelationEqual,
            childView, objc.NSLayoutAttributeBottom,
            1, margin,
            "bottom equal constraint");
        if (!child._hugsEdge()) {
            constraints.bottomEqual('setPriority', objc.NSLayoutPriorityDefaultLow);
        }
        view('addConstraint', constraints.bottomEqual);
    }

    setMargined(margined) {
        this.margined = margined;
    }

    addChild(child) {
        this._child = child;
        child.getHandle()('setTranslatesAutoresizingMaskIntoConstraints', false);
        this.getHandle()('contentView')('addSubview', child.getHandle());
        this._relayout();
    }
};

module.exports.WindowStyles = {
    TITLE: objc.NSTitledWindowMask,
    MINIATURIZABLE: objc.NSMiniaturizableWindowMask,
    RESIZABLE: objc.NSResizableWindowMask,
    CLOSABLE: objc.NSClosableWindowMask
};
