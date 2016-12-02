const gtk = require('../definitions');

module.exports = class Widget {
    constructor(app, handle) {
        this._app = app;
        this._handle = handle;
    }

    getHandle() {
        return this._handle;
    }

    addChild(child) {
        gtk.gtk_container_add(this._handle, child.getHandle());
    }

    destroy() {
        gtk.gtk_widget_destroy(this._handle);
    }

    setMarginLeft(margin) {
        gtk.gtk_widget_set_margin_left(this._handle, margin);
    }

    setMarginTop(margin) {
        gtk.gtk_widget_set_margin_top(this._handle, margin);
    }

    setMarginRight(margin) {
        gtk.gtk_widget_set_margin_right(this._handle, margin);
    }

    setMarginBottom(margin) {
        gtk.gtk_widget_set_margin_bottom(this._handle, margin);
    }

    setMargin(margin) {
        this.setMarginLeft(margin);
        this.setMarginTop(margin);
        this.setMarginRight(margin);
        this.setMarginBottom(margin);
    }

    setStretch(stretch, vertical) {
        if (stretch) {
            if (vertical) {
                gtk.gtk_widget_set_vexpand(this.getHandle(), true);
                gtk.gtk_widget_set_valign(this.getHandle(), Widget.Align.FILL);
            } else {
                gtk.gtk_widget_set_hexpand(this.getHandle(), true);
                gtk.gtk_widget_set_halign(this.getHandle(), Widget.Align.FILL);
            }
        }
    }

};

module.exports.Align = {
    FILL: 0,
    START: 0,
    END: 0,
    CENTER: 0,
    BASELINE: 0,
};
