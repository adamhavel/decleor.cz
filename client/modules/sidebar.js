/* ==========================================================================
   Sidebar
   ========================================================================== */

import component from 'component.js';
import utils from 'utils.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'self',
            handlers: {
                change() {
                    self.element('loader').get().classList.add('is-active');
                }
            }
        },
        {
            name: 'form'
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
        },
        {
            name: 'switch',
            handlers: {
                click() {
                    utils.toggleAttribute(this, 'aria-pressed');
                    self.element('content').actions.toggle();
                }
            }
        },
        {
            name: 'tab',
            handlers: {
                click(ev) {
                    ev.preventDefault();

                    if (this.getAttribute('aria-pressed') !== 'true') {
                        let paneId = this.getAttribute('aria-controls');
                        let pane = self.element('pane').query(`[id="${paneId}"]`);
                        let activePane = self.element('pane').query('[aria-expanded="true"]');
                        let activeTab = self.element('tab').query('[aria-pressed="true"]');

                        activePane && activePane.setAttribute('aria-expanded', 'false');
                        activeTab && activeTab.setAttribute('aria-pressed', 'false');
                        pane && pane.setAttribute('aria-expanded', 'true');
                        this.setAttribute('aria-pressed', true);
                        self.element('state').get().setAttribute('value', paneId);
                    }
                }
            }
        },
        {
            name: 'state'
        },
        {
            name: 'pane'
        },
        {
            name: 'input',
            handlers: {
                change() {
                    let subsetId = this.getAttribute('aria-controls');
                    let subset = self.element('subset').query(`[id="${subsetId}"]`);
                    let activePane = self.element('pane').query('[aria-expanded="true"]');
                    let activeSubset = activePane.querySelector(self.element('subset').selector + '[aria-expanded="true"]');

                    activeSubset && activeSubset.setAttribute('aria-expanded', 'false');
                    subset && subset.setAttribute('aria-expanded', 'true');
                }
            }
        },
        {
            name: 'subset'
        },
        {
            name: 'loader'
        }
    );

    (function init() {

        let content = self.element('content').get();

        window.addEventListener('resize', utils.debounce(function() {
            if (utils.mediaQuery('<line')) {
                if (content.getAttribute('aria-expanded') === 'true') {
                    self.element('content').actions.toggle();
                }
            } else {
                content.setAttribute('aria-expanded', 'true');
            }
        }, 300));

    })();

    return self;
}
