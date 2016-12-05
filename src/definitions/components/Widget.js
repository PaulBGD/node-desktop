const gtk = require('../definitions');

module.exports = class Widget {
    constructor(app, handle) {
        this._app = app;
        this._handle = handle;
        this._listeners = [];
        this._children = [];
        this._classes = [];
    }

    getHandle() {
        return this._handle;
    }

    listen(event, callback) {
        // we HAVE to store an instance of the callback
        // if it gets GC'd we're over for
        this._listeners.push(gtk.listen(this, event, callback));
    }

    addClass(className) {
        const styleContext = gtk.gtk_widget_get_style_context(this._handle);
        gtk.gtk_style_context_add_class(styleContext, String(className));
        this._classes.push(className);
    }

    removeClass(className) {
        const styleContext = gtk.gtk_widget_get_style_context(this._handle);
        gtk.gtk_style_context_remove_class(styleContext, String(className));
        this._classes.splice(this._classes.indexOf(className), 1);
    }

    setClassList(classes) {
        classes.filter(c => c.trim().length > 0).forEach(c => {
            const index = this._classes.indexOf(c);
            if (index === -1) {
                this.addClass(c);
            }
        });
        let length = this._classes.length;
        while (length--) {
            if (classes.indexOf(this._classes[length]) === -1) {
                this.removeClass(this._classes[length]);
            }
        }
    }

    addChild(child) {
        gtk.gtk_container_add(this._handle, child.getHandle());
        this._children.push(child);
        gtk.gtk_widget_show_all(child.getHandle());
    }

    removeChild(index) {
        const child = this._children.splice(index, 1)[0];
        gtk.gtk_container_remove(this._handle, child.getHandle());
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
