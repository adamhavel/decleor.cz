/* ==========================================================================
   Site nav
   ========================================================================== */

import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);
    var timer = null;

    self.define(
        {
            name: 'self',
            handlers: {
                mouseleave() {
                    timer = setTimeout(function() {
                        let activeSubNav = self.element('subnav').query('.is-active');

                        activeSubNav && activeSubNav.classList.remove('is-active');
                        timer = null;
                    }, 300);
                }
            }
        },
        {
            name: 'item',
            isCollection: true,
            handlers: {
                mouseover() {
                    let subNav = this.querySelector(self.element('subnav').selector);
                    let activeSubNav = self.element('subnav').query('.is-active');

                    if (timer) {
                        clearTimeout(timer);
                        timer = null;
                    }

                    activeSubNav && activeSubNav.classList.remove('is-active');
                    subNav && subNav.classList.add('is-active');
                }
            }
        },
        {
            name: 'subnav',
            isCollection: true
        }
    );

    return self;
}
