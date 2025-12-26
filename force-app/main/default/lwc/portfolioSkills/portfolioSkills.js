import { LightningElement, track } from 'lwc';
import PD1_Badge from '@salesforce/resourceUrl/PD1_Badge';
import PD2_Badge from '@salesforce/resourceUrl/PD2_Badge';
import ADMIN_Badge from '@salesforce/resourceUrl/ADMIN_Badge';
import APP_Badge from '@salesforce/resourceUrl/APP_Badge';
import JS1_Badge from '@salesforce/resourceUrl/JS1_Badge';
import AIA_Badge from '@salesforce/resourceUrl/AIA_Badge';
import COPADO_Badge1 from '@salesforce/resourceUrl/COPADO_Badge1';
//import COPADO_Badge2 from '@salesforce/resourceUrl/COPADO_Badge2';

export default class PortfolioSkills extends LightningElement {
    @track activeIndex = 0;
    intervalId;

    skillGroups = [
        {
            title: 'Salesforce Platform',
            icon: 'utility:salesforce1',
            items: [
                'Salesforce configuration & setup',
                'Salesforce Data Model design',
                'SOQL / SOSL optimization',
                'Security model & sharing'
            ]
        },
        {
            title: 'Apex Engineering',
            icon: 'utility:apex',
            items: [
                'Triggers & trigger frameworks',
                'Batch Apex & Queueable jobs',
                'Scheduled jobs & asynchronous patterns',
                'Platform events & transaction design'
            ]
        },
        {
            title: 'Integrations',
            icon: 'utility:integration',
            items: [
                'REST & SOAP integrations',
                'Named Credentials & external services',
                'WMS, HubSpot, Calendly, Commerce Cloud APIs',
                'Error handling & retry strategies'
            ]
        },
        {
            title: 'Front-End & UX',
            icon: 'utility:component_customization',
            items: [
                'LWC, Aura, Web Components',
                'SLDS-driven UX design',
                'Experience Cloud theming',
                'Dynamic data tables & dashboards'
            ]
        },
        {
            title: 'Automation',
            icon: 'utility:builder',
            items: [
                'Flow Builder & orchestration',
                'Pardot Engagement Studio journeys',
                'HubSpot automation & scoring',
                'Lead lifecycle & MQL definitions'
            ]
        },
        {
            title: 'DevOps & Quality',
            icon: 'utility:success',
            items: [
                'Git-based branching strategies',
                'CI/CD pipelines (Copado / GitHub Actions)',
                'Unit testing & code coverage',
                'Code reviews & standards'
            ]
        }
    ];

    // add completionDate, issuer, shortDescription, verifyUrl per cert
    certifications = [
        { certId: 'PD1', name: 'Salesforce Platform Developer I', type: 'Developer', badgeUrl: PD1_Badge, completionDate: 'Mar 2023', issuer: 'Salesforce', shortDescription: 'Core Apex & platform fundamentals.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 0 },
        { certId: 'PD2', name: 'Salesforce Platform Developer II', type: 'Developer', badgeUrl: PD2_Badge, completionDate: 'Aug 2024', issuer: 'Salesforce', shortDescription: 'Advanced architecture & design patterns.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 1 },
        { certId: 'ADMIN', name: 'Salesforce Certified Administrator', type: 'Admin', badgeUrl: ADMIN_Badge, completionDate: 'Jan 2022', issuer: 'Salesforce', shortDescription: 'Platform setup, security & automation.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 2 },
        { certId: 'APP', name: 'Platform App Builder', type: 'App Builder', badgeUrl: APP_Badge, completionDate: 'May 2022', issuer: 'Salesforce', shortDescription: 'Declarative app design & data model.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 3 },
        { certId: 'JS1', name: 'JavaScript Developer I', type: 'Developer', badgeUrl: JS1_Badge, completionDate: 'Jun 2024', issuer: 'Salesforce', shortDescription: 'Modern JS & LWC best practices.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 4 },
        { certId: 'AI-A', name: 'AI Associate', type: 'AI', badgeUrl: AIA_Badge, completionDate: 'Feb 2024', issuer: 'Salesforce', shortDescription: 'AI fundamentals for Salesforce.', verifyUrl: 'https://trailhead.salesforce.com/en/credentials/verification/', idx: 5 },
        { certId: 'COPADO1', name: 'Copado Certified I', type: 'DevOps', badgeUrl: COPADO_Badge1, completionDate: 'Sep 2023', issuer: 'Copado', shortDescription: 'DevOps workflows & deployments.', verifyUrl: '', idx: 6 },
        //{ certId: 'COPADO2', name: 'Copado Certified II', type: 'DevOps', badgeUrl: COPADO_Badge2, completionDate: 'Nov 2024', issuer: 'Copado', shortDescription: 'Advanced release automation.', verifyUrl: '', idx: 7 }
    ];

    get certificationsWithIndex() {
        return this.certifications.map((c, idx) => {
            const initials = c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
            const isActive = idx === this.activeIndex;
            return {
                ...c,
                idx,
                initials,
                styleVar: `--i:${idx};`,
                isActive,
                itemClass: isActive ? 'cert-rail__item active' : 'cert-rail__item',
                dotClass: isActive ? 'dot active' : 'dot',
                ariaSelected: isActive ? 'true' : 'false'
            };
        });
    }

    // exposes active certificate to template easily
    get activeCert() {
        const c = this.certifications[this.activeIndex] || {};
        // ensure fallback fields exist
        return {
            ...c,
            initials: c.name ? c.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '',
            badgeUrl: c.badgeUrl || '',
            certId: c.certId || '',
            completionDate: c.completionDate || '—',
            issuer: c.issuer || '—',
            shortDescription: c.shortDescription || '',
            verifyUrl: c.verifyUrl || ''
        };
    }

    connectedCallback() {
        // auto-advance every 3s
        this.intervalId = setInterval(() => {
            this.activeIndex = (this.activeIndex + 1) % this.certifications.length;
            window.requestAnimationFrame(() => this.centerActiveInRail());
        }, 10000);
    }

    disconnectedCallback() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    // Dot click updates active index and centers it
    handleDotClick(event) {
        const idx = parseInt(event.currentTarget.dataset.index, 10);
        if (!Number.isNaN(idx)) {
            this.activeIndex = idx;
            setTimeout(() => this.centerActiveInRail(), 60);
        }
    }

    // clicking an item in rail also makes it active and centers
    handleRailItemClick(event) {
        const el = event.currentTarget;
        const idx = parseInt(el.dataset.index, 10);
        if (!Number.isNaN(idx)) {
            this.activeIndex = idx;
            setTimeout(() => this.centerActiveInRail(), 60);
        }
    }

    renderedCallback() {
        this.centerActiveInRail();
    }

    centerActiveInRail() {
        try {
            const railInner = this.template.querySelector('.cert-rail__inner');
            const activeEl = this.template.querySelector('.cert-rail__item.active');

            if (!railInner || !activeEl) return;

            const containerWidth = railInner.clientWidth;
            const elLeft = activeEl.offsetLeft;
            const elWidth = activeEl.offsetWidth;
            const targetScrollLeft = Math.max(0, Math.round(elLeft + (elWidth / 2) - (containerWidth / 2)));

            if ('scrollTo' in railInner) {
                railInner.scrollTo({ left: targetScrollLeft, behavior: 'smooth' });
            } else {
                railInner.scrollLeft = targetScrollLeft;
            }
        } catch (e) {
            // ignore
        }
    }
}