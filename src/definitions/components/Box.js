const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class Box extends Widget {
    constructor(app, vertical, spacing) {
        super(app, gtk.gtk_box_new(vertical ? 1 : 0, spacing || 0));

        this.vertical = !!vertical;
    }

    /** override */
    setStretch(stretch) {
        super.setStretch(stretch, this.vertical);
    }

};
