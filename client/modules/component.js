/* ==========================================================================
   Component
   ========================================================================== */

import utils from 'utils.js';

const Element = {
    init(component) {
        let defaultSelector = this.name === 'self' ? component.selector : component.selector + '__' + this.name;

        this.component = component;
        this.selector = this.selector || defaultSelector;
        this.handlers = this.handlers || Object.create(null);
        this.resolveNodes();
    },
    resolveNodes() {
        if (this.name === 'self') {
            this.nodes = [this.component.container];
        } else {
            this.nodes = utils.queryAll(this.selector, this.component.container);
        }

        return this.nodes;
    },
    get(index = 0) {
        if (!this.nodes || this.isTransient) {
            this.resolveNodes();
        }

        return this.nodes[index];
    },
    query(selector) {
        return utils.query(this.selector + selector, this.component.container);
    },
    queryAll(selector) {
        return utils.queryAll(this.selector + selector, this.component.container);
    },
    render() {
        return this.template && utils.createNode(this.template());
    }
};

const Component = {
    init(node, selector) {
        this.container = node;
        this.selector = selector;
        this.elements = new Map();
        this.registeredHandlers = Object.create(null);
    },
    define(...elements) {
        for (let element of elements) {
            let emptyElement = Object.create(Element);

            element = Object.assign(emptyElement, element);
            element.init(this);

            this.elements.set(element.name, element);

            for (let eventType of Object.keys(element.handlers)) {

                if (!this.registeredHandlers[eventType]) {
                    let capturingTypes = ['blur', 'focus'];
                    let isCapturing = capturingTypes.indexOf(eventType) > -1;
                    let handler = this.handler.bind(this);

                    this.container.addEventListener(eventType, handler, isCapturing);
                    this.registeredHandlers[eventType] = handler;

                    if (eventType === 'touchmove' && !this.touches) {
                        this.touches = {};
                        this.container.addEventListener('touchstart', function(ev) {
                            this.touches.x = ev.touches[0].clientX;
                            this.touches.y = ev.touches[0].clientY;
                        });
                    }
                }

            }
        }
    },
    element(name) {
        return this.elements.get(name);
    },
    findElement(target) {
        let elements = this.elements.values();
        let result = {};

        [...elements].some(element => {

            return element.nodes.some((item, index) => {
                if (item === target) {
                    result = { element, index };

                    return true;
                }
            });

        });

        return result;
    },
    handler(ev) {
        let currentTarget = ev.target;
        let eventType = ev.type;
        let stopPropagation = false;

        if (eventType === 'touchmove') {
            let delta = {
                x: this.touches.x - ev.touches[0].clientX,
                y: this.touches.y - ev.touches[0].clientY
            };

            ev.isHorizontal = Math.abs(delta.x) > Math.abs(delta.y);
            ev.isLeftToRight = delta.x < 0;
            ev.isBottomToTop = delta.y > 0;
        }

        while (!stopPropagation) {
            let { element = null, index = null } = this.findElement(currentTarget);

            if (element && element.handlers[eventType]) {
                element.handlers[eventType].call(element.get(index), ev, index);
            }

            if (currentTarget === this.container) {
                stopPropagation = true;
            } else {
                currentTarget = currentTarget.parentNode;
            }
        }
    }
};

export default function(node, selector) {
    let component = Object.create(Component);

    component.init(node, selector);

    return component;
}
