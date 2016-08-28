const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class ListBox extends Widget {
    constructor(app) {
        super(app, gtk.gtk_list_box_new());
    }

    insertChild(child, position) {
        gtk.gtk_list_box_insert(this.getHandle(), child.getHandle(), position);
    }

    /** override */
    addChild(child) {
        this.insertChild(child, -1);
    }
};

