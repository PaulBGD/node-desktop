const gtk = require('../definitions');
const ref = require('ref');

const css = require('css');
const components = [
    require('./Box'),
    require('./Button'),
    require('./ButtonBox'),
    require('./Entry'),
    require('./HeaderBar'),
    require('./Label'),
    require('./ListBox'),
    require('./ScrolledWindow'),
    require('./Window')
];

module.exports = class App {
    constructor(id) {
        this.id = id;
    }

    getHandle() {
        return this._handle;
    }

    start(callback) {
        this._handle = gtk.gtk_application_new(this.id, 0);
        const uselessObjectToNotGC = gtk.listen(this, 'activate', callback); // assign to variable to keep in memory
        const status = gtk.g_application_run(this._handle, 0, Buffer.from([]));
        gtk.g_object_unref(this._handle);
        this._handle = null;

        return status;
    }

    addStyles(styles) {
        styles = String(styles);

        const provider = gtk.gtk_css_provider_new();
        const buffer = Buffer.from(styles, 'utf8');
        const error = ref.NULL_POINTER;
        gtk.gtk_css_provider_load_from_data(provider, buffer, buffer.length, error);
        if (!ref.isNull(error.deref())) {
            throw new Error(`Failed to add styles ${error.deref().message}`);
        }
        gtk.gtk_style_context_add_provider_for_screen(gtk.gdk_screen_get_default(), provider, gtk.StyleProvider.APPLICATION);
    }

    enableDebug(debug) {
        gtk.gtk_window_set_interactive_debugging(debug);
    }
};
