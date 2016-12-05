const {operations} = require('./index');
const ReactMultiChild = require('react/lib/ReactMultiChild');

class Component {
    constructor(element, clazz) {
        this.node = null;
        this._clazz = clazz;
        this._currentElement = element;
        this._rootNodeID = null;
    }

    construct(element) {
        this._currentElement = element;
    }

    getNativeNode() {
        return this.node;
    }

    getPublicInstance() {
        return this.node;
    }

    _createInstance(clazz, app) {
        return new (clazz)(app);
    }

    mountComponent(rootID, transaction, context) {
        this._rootNodeID = rootID;

        const props = this._currentElement.props;

        const app = operations.getApp();

        this.node = this._createInstance(this._clazz, app);
        operations.add(rootID, this.node, props);
        this.updateProps({}, props);

        return this.node;
    }

    receiveComponent(nextComponent, transaction, context) {
        const props = nextComponent.props;
        const oldProps = this._currentElement.props;
        this.updateProps(oldProps, props);
        this._currentElement = nextComponent;
    }

    unmountComponent() {
        operations.drop(this._rootNodeID);
    }

    updateProps(oldProps, props) {
        if (oldProps.className !== props.className) {
            const split = (props.className || '').split(' ');
            this.node.setClassList(split);
        }
        if (oldProps.margin !== props.margin) {
            this.node.setMargin(props.margin);
        }
    }
}

class ChildComponent extends Component {
    constructor(element, clazz) {
        super(element, clazz);
        this._renderedChildren = null;
    }

    /** override */
    mountComponent(rootID, transaction, context) {
        const node = super.mountComponent(rootID, transaction, context);

        const props = this._currentElement.props;
        this.mountChildren(props.children, transaction, context).map((child, index) => this.mountChild(child, index));

        return node;
    }

    mountChild(child, index) {
        this.node.addChild(child);
    }

    /** override */
    receiveComponent(nextComponent, transaction, context) {
        const currentElement = this._currentElement;
        const props = nextComponent.props;
        super.receiveComponent(nextComponent, transaction, context);
        this._currentElement = currentElement; // reset for the child update
        this.updateChildren(props.children, transaction, context);
        this._currentElement = nextComponent; // set again
    }

    /** override */
    unmountComponent() {
        this.unmountChildren();
        super.unmountComponent();
    }
}
Object.assign(ChildComponent.prototype, ReactMultiChild.Mixin);

const DesktopWindow = require('../src/definitions/components/Window');

module.exports.Window = class Window extends ChildComponent {
    constructor(element) {
        super(element, DesktopWindow);
    }

    /** override */
    mountComponent(rootID, transaction, context) {
        const app = this._currentElement.props.app;

        if (!app) {
            throw new Error('The Window element must have the App instance as property');
        }
        operations.setApp(app);

        const node = super.mountComponent(rootID, transaction, context);
        node.show(); // by this time initial children should be ready
        return node;
    }

    updateProps(oldProps, props) {
        super.updateProps(oldProps, props);

        if (oldProps.title !== props.title) {
            this.node.setTitle(props.title);
        }

        let width = oldProps.width;
        let height = oldProps.height;
        if (props.width !== width) {
            width = props.width;
        }
        if (props.height !== height) {
            height = props.height;
        }
        if (oldProps.width !== props.width) {
            this.node.setSize(width || 200, height || 200);
        }
    }
};

const DesktopButton = require('../src/definitions/components/Button');

module.exports.Button = class Button extends ChildComponent {
    constructor(element) {
        super(element, DesktopButton);

        this._onClick = false;
        this._onClickListener = null;
    }

    updateProps(oldProps, props) {
        super.updateProps(oldProps, props);
        if (oldProps.label !== props.label) {
            this.node.setLabel(props.label);
        }
        if (props.onClick) {
            if (this._onClick === false) {
                this._onClick = true;
                this.node.onClick(() => {
                    return this._onClickListener && this._onClickListener();
                });
            }
            this._onClickListener = props.onClick;
        }
    }
};

const DesktopButtonBox = require('../src/definitions/components/ButtonBox');

module.exports.ButtonBox = class ButtonBox extends ChildComponent {
    constructor(element) {
        super(element, DesktopButtonBox);
    }

    updateProps(oldProps, props) {
        // nothing special here
        super.updateProps(oldProps, props);
    }
};

const DesktopBox = require('../src/definitions/components/Box');

module.exports.VerticalBox = class VerticalBox extends ChildComponent {
    constructor(element) {
        super(element, DesktopBox);
    }

    _createInstance(clazz, app) {
        return new (clazz)(app, true);
    }

    updateProps(oldProps, props) {
        super.updateProps(oldProps, props);
        if (oldProps.spacing !== props.spacing) {
            this.node.setSpacing(props.spacing);
        }
    }
};

module.exports.HorizontalBox = class HorizontalBox extends ChildComponent {
    constructor(element) {
        super(element, DesktopBox);
    }

    _createInstance(clazz, app) {
        return new (clazz)(app, false);
    }

    updateProps(oldProps, props) {
        super.updateProps(oldProps, props);
        if (oldProps.spacing !== props.spacing) {
            this.node.setSpacing(props.spacing);
        }
    }
};

const DesktopLabel = require('../src/definitions/components/Label');

module.exports.Label = class Label extends ChildComponent {
    constructor(element) {
        super(element, DesktopLabel);

        this._onClick = false;
        this._onClickListener = null;
    }

    updateProps(oldProps, props) {
        super.updateProps(oldProps, props);
        if (oldProps.text !== props.text) {
            this.node.setText(props.text);
        }
    }
};
