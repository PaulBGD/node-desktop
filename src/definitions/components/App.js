const gtk = require('../definitions');

module.exports = class App {
    constructor(id) {
        this._handle = gtk.gtk_application_new(id, 0);
    }

    getHandle() {
        return this._handle;
    }

    start(callback) {
        gtk.g_signal_connect_data(this._handle, 'activate', callback, null, null, 0);
        const status = gtk.g_application_run(this._handle, 0, '');
        // gtk.g_object_unref(this._handle);
        this._handle = null;

        return status;
    }

    enableDebug(debug) {
        gtk.gtk_window_set_interactive_debugging(debug);
    }
};
