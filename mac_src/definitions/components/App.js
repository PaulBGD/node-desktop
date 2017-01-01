const objc = require('../definitions');

module.exports = class App {
    constructor(id) {
        this.id = id; // not sure where to put this for cocoa
    }

    start(callback) {
        const app = objc.NSApplication('sharedApplication');

        this._handle = app;
        app('setActivationPolicy', objc.NSApplicationActivationPolicyRegular);

        const AppDelegate = objc.NSObject.extend('AppDelegate');
        AppDelegate.addMethod('applicationDidFinishLaunching:', 'v@:@', (self, _cmd, notif) => {
            try {
                callback();
            } catch (err) {
                console.error('Error thrown inside of application', err);
            }
        });

        AppDelegate.addMethod('applicationWillTerminate:', 'v@:@', (self, _cmd, notif) => {
            // application stopped
            console.log('stopped.. todo something?');
        });

        AppDelegate.register();

        this._delegate = AppDelegate('new');

        app('setDelegate', this._delegate);
        app('activateIgnoringOtherApps', true);

        app('run');
    }
};
