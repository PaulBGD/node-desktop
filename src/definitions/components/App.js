const gtk = require('../definitions');

module.exports = class App {
    constructor(id) {
        this.id = id;
    }

    getHandle() {
        return this._handle;
    }

    start(callback) {
        this._handle = gtk.gtk_application_new(this.id, 0);
        gtk.listen(this, 'activate', callback);
        const status = gtk.g_application_run(this._handle, 0, '');
        gtk.g_object_unref(this._handle);
        this._handle = null;

        return status;
    }

    enableDebug(debug) {
        gtk.gtk_window_set_interactive_debugging(debug);
    }
};
