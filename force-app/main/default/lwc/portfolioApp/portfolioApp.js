import { LightningElement, track } from 'lwc';
import HbLogo from '@salesforce/resourceUrl/HubspotLogo';
export default class PortfolioApp extends LightningElement {
    @track showMobileNav = false;
    @track showOpenToWorkModal = true;
    @track activeSection = 'hero';
    hbLogo = HbLogo;

    navItems = [
        { id: 'hero', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        // { id: 'demos', label: 'Demos' },
        // { id: 'testimonials', label: 'Testimonials' },
        { id: 'contact', label: 'Contact' },
        // { id: 'support', label: 'Support' }
    ];

    get navItemsWithClass() {
        return this.navItems.map((item) => {
            const base = 'portfolio__nav-item slds-button slds-button_reset';
            const baseMobile = 'portfolio__nav-item-mobile slds-button slds-button_reset';
            const isActive = item.id === this.activeSection;
            return {
                ...item,
                className: isActive ? `${base} portfolio__nav-item_active` : base,
                classNameMobile: isActive
                    ? `${baseMobile} portfolio__nav-item-mobile_active`
                    : baseMobile
            };
        });
    }

    toggleMobileNav() {
        this.showMobileNav = !this.showMobileNav;
    }

    handleNavClick(event) {
        const sectionName = event.currentTarget.dataset.section;
        if (!sectionName) return;

        this.activeSection = sectionName;
        this.showMobileNav = false;
        this.scrollToSection(sectionName);
    }

    handleViewPortfolio() {
        this.showOpenToWorkModal = false;
        this.scrollToSection('hero');
    }

    handleCloseModal() {
        this.showOpenToWorkModal = false;
    }

    // scrollToSection(sectionName) {
    //     const section = this.template.querySelector(`section[data-id="${sectionName}"]`);
    //     if (section) {
    //         section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    //     }
    // }
    scrollToSection(sectionName) {
        const section = this.template.querySelector(`section[data-id="${sectionName}"]`);
        if (section) {
            const yOffset = -80; // top padding offset
            const y = section.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }
}