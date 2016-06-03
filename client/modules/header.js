/* ==========================================================================
   Hero header
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';

export default function(container, selector) {

    const self = component(container, selector);

    self.define(
        {
            name: 'self',
            actions: {
                openNav() {
                    self.element('switch').get().setAttribute('aria-pressed', 'true');
                    self.element('nav').get().setAttribute('aria-expanded', 'true');

                    document.addEventListener('click', function handler() {
                        self.element('self').actions.closeNav();

                        document.removeEventListener('click', handler);
                    });
                },
                closeNav() {
                    self.element('switch').get().setAttribute('aria-pressed', 'false');
                    self.element('nav').get().setAttribute('aria-expanded', 'false');
                }
            }
        },
        {
            name: 'switch',
            handlers: {
                click(ev) {
                    ev.stopPropagation();
                    ev.preventDefault();

                    if (this.getAttribute('aria-pressed') === 'true') {
                        self.element('self').actions.closeNav();
                    } else {
                        self.element('self').actions.openNav();
                    }
                }
            }
        },
        {
            name: 'nav',
            handlers: {
                click(ev) {
                    ev.stopPropagation();
                },
                touchmove(ev) {
                    if (!ev.isLeftToRight) {
                        self.element('self').actions.closeNav();
                    }
                }
            }
        }
    );

    return self;
}
