/* ==========================================================================
   Component
   ========================================================================== */

import utils from 'utils.js';

const Component = {
    init: function(node, selector) {
        this.container = node;
        this.selector = selector;
        this.elements = {};
        this.registeredHandlers = {};
    },
    // Define an element and register any event handler neccessary.
    define: function(...elements) {
        for (let element of elements) {
            this.elements[element.name] = element;

            element.render = () => {
                if (element.template) {
                    return utils.createNode(element.template());
                } else {
                    return null;
                }
            };

            element.get = (index = -1) => {
                if (!element.node || element.isTransient) {
                    if (element.isCollection) {
                        element.node = utils.queryAll(element.selector, this.container);
                    } else {
                        element.node = utils.query(element.selector, this.container);
                    }
                }

                if (element.isCollection && index > -1) {
                    return element.node[index];
                }

                return element.node;
            };

            element.query = selector => {
                return this.container.querySelector(element.selector + selector);
            };

            element.queryAll = selector => {
                return this.container.querySelectorAll(element.selector + selector);
            };

            if (!element.selector) {
                if (element.name === 'self') {
                    element.selector = this.selector;
                    element.node = this.container;
                } else {
                    // Create a default selector by using the element's name and container selector.
                    element.selector = this.selector + '__' + element.name;
                }
            }

            if (!element.isTransient && !element.get()) {
                // throw an error
            }

            if (element.handlers) {
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
        }
    },
    // Returns an element for a given element name.
    element: function(name) {
        return this.elements[name];
    },
    findElement: function(target) {
        let elements = Object.keys(this.elements).map(name => this.elements[name]);
        let result = {};

        elements.some(element => {
            let node = element.get();

            if (element.isCollection) {

                return node.some((item, index) => {
                    if (item === target) {
                        result = { element, index };

                        return true;
                    }

                    return false;
                });

            } else if (node === target) {
                result = { element };

                return true;
            }

            return false;
        });

        return result;
    },
    // Generic event handler.
    handler: function(ev) {
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

            if (element && element.handlers && element.handlers[eventType]) {

                if (element.isCollection) {
                    element.handlers[eventType].call(element.get(index), ev, index);
                } else {
                    element.handlers[eventType].call(element.get(), ev);
                }

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
