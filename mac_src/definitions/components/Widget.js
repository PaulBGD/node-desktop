module.exports = class Widget {
    constructor(app, handle) {
        this._app = app;
        this._handle = handle;
    }

    getHandle() {
        return this._handle;
    }
};