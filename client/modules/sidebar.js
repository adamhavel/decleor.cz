/* ==========================================================================
   Sidebar
   ========================================================================== */

import component from 'component.js';

export default function(node, selector) {

    const self = component(node, selector);

    self.define(
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
        }
    );

    return self;
}
