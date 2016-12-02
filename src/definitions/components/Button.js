const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Button extends Widget {
    constructor(app, label) {
        super(app, gtk.gtk_button_new_with_label(label || ''));
    }

    onClick(callback) {
        gtk.listen(this, 'clicked', callback);
    }

    setLabel(label) {
        gtk.gtk_button_set_label(this.getHandle(), label);
    }
};
