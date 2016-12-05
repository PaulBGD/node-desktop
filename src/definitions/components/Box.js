const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Box extends Widget {
    constructor(app, vertical, spacing) {
        super(app, gtk.gtk_box_new(vertical ? 1 : 0, spacing || 0));

        this.vertical = !!vertical;
    }

    setSpacing(spacing) {
        gtk.gtk_box_set_spacing(this.getHandle(), spacing);
    }

    /** override */
    setStretch(stretch) {
        super.setStretch(stretch, this.vertical);
    }

    insertChild(child, position) {
        super.addChild(child);
        gtk.gtk_box_reorder_child(this.getHandle(), child.getHandle(), position);
    }

};
