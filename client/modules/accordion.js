/* ==========================================================================
   Accordion
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'button',
            handlers: {
                click() {
                    utils.toggleAttribute(this, 'aria-pressed');
                    self.element('content').actions.toggle();
                }
            }
        },
        {
            name: 'content',
            handlers: {
                transitionend() {
                    this.style.maxHeight = '';
                }
            },
            actions: {
                toggle() {
                    this.style.maxHeight = (this.scrollHeight + 10) + 'px';
                    utils.toggleAttribute(this, 'aria-expanded');
                }
            }
        }
    );

    return self;
}
