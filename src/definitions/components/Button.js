const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Button extends Widget {
    constructor(app, label) {
        super(app, gtk.gtk_button_new_with_label(label));
    }

    onClick(callback) {
        gtk.g_signal_connect_data(this.getHandle(), 'clicked', callback, null, null, 0);
    }

    setLabel(label) {
        gtk.gtk_button_set_label(this.getHandle(), label);
    }
};
