const Widget = require('./Widget');
const gtk = require('../definitions');
const ref = require('ref');
const ffi = require('ffi');

module.exports = class Window extends Widget {
    constructor(app) {
        super(app, gtk.gtk_application_window_new(app.getHandle()));
    }

    onClose(callback) {
        gtk.g_signal_connect_data(this.getHandle(), 'destroy', callback, null, null, 0);
    }

    setTitle(title) {
        gtk.gtk_window_set_title(this.getHandle(), title);
    }

    setDefaultSize(width, height) {
        gtk.gtk_window_set_default_size(this.getHandle(), width, height);
    }

    setTitlebar(widget) {
        gtk.gtk_window_set_titlebar(this.getHandle(), widget.getHandle());
    }
};
