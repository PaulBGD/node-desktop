const Widget = require('./Widget');
const objc = require('../definitions');

module.exports = class Box extends Widget {
    constructor(app, options = {}) {
        // const BoxView = objc.NSView.extend('BoxView');

        // BoxView.addMethod('init', 'v@:@', (self, _cmd, ...others) => {
        //     console.log('init!', others);
        //     return self.super('init');
        //     // self('init');
        // });

        // BoxView.register();

        super(app, objc.NSView('alloc')('initWithFrame', objc.NSMakeRect(0, 0, 0, 0)));
        this._options = options;
        this._padding = 8;

        if (options.horizontal) {
            this._primaryOrientation = objc.NSLayoutConstraintOrientationHorizontal;
            this._secondaryOrientation = objc.NSLayoutConstraintOrientationVertical;
            this._primaryStart = objc.NSLayoutAttributeLeading;
            this._primaryEnd = objc.NSLayoutAttributeTrailing;
            this._secondaryStart = objc.NSLayoutAttributeTop;
            this._secondaryEnd = objc.NSLayoutAttributeBottom;
            this._primarySize = objc.NSLayoutAttributeWidth;
        } else {
            this._primaryOrientation = objc.NSLayoutConstraintOrientationVertical;
            this._secondaryOrientation = objc.NSLayoutConstraintOrientationHorizontal;
            this._primaryStart = objc.NSLayoutAttributeTop;
            this._primaryEnd = objc.NSLayoutAttributeBottom;
            this._secondaryStart = objc.NSLayoutAttributeLeading;
            this._secondaryEnd = objc.NSLayoutAttributeTrailing;
            this._primarySize = objc.NSLayoutAttributeHeight;
        }

        // for debugging constraints, set to `true` to enable
        objc.NSUserDefaults('standardUserDefaults')('setBool', true,
            'forKey', objc('NSConstraintBasedLayoutVisualizeMutuallyExclusiveConstraints'));

        this._children = [];
        this._betweens = [];
        this._others = [];
    }

    removeConstraint(constraint) {
        this.getHandle()('removeConstraint', constraint);
    }

    removeConstraints() {
        if (this._first) {
            this.removeConstraint(this._first);
            this._first = null;
        }

        this._betweens.map(between => this.removeConstraint(between));
        this._betweens.splice(0);

        if (this._last) {
            this.removeConstraint(this._last);
            this._last = null;
        }

        this._others.map(other => this.removeConstraint(other));
        this._others.splice(1);
    }

    establishConstraints() {
        this.removeConstraints();

        if (this._children.length === 0) {
            return;
        }

        const padding = this._padding;

        let previous = null;
        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];
            if (!previous) {
                // first child
                this._first = objc.makeConstraint(this.getHandle(),
                    this._primaryStart,
                    objc.NSLayoutRelationEqual,
                    child.getHandle(),
                    this._primaryStart,
                    1, 0,
                    "primary constraint");
                this.getHandle()('addConstraint', this._first);
                previous = child;
                continue;
            }

            const constraint = objc.makeConstraint(previous.getHandle(),
                this._primaryEnd,
                objc.NSLayoutRelationEqual,
                child.getHandle(),
                this._primaryStart,
                1, -padding,
                "in-between primary constraint");
            this.getHandle()('addConstraint', constraint);
            this._betweens.push(constraint);
            previous = child;
        }

        if (!previous) {
            return; // no visible controls todo give widgts option to be invis
        }

        const lastConstraint = objc.makeConstraint(previous.getHandle(),
            this._primaryEnd,
            objc.NSLayoutRelationEqual,
            this.getHandle(),
            this._primaryEnd,
            1, 0,
            "last primary constraint");
        this._last = lastConstraint;
        this.getHandle()('addConstraint', lastConstraint);

        const hugs = this._options.horizontal ? child => child._hugsBottom() : child => child._hugsEdge();

        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];

            const constraint = objc.makeConstraint(this.getHandle(),
                this._secondaryStart,
                objc.NSLayoutRelationEqual,
                child.getHandle(),
                this._secondaryStart,
                1, 0,
                "secondary start constraint");
            this.getHandle()('addConstraint', constraint);
            this._others.push(constraint);

            const constraint2 = objc.makeConstraint(child.getHandle(),
                this._secondaryEnd,
                objc.NSLayoutRelationLessThanOrEqual,
                this.getHandle(),
                this._secondaryEnd,
                1, 0,
                "secondary middle constraint");
            if (hugs(child)) {
                constraint2('setPriority', objc.NSLayoutPriorityDefaultLow);
            }
            this.getHandle()('addConstraint', constraint2);
            this._others.push(constraint2);

            const constraint3 = objc.makeConstraint(child.getHandle(),
                this._secondaryEnd,
                objc.NSLayoutRelationEqual,
                this.getHandle(),
                this._secondaryEnd,
                1, 0,
                "secondary end constraint");
            if (!hugs(child)) {
                constraint3('setPriority', objc.NSLayoutPriorityDefaultLow);
            }
            this.getHandle()('addConstraint', constraint3);
            this._others.push(constraint3);
        }

        previous = null;
        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];
            if (!child.stretchy) {
                continue;
            }
            if (!previous) {
                previous = child;
                continue;
            }

            const constraint = objc.makeConstraint(previous.getHandle(),
                this._primarySize,
                objc.NSLayoutRelationEqual,
                child.getHandle(),
                this._primarySize,
                1, 0,
                "stretchy constraint");
            this.getHandle()('addConstraint', constraint);
            this._others.push(constraint);
        }
    }

    addChild(child) {
        const handle = child.getHandle();
        this._children.push(child);

        handle('setTranslatesAutoresizingMaskIntoConstraints', false);
        this.getHandle()('addSubview', handle);

        const priority = child.stretchy ? objc.NSLayoutPriorityDefaultLow : objc.NSLayoutPriorityRequired;
        handle('setContentHuggingPriority', priority,
            'forOrientation', this._primaryOrientation);
        // fill secondary direction
        handle('setContentHuggingPriority', objc.NSLayoutPriorityDefaultLow,
            'forOrientation', this._secondaryOrientation);

        this.establishConstraints();
    }

    _hugsEdge() {
        if (this._options.horizontal) {
            return true;
        }
        return this._children.filter(child => child.stretchy).length > 0;
    }

    _hugsBottom() {
        return this._hugsEdge();
    }
};
