import { LightningElement } from 'lwc';

export default class PortfolioProjects extends LightningElement {
projects = [
    {
        id: 1,
        title: 'WMS Order Sync',
        subtitle: 'Bi-directional integration between Salesforce Orders and a Warehouse Management System',
        type: 'Integration',
        description:
            'Implemented a fault-tolerant order synchronization that keeps Salesforce and WMS in sync with clear error surfacing for customer support teams.',
        tech: ['Apex REST', 'Queueable', 'Named Credentials', 'Custom Metadata'],
        challenges:
            'Handling partial failures, rate limits, and ensuring idempotency when WMS re-sends payloads.',
        outcome:
            'Reduced order update turnaround time from hours to minutes and decreased integration incidents.',
        snippet: ''
            //'QueueableContext ctx;\nHttpRequest req = new HttpRequest();\nreq.setEndpoint(label.WMS_NC_Endpoint + "/orders" );\nreq.setMethod('POST');\nreq.setBody(JSON.serialize(orderDtos));'
    },
    {
        id: 2,
        title: 'MISMO 3.4 XML Parser',
        subtitle: 'Mortgage data ingestion into custom Salesforce data model',
        type: 'Data Processing',
        description:
            'Parsed and normalized MISMO 3.4 XML into a normalized Salesforce schema powering underwriting workflows.',
        tech: ['Apex', 'DOM XML', 'Custom Objects', 'Batch Apex'],
        challenges:
            'Complex nested structures and mapping to a human-readable schema used by operations.',
        outcome:
            'Cut manual data entry time per loan file by ~60% and improved data consistency.',
        snippet:
            'Dom.Document doc = new Dom.Document();\ndoc.load(mismoXml);\nDom.XmlNode root = doc.getRootElement();\n// Traverse & map nodes into custom objects'
    },
    {
        id: 3,
        title: 'Bulk Contact Flow Launcher',
        subtitle: 'Marketing automation helper for operations team',
        type: 'Automation',
        description:
            'Built a UI-based bulk launcher that enrolls selected Contacts into Flow-based campaigns with guardrails.',
        tech: ['LWC', 'Flow', 'Apex', 'DataTable'],
        challenges:
            'Respecting Flow limits while keeping the UI responsive for large selections.',
        outcome:
            'Enabled CS teams to self-serve campaign enrollments without admin support.',
        snippet:
            '@AuraEnabled(cacheable=false)\npublic static void launchFlow(List<Id> contactIds) {\n    // Chunk IDs and invoke autolaunched flow in batches\n}'
    },
    {
        id: 4,
        title: 'LWC Data Table Dashboard',
        subtitle: 'Inline editing dashboard for sales managers',
        type: 'UI/UX',
        description:
            'An Experience Cloud-ready dashboard with inline editable tables and server-side pagination.',
        tech: ['LWC', 'Apex', 'SOQL', 'Experience Cloud'],
        challenges:
            'Balancing flexibility in filters with performance on large datasets.',
        outcome:
            'Improved pipeline hygiene and forecasting accuracy for sales leaders.',
        snippet:
            '<lightning-datatable key-field="id" data={rows} columns={columns} draft-values={draftValues} onsave={handleSave}></lightning-datatable>'
    },
    {
        id: 5,
        title: 'Pardot + Calendly Scoring Automation',
        subtitle: 'Behavior-based lead qualification pipeline',
        type: 'Marketing Ops',
        description:
            'Scoring model that reacts to Calendly bookings, email link clicks, and form submissions.',
        tech: ['Pardot', 'Engagement Studio', 'Apex', 'Platform Events'],
        challenges:
            'Aligning sales expectations with marketing actions, while keeping the model transparent.',
        outcome:
            'Increased MQL-to-SQL conversion and shortened time-to-first-meeting.',
        snippet:''
            //'// Pseudo logic for engagement scoring\nif (event__c.Type__c == 'Calendly Booking') score += 40;\nif (event__c.Type__c == 'Pricing Link Click') score += 20;'
    },
    {
id: 6,
title: 'B2B Commerce Cloud Implementation',
subtitle: 'Scalable digital storefront for B2B buyers',
type: 'B2B Commerce',
description:
    'End-to-end Salesforce B2B Commerce solution enabling account-based pricing, self-service ordering, and seamless ERP integration.',
tech: [
    'B2B LWR',
    'LWC',
    'Apex',
    'Commerce API',
    'Pricing & Catalog Management'
],
challenges:
    'Handling complex account-specific pricing, large product catalogs, and real-time inventory sync without impacting storefront performance.',
outcome:
    'Delivered a high-performance B2B storefront with personalized pricing, faster order placement, and improved customer self-service adoption.',
snippet: ''
    // '// Pseudo logic for account-based pricing\nif (buyer.Account__c == tier1) applyPricebook(Tier1);\nelse applyPricebook(Standard);'
}

];
}