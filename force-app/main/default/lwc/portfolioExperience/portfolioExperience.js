import { LightningElement } from 'lwc';

export default class PortfolioExperience extends LightningElement {
    roles = [
        {
            id: 1,
            title: 'Sr. Salesforce Developer',
            company: 'Global K-Cloud Technologies Pvt. Ltd.',
            years: 'Jan-25 – Present',
            contributions: [
                'Automated lead assignment using Apex + Flows, reducing manual routing work by ~80%.',
                'Integrated Salesforce with a Warehouse Management System via REST API using Queueable jobs and Named Credentials.',
                'Designed a Lightning Web Component table for inline Event editing, improving planner productivity.',
                'Built Pardot + Calendly scoring automation that increased MQL conversion by ~30%.',
                'Established branching standards and CI/CD pipeline for sandbox-to-production promotions.'
            ]
        },
        {
            id: 2,
            title: 'Salesforce Administrator & Developer',
            company: 'Lince Soft Solutions Pvt. Ltd.',
            years: 'Oct-21 – Dec-24',
            contributions: [
                'Re-designed Sales Cloud data model for account hierarchy and entitlement tracking.',
                'Implemented Experience Cloud partner portal with guided quoting flows.',
                'Introduced Flow-based automation to replace legacy Workflow Rules.',
                'Optimized reports & dashboards for CS and RevOps teams.'
            ]
        }
    ];
}