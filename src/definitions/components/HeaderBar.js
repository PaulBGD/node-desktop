const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class HeaderBar extends Widget {
    constructor(app) {
        super(app, gtk.gtk_header_bar_new());
    }

    setTitle(title) {
        gtk.gtk_header_bar_set_title(this.getHandle(), title);
    }

    setSubtitle(subtitle) {
        gtk.gtk_header_bar_set_subtitle(this.getHandle(), subtitle);
    }

    setShowCloseButton(bool) {
        gtk.gtk_header_bar_set_show_close_button(this.getHandle(), bool);
    }

    addChildToEnd(child) {
        gtk.gtk_header_bar_pack_end(this.getHandle(), child.getHandle());
    }
};
