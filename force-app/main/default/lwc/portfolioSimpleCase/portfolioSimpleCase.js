import { LightningElement, track } from 'lwc';
import createCaseApex from '@salesforce/apex/CaseCreateController.createCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class PortfolioSimpleCase extends LightningElement {
    @track name = '';
    @track email = '';
    @track description = '';
    @track isSaving = false;
    @track createdCaseId = null;
    @track createdCaseNumber = null;
    @track popupVisible = false;
    @track popupMessage = '';
    @track popupVariant = 'success';
    @track custname;

    handleChange(e) {
        const { name, type, value, checked } = e.target;
        this[name] = type === 'checkbox' ? checked : value;
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.name || !this.email || !this.description) {
            this.showPopup('Missing fields', 'Please provide name, email and a short description.', 'warning');
            return;
        }
        if (!this._validateEmail(this.email)) {
            this.showPopup('Invalid email', 'Please provide a valid email address.', 'error');
            return;
        }

        this.isSaving = true;
        this.custname = this.name
        try {
            const res = await createCaseApex({
                name: this.name,
                email: this.email,
                description: this.description
            });

            if (res && res.success) {
                this.createdCaseId = res.caseId;
                this.createdCaseNumber = res.caseId;
                console.log('>>> ' + JSON.stringify(res))
                this.showPopup(`Case created! Reference ${this.createdCaseNumber}`, 'success');
                this._resetLocalForm();
            } else {
                const message = (res && res.message) ? res.message : 'Unknown error';
                this.showPopup(message, 'error');
            }
        } catch (err) {
            const msg = (err && err.body && err.body.message) ? err.body.message : (err.message || JSON.stringify(err));
            this.showPopup(msg, 'error');
        } finally {
            this.isSaving = false;
        }
    }

    resetForm() {
        this._resetLocalForm();
    }

    _resetLocalForm() {
        this.name = '';
        this.email = '';
        const textarea = this.template.querySelector('textarea[name="description"]');
        if (textarea) {
            textarea.value = '';
        }
    }

    _validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    showPopup(message, variant = 'success') {
        this.popupMessage = message;
        this.popupVariant = variant;
        this.popupVisible = true;

        // auto-dismiss after 3 seconds
        setTimeout(() => {
            this.popupVisible = false;
        }, 5000);
        setTimeout(() => {
            this.createdCaseNumber = null;
        }, 10000);
    }

}