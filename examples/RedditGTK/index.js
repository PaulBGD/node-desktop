const {React, App, Window, VerticalBox, Button, Label, render} = require('../../react/index');

const app = new App();

class Application extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            clicked: 0
        };
    }

    render() {
        return (React.createElement(Window, {
            app,
            title: `My Window (clicked ${this.state.clicked} times!)`,
            width: 400,
            height: 400
        }, [
            React.createElement(VerticalBox, {
                key: 0,
                margin: 20,
                spacing: 10
            }, [
                React.createElement(Button, {
                    onClick: () => this.setState({clicked: this.state.clicked + 1}),
                    label: `Clicked ${this.state.clicked} Time${this.state.clicked === 1 ? '' : 's'}`,
                    key: 0,
                }, []),
                React.createElement(Label, {
                    text: 'You have clicked the button a multiple of 2!',
                    key: 1,
                    className: this.state.clicked % 2 === 0 ? 'my-label focus' : 'my-label'
                }, [])
            ])
        ]));
    }
}

app.start(() => {
    app.addStyles(`
.my-label {
    opacity: 0.5;
    text-decoration:  line-through;
    transition: opacity 0.2s ease-out;
}

.my-label.focus {
    opacity: 1;
    text-decoration: underline;
}
`);
    render(React.createElement(Application));
    app.enableDebug(true);
});
