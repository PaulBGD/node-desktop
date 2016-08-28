const Widget = require('./Widget');
const gtk = require('../definitions');
const ref = require('ref');

module.exports = class ScrolledWindow extends Widget {
    constructor(app) {
        super(app, gtk.gtk_scrolled_window_new(null, null));
    }

    setShadowType(type) {
        if (type < 0 || type > 4) {
            throw new Error('Invalid shadow type');
        }
        gtk.gtk_scrolled_window_set_shadow_type(this.getHandle(), type);
    }
};

module.exports.ShadowType = {
    NONE: 0,
    IN: 1,
    OUT: 2,
    ETCHED_IN: 3,
    ETCHED_OUT: 4
};
