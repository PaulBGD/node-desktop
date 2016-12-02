const App = require('./definitions/components/App');
const Window = require('./definitions/components/Window');

const app = new App('net.burngames.nodedesktop');
app.start(() => {
    const window = new Window(app);
    window.center();

    window.show();
    console.log('made window');
});