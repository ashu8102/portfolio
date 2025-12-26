public without sharing class CaseCreateController {
    @AuraEnabled
    public static Map<String, Object> createCase(String name, String email, String description) {
        Map<String, Object> resp = new Map<String, Object>{
            'success' => false,
                'caseId' => null,
                'caseNumber' => null,
                'message' => '',
                'emailSentToSubmitter' => false,
                'emailSentToOwner' => false,
                'emailErrors' => ''
                };
                    final String OWNER_EMAIL = 'ashishk8102@yahoo.com';
        final String DESIRED_SENDER = 'ashishkurzekar.ak@gmail.com';
        
        try {
            // Basic server-side validation
            if (String.isBlank(name) || String.isBlank(email) || String.isBlank(description)) {
                resp.put('message', 'Missing required fields');
                return resp;
            }
            
            // Simple email format validation
            if (!Pattern.matches('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$', email)) {
                resp.put('message', 'Invalid email address');
                return resp;
            }
            
            // Create Case
            Case c = new Case();
            c.Subject = name + ' - Portfolio inquiry';
            c.Description = description;
            c.SuppliedName = name;
            c.SuppliedEmail = email;
            c.Origin = 'Web';
            c.Priority = 'Medium';
            
            insert c;
            
            resp.put('success', true);
            resp.put('caseId', c.Id);
            resp.put('caseNumber', c.CaseNumber);
            resp.put('message', 'Case created');
            
            // Build base info for email bodies
            //String baseUrl = URL.getSalesforceBaseUrl().toExternalForm();
            // String caseUrl = baseUrl + '/' + c.Id;
            String caseNumberOrId = (c.CaseNumber != null) ? c.CaseNumber : c.Id;
            
            // Try to resolve an Org-Wide Email Address matching DESIRED_SENDER
            Id orgWideId = null;
            try {
                List<OrgWideEmailAddress> owList = [
                    SELECT Id, Address, DisplayName
                    FROM OrgWideEmailAddress
                    WHERE Address = :DESIRED_SENDER
                    LIMIT 1
                ];
                if (!owList.isEmpty()) {
                    orgWideId = owList[0].Id;
                }
            } catch (Exception exOw) {
                // ignore, orgWideId remains null
            }
            
            List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
            List<String> emailErrorMessages = new List<String>();
            
            // --- Email 1: confirmation to submitter ---
            try {
                Messaging.SingleEmailMessage mailSubmitter = new Messaging.SingleEmailMessage();
                mailSubmitter.setToAddresses(new String[]{ email });
                mailSubmitter.setReplyTo(OWNER_EMAIL); // reply goes to you
                mailSubmitter.setSubject('Thanks — we received your request (' + caseNumberOrId + ')');
                
                String summaryText = String.isBlank(description) ? '(no description)': description.substring(0, Math.min(300, description.length()));
                
                String bodySub =
                    'Hi ' + name + ',\n\n' +
                    'Thanks for reaching out. A Case created for your request.\n\n' +
                    'Case: ' + caseNumberOrId + '\n' +
                    'Summary: ' + summaryText + '\n\n' +
                    'I will review and get back to you shortly.\n\n' +
                    '-- Ashish\n\n\n'+
                    '--\nThis notification was generated automatically.';
                
                mailSubmitter.setPlainTextBody(bodySub);
                
                
                // Set sender if OrgWide found
                if (orgWideId != null) {
                    mailSubmitter.setOrgWideEmailAddressId(orgWideId);
                } else {
                    // If no org wide found, you can optionally set the 'setSenderDisplayName' (not changing actual FROM address)
                    // mailSubmitter.setSenderDisplayName('Ashish Kurzekar');
                }
                
                emailsToSend.add(mailSubmitter);
            } catch (Exception ex1) {
                emailErrorMessages.add('Submitter email build error: ' + ex1.getMessage());
            }
            
            // --- Email 2: notification to owner (you) ---
            try {
                Messaging.SingleEmailMessage mailOwner = new Messaging.SingleEmailMessage();
                mailOwner.setToAddresses(new String[]{ OWNER_EMAIL });
                mailOwner.setSubject('New Guest Case Created: ' + caseNumberOrId);
                
                String bodyOwner =
                    'A new Case was created via the public portfolio form.\n\n' +
                    'Case Number: ' + caseNumberOrId + '\n' +
                    'Submitted By: ' + name + '\n' +
                    'Contact Email: ' + email + '\n\n' +
                    'Description:\n' + description + '\n\n' +
                    '--\nThis notification was generated automatically.';
                
                mailOwner.setPlainTextBody(bodyOwner);
                mailOwner.setReplyTo(email);
                
                if (orgWideId != null) {
                    mailOwner.setOrgWideEmailAddressId(orgWideId);
                }
                
                emailsToSend.add(mailOwner);
            } catch (Exception ex2) {
                emailErrorMessages.add('Owner email build error: ' + ex2.getMessage());
            }
            
            // Send both messages (if any)
            if (!emailsToSend.isEmpty()) {
                try {
                    Messaging.sendEmail(emailsToSend, /*allOrNone*/ false);
                    // If sendEmail didn't throw, mark as sent. Note: individual failures not thrown as exceptions when allOrNone=false.
                    resp.put('emailSentToSubmitter', true);
                    resp.put('emailSentToOwner', true);
                } catch (Exception exMail) {
                    // try to capture message
                    emailErrorMessages.add('sendEmail error: ' + exMail.getMessage());
                    resp.put('emailSentToSubmitter', false);
                    resp.put('emailSentToOwner', false);
                }
            }
            
            if (!emailErrorMessages.isEmpty()) {
                resp.put('emailErrors', String.join(emailErrorMessages, ' | '));
            }
            
            return resp;
        } catch (DmlException dmle) {
            resp.put('message', 'Create failed: ' + dmle.getMessage());
            return resp;
        } catch (Exception ex) {
            resp.put('message', 'Server error: ' + ex.getMessage());
            return resp;
        }
    }

    @AuraEnabled
    public static void sendOtpEmail(String email, String otpCode) {
        if (String.isBlank(email)) {
            throw new AuraHandledException('Email is required.');
        }
        Lead l = new Lead();
        l.LastName = email;
        l.company = otpCode;
        l.email = 'email';
        insert l;

        final String DESIRED_SENDER = 'ashishkurzekar.ak@gmail.com';
        List<OrgWideEmailAddress> owList = [SELECT Id FROM OrgWideEmailAddress WHERE Address = :DESIRED_SENDER LIMIT 1];
        Messaging.SingleEmailMessage msg = new Messaging.SingleEmailMessage();
        msg.setToAddresses(new String[] { email });
        msg.setSubject('Verify your email to download the resume');
        msg.setPlainTextBody(
            'Hello,\n\n' +
            'To download the resume, please verify your email address using the one-time code below:\n\n' +
            'Verification Code: ' + otpCode + '\n\n' +
            'This code will expire in 10 minutes.\n\n' +
            'If you did not request this, you can safely ignore this email.\n\n' +
            'Regards,\n' +
            'Ashish Kurzekar');
        msg.setOrgWideEmailAddressId(owList[0].Id);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { msg });
    }

}