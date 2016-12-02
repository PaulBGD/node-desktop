const {React, App, Window, ButtonBox, Button, render} = require('../../react/index');

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
            title: 'My Window',
            width: 400,
            height: 400
        }, [
            React.createElement(ButtonBox, {
                key: 0
            }, [
                React.createElement(Button, {
                    onClick: () => {
                        this.setState({clicked: this.state.clicked + 1});
                        console.log(this.state.clicked);
                    },
                    label: `Clicked ${this.state.clicked} Time${this.state.clicked === 1 ? '' : 's'}`,
                    key: 0,
                }, []),
            ])
        ]));
    }
}

app.start(() => render(React.createElement(Application)));
