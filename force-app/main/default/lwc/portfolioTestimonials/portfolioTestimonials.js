import { LightningElement, track } from 'lwc';

export default class PortfolioTestimonials extends LightningElement {
    @track activeIndex = 0;

    testimonials = [
        {
            name: 'Head of Digital, Healthcare Brand',
            role: 'Executive stakeholder',
            quote:
                'Delivered a complex Salesforce + WMS integration while communicating clearly and keeping non-technical stakeholders aligned.'
        },
        {
            name: 'Sales Operations Manager',
            role: 'Sales Cloud stakeholder',
            quote:
                'Transformed our lead management process with automation and dashboards that the team actually enjoys using.'
        },
        {
            name: 'Marketing Automation Lead',
            role: 'Pardot stakeholder',
            quote:
                'Our scoring model and Engagement Studio programs are more transparent and data-driven thanks to his work.'
        }
    ];

    get currentTestimonial() {
        return this.testimonials[this.activeIndex];
    }

    get isFirstActive() {
        return this.activeIndex === 0;
    }

    get isSecondActive() {
        return this.activeIndex === 1;
    }

    get isThirdActive() {
        return this.activeIndex === 2;
    }

    handlePrev() {
        this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }

    handleNext() {
        this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
    }
}