const Widget = require('./Widget');
const objc = require('../definitions');

module.exports = class Button extends Widget {
    constructor(app, options) {
        super(app, objc.NSButton('alloc')(
            'initWithFrame', objc.NSMakeRect(0, 0, 0, 0)
        ));
    }

    setTitle(title) {
        this.getHandle()('setTitle', objc(String(title)));
    }

    setType(type) {
        this.getHandle()('setButtonType', type);
    }

    setBezelStyle(style) {
        this.getHandle()('setBezelStyle', style);
    }

    setBordered(bool) {
        this.getHandle()('setBordered', bool);
    }
};

module.exports.ButtonTypes = {
    MOMENTARY_LIGHT: objc.NSMomentaryLightButton,
    PUSH_ON_PUSH_OFF: objc.NSPushOnPushOffButton,
    TOGGLE: objc.NSToggleButton,
    SWITCH_BUTTON: objc.NSSwitchButton,
    // todo https://developer.apple.com/reference/appkit/nsbuttontype?language=objc
};

module.exports.ButtonBezels = {
    ROUNDED: objc.NSRoundedBezelStyle,
    TEXTURED_SQUARE: objc.NSTexturedSquareBezelStyle,
    REGULAR_SQUARE: objc.NSRegularSquareBezelStyle
};
