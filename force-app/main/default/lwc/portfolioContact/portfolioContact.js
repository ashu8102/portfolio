import { LightningElement } from 'lwc';
import emailIcon from '@salesforce/resourceUrl/email_icon';
import linkedinIcon from '@salesforce/resourceUrl/linkedin_icon';
import githubIcon from '@salesforce/resourceUrl/github_icon';
import whatsappIcon from '@salesforce/resourceUrl/whatsapp_icon';
export default class PortfolioContact extends LightningElement {

    emailIcon = emailIcon;
    linkedinIcon = linkedinIcon;
    githubIcon = githubIcon;
    whatsappIcon = whatsappIcon;

    
    get currentYear() {
        return new Date().getFullYear();
    }
}