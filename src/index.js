const App = require('./definitions/components/App');
const Window = require('./definitions/components/Window');
const ScrolledWindow = require('./definitions/components/ScrolledWindow');
const Box = require('./definitions/components/Box');
const HeaderBar = require('./definitions/components/HeaderBar');
const ListBox = require('./definitions/components/ListBox');
const ButtonBox = require('./definitions/components/ButtonBox');
const Button = require('./definitions/components/Button');
const Label = require('./definitions/components/Label');
const Entry = require('./definitions/components/Entry');

const app = new App('net.burngames.gtktest');
const status = app.start(() => {
    const window = new Window(app);
    window.setTitle('My Window');
    window.center();

    const header = new HeaderBar(app);
    header.setTitle('Title');
    header.setSubtitle('Subtitle');
    header.setShowCloseButton(true);
    window.setTitlebar(header);

    const mainButton = new Button(app, 'Debug');
    mainButton.onClick(() => app.enableDebug(true));
    header.addChildToEnd(mainButton);

    console.time('setup');
    const entry = new Entry(app);
    console.timeEnd('setup');
    entry.setStretch(true, false);
    entry.setText('Wow');
    entry.setMinCharWidth(30);
    let progress = 0.0;
    const interval = setInterval(() => {
        progress += 0.01;
        if (progress >= 1.0) {
            progress = 1;
            clearInterval(interval);
        }
        entry.setProgress(progress);
    }, 200);
    header.setWidgetAsTitle(entry);

    const box = new Box(app, false);
    box.setStretch(true);
    window.addChild(box);

    const listBox = new ListBox(app);
    box.addChild(listBox);

    for (let i = 0; i < 3; i++) {
        const listItem = new Box(app);
        const someText = new Label(app, 'Wow!');
        someText.setMargin(10);
        someText.setMarginLeft(20);
        someText.setMarginRight(20);
        listItem.addChild(someText);
        listBox.addChild(listItem);
    }

    const scroll = new ScrolledWindow(app);
    scroll.setStretch(true, false);
    box.addChild(scroll);

    const buttonBox = new ButtonBox(app, true);
    scroll.addChild(buttonBox);

    for (let i = 0; i < 30; i++) {
        let times = 0;
        const button = new Button(app, 'Click Me');
        button.addClass('my-button');
        button.onClick(() => {
            button.setLabel(`Clicked ${++times} times`);
        });
        button.setMargin(10);
        buttonBox.addChild(button);
    }

    window.onClose(() => {
        console.log('closed');
        clearInterval(interval);
    });

    app.addStyles(`.my-button {
    background-color: pink;
    padding: 20px 40px;
}

.my-button:hover {
    background-color: purple;
}`);

    window.show();
});

console.log('final status:', status);
