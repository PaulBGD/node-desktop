const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Entry extends Widget {
    constructor(app) {
        super(app, gtk.gtk_entry_new());
    }

    setMinCharWidth(width) {
        gtk.gtk_entry_set_width_chars(this.getHandle(), width);
    }

    setText(text) {
        gtk.gtk_entry_set_text(this.getHandle(), text);
    }

    setProgress(progress) {
        if (progress < 0 || progress > 1) {
            throw new Error('Invalid progress value ' + progress);
        }
        gtk.gtk_entry_set_progress_fraction(this.getHandle(), progress);
    }
};
