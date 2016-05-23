/* ==========================================================================
   Accordion
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';

export default function(node, selector) {

    const self = component(node, selector);

    var contentHeight;

    self.define(
        {
            name: 'button',
            handlers: {
                click: function() {
                    let content = self.element('content').get();

                    utils.toggleAttribute(this, 'aria-pressed');
                    utils.toggleAttribute(content, 'aria-expanded');

                    if (content.getAttribute('aria-expanded') === 'true') {
                        content.style.maxHeight = contentHeight;
                    } else {
                        content.style.maxHeight = '0px';
                    }
                }
            }
        },
        {
            name: 'content'
        }
    );

    (function init() {

        let content = self.element('content').get();

        contentHeight = (content.scrollHeight + 10) + 'px';

        if (content.getAttribute('aria-expanded') === 'true') {
            content.style.maxHeight = contentHeight;
        }

    })();

    return self;
}