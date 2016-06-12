/* ==========================================================================
   Hero header
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';
import waypoints from 'waypoints.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'audio-control',
            handlers: {
                click() {
                    let isPressed = utils.toggleAttribute(this, 'aria-pressed');
                    let icon = utils.query('svg', this);
                    let video = self.element('video').get();

                    if (video.currentSrc) {
                        video.muted = !isPressed;
                    }

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

        let waypoint;

        let update = function() {
            if (!utils.mediaQuery('<line')) {
                self.element('video').get().currentSrc && self.element('video').get().play();
                waypoints.remove(waypoint);
                self.container.classList.remove('is-floating');

                waypoint = waypoints.addElement(self.container, function() {
                    self.container.classList.toggle('is-floating');
                }, 'bottom');

            } else {
                self.container.classList.remove('is-floating');
            }
        };

        update();

        window.addEventListener('resize', utils.debounce(update, 300));

    })();

    return self;
}
