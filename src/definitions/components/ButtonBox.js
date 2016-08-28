const Widget = require('./Widget');
const gtk = require('../definitions');

module.exports = class ButtonBox extends Widget {
    constructor(app, vertical) {
        super(app, gtk.gtk_button_box_new(vertical ? 1 : 0));
    }
};
