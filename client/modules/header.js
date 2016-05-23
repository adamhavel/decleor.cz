/* ==========================================================================
   Header
   ========================================================================== */

import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'self',
            handlers: {

            }
        }
    );

    (function init() {

    })();

    return self;
}
