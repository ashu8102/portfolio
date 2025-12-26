import { LightningElement } from 'lwc';
export default class PortfolioContact extends LightningElement {
    get currentYear() {
        return new Date().getFullYear();
    }
}