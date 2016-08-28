const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Label extends Widget {
    constructor(app, initialText) {
        super(app, gtk.gtk_label_new(initialText || null));
    }

    setText(text) {
        gtk.gtk_label_set_text(this.getHandle(), text);
    }
};
