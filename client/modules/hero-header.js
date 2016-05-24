/* ==========================================================================
   Hero header
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'audio-control',
            handlers: {
                click() {
                    let isPressed = utils.toggleAttribute(this, 'aria-pressed');
                    let icon = utils.query('svg', this);

                    self.element('video').get().muted = !isPressed;
                    icon.setAttribute('aria-label', isPressed ? 'Vypnout zvuk' : 'Zapnout zvuk');
                    utils.query('use', icon).setAttribute('xlink:href', isPressed ? '#sound' : '#sound--off');
                }
            }
        },
        {
            name: 'video'
        }
    );

    (function init() {

    })();

    return self;
}
