const App = require('./definitions/components/App');
const Window = require('./definitions/components/Window');
const Box = require('./definitions/components/Box');
const Button = require('./definitions/components/Button');

const app = new App('net.burngames.nodedesktop');
app.start(() => {
    const window = new Window(app, {
        width: 500,
        height: 500
    });
    window.center();
    window.setTitle('My Window!');
    window.setMargined(true);

    // let i = 0;
    // window.on('resize', () => window.setTitle(`Resized ${++i} times!`));
    // window.on('move', () => console.log('Moved to', window.getPosition()));
    window.on('close', () => {
        console.log('Window closed!');
        process.exit(0); // close when window is closed.. todo implement mac's window system
    });

    window.show();
    const box = new Box(app, {
        horizontal: false
    });
    const box2 = new Box(app, {
        horizontal: true
    });
    box2.stretchy = true;
    for (let i = 0; i < 5; i++) {
        const button = new Button(app, {});
        button.setTitle('Hello ' + (i + 1));
        button.setType(Button.ButtonTypes.MOMENTARY_LIGHT);
        button.setBordered(true);
        button.setBezelStyle(Button.ButtonBezels.ROUNDED);
        box2.addChild(button);
    }
    box.addChild(box2);
    window.addChild(box);
    console.log('made window');
});
