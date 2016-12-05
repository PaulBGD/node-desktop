const ReactElement = require('react/lib/ReactElement');
const ReactInstanceHandles = require('react/lib/ReactInstanceHandles');
const ReactUpdates = require('react/lib/ReactUpdates');
const instantiateReactComponent = require('react/lib/instantiateReactComponent');

module.exports.React = require('react');

module.exports.render = function render(element) {
    if (!ReactElement.isValidElement(element)) {
        throw new Error('Invalid element.');
    }

    const id = ReactInstanceHandles.createReactRootID();
    const component = instantiateReactComponent(element);

    ReactUpdates.batchedUpdates(() => {
        const transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
        transaction.perform(() => component.mountComponent(id, transaction, {}));
        ReactUpdates.ReactReconcileTransaction.release(transaction);
    });

    return component._instance;
};

module.exports.App = require('../src/definitions/components/App');

const CallbackQueue = require('react/lib/CallbackQueue');
const PooledClass = require('react/lib/PooledClass');
const Transaction = require('react/lib/Transaction');

const ON_READY_QUEUING = {
    initialize: function() {
        return this.reactMountReady.reset();
    },
    close: function() {
        this.reactMountReady.notifyAll();
    }
};

function ReactDesktopReconcileTransaction() {
    this.reinitializeTransaction();
    this.reactMountReady = CallbackQueue.getPooled(null);
}

const Mixin = {
    getTransactionWrappers: function() {
        return [ON_READY_QUEUING]
    },
    getReactMountReady: function() {
        return this.reactMountReady;
    },
    destructor: function() {
        CallbackQueue.release(this.reactMountReady);
        this.reactMountReady = null;
    }
};

Object.assign(ReactDesktopReconcileTransaction.prototype, Transaction.Mixin, Mixin);
PooledClass.addPoolingTo(ReactDesktopReconcileTransaction);

function processChildrenUpdates(updates, components, operator) {
    for (let i = 0; i < updates.length; i++) {
        const update = updates[i];
        const component = components[i];
        const parent = operator.get(update.parentID);
        switch (update.type) {
            case 'INSERT_MARKUP':
                parent.insertChild(component, update.toIndex);
                break;
            case 'REMOVE_NODE':
                parent.removeChild(update.fromIndex); // yay react for making the component undefined!
                break;
            default:
                console.error('Unknown update type', update);
        }
        // todo
    }
}

const nodes = {};

class ReactDesktopUUIDOperations {
    add(id, node) {
        nodes[id] = node;
        return this;
    }

    get(id) {
        return nodes[id];
    }

    setApp(app) {
        this.app = app;
    }

    getApp() {
        return this.app;
    }

    getParent(id) {
        if (id.match(/\./g).length === 1) {
            return app;
        }
        const parentId = id.split('.').slice(0, -1).join('.');
        return this.get(parentId);
    }

    drop(id) {
        delete nodes[id];
        return this;
    }

    dangerouslyProcessChildrenUpdates(updates, components) {
        processChildrenUpdates(updates, components, this);
    }

    dangerouslyReplaceNodeWithMarkupById(id, markup) {
        throw new Error('Unimplemented');
    }
}
const reactDesktopUUIDOperations = new ReactDesktopUUIDOperations();
module.exports.operations = reactDesktopUUIDOperations;

const ReactInjection = require('react/lib/ReactInjection');
const ReactComponentEnvironment = require('react/lib/ReactComponentEnvironment');

// finish our injection into react
ReactInjection.Updates.injectReconcileTransaction(ReactDesktopReconcileTransaction);
ReactInjection.EmptyComponent.injectEmptyComponent('element');

ReactComponentEnvironment.processChildrenUpdates = reactDesktopUUIDOperations.dangerouslyProcessChildrenUpdates.bind(reactDesktopUUIDOperations);
ReactComponentEnvironment.replaceNodeWithMarkupByID = reactDesktopUUIDOperations.dangerouslyReplaceNodeWithMarkupById.bind(reactDesktopUUIDOperations);

Object.assign(module.exports, require('./components')); // add all components AS THE LAST THING WE DO
