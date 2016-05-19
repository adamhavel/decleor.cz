import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'item',
            isCollection: true
        }
    );

    (function init() {


    })();

    return self;

}
