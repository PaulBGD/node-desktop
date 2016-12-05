const Widget = require('./Widget');
const gtk = require('../definitions');
const ref = require('ref');
const ffi = require('ffi');

module.exports = class Window extends Widget {
    constructor(app, options) {
        options = options || {};

        const width = options.width || 400;
        const height = options.height || 400;

        super(app, gtk.gtk_application_window_new(app.getHandle()));

        this.setSize(width, height);
    }

    center() {
        gtk.gtk_window_set_position(this.getHandle(), 1);
    }

    onClose(callback) {
        this.listen('destroy', callback);
    }

    setTitle(title) {
        gtk.gtk_window_set_title(this.getHandle(), title);
    }

    setSize(width, height) {
        gtk.gtk_window_set_default_size(this.getHandle(), width, height);
    }

    setTitlebar(widget) {
        gtk.gtk_window_set_titlebar(this.getHandle(), widget.getHandle());
    }

    show() {
        gtk.gtk_widget_show_all(this._handle);
    }

};
