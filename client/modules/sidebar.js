/* ==========================================================================
   Sidebar
   ========================================================================== */

import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
        {
            name: 'self',
            handlers: {
                change: function() {
                    self.element('loader').get().classList.add('is-active');
                }
            }
        },
        {
            name: 'tab',
            isCollection: true,
            handlers: {
                click: function(ev) {
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
            name: 'pane',
            isCollection: true
        },
        {
            name: 'input',
            isCollection: true,
            handlers: {
                change: function() {
                    let subsetId = this.getAttribute('aria-controls');
                    let subset = self.element('subset').query(`[id="${subsetId}"]`);
                    let activeSubset = self.element('subset').query('[aria-expanded="true"]');

                    activeSubset && activeSubset.setAttribute('aria-expanded', 'false');
                    subset && subset.setAttribute('aria-expanded', 'true');
                    self.element('loader').get().classList.add('is-active');
                }
            }
        },
        {
            name: 'subset',
            isCollection: true
        },
        {
            name: 'loader'
        }
    );

    return self;
}
