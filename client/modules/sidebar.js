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
            name: 'content',
            handlers: {
                transitionend() {
                    this.style.maxHeight = '';
                }
            }
        },
        {
            name: 'switch',
            handlers: {
                click() {
                    let content = self.element('content').get();

                    utils.toggleAttribute(this, 'aria-pressed');
                    content.style.maxHeight = (content.scrollHeight + 10) + 'px';
                    utils.toggleAttribute(content, 'aria-expanded');
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
                    }
                }
            }
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
                    let activeSubset = self.element('subset').query('[aria-expanded="true"]');

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
                    content.style.maxHeight = (content.scrollHeight + 10) + 'px';
                    utils.toggleAttribute(content, 'aria-expanded');
                }
            } else {
                content.setAttribute('aria-expanded', 'true');
            }
        }, 300));

    })();

    return self;
}
