const App = require('./definitions/components/App');
const Window = require('./definitions/components/Window');

const app = new App('net.burngames.nodedesktop');
app.start(() => {
    const window = new Window(app);
    window.center();
    window.setTitle('My Window!');

    // let i = 0;
    // window.on('resize', () => window.setTitle(`Resized ${++i} times!`));
    // window.on('move', () => console.log('Moved to', window.getPosition()));
    window.on('close', () => {
        console.log('Window closed!');
        process.exit(0); // close when window is closed.. todo implement mac's window system
    });

    window.show();
    console.log('made window');
});
