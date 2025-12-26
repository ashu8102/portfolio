import { LightningElement, track } from 'lwc';
import avatarUrl from '@salesforce/resourceUrl/avatarUrl';
import sendOtpEmail from '@salesforce/apex/CaseCreateController.sendOtpEmail';

export default class PortfolioHero extends LightningElement {
    avatarUrl = avatarUrl;

    @track showModal = false;
    @track stepEmail = true;
    @track stepOtp = false;
    @track email = '';
    @track otpGenerated;
    @track otpInput = '';
    @track error = '';

    resumeUrl = '/sfc/servlet.shepherd/document/download/RESUME_PLACEHOLDER';

    openModal() {
        this.showModal = true;
        this.stepEmail = true;
        this.stepOtp = false;
        this.error = '';
        if(this.otpGenerated) this.stepOtp = true;
    }
    closeModal() {
        this.showModal = false;
        this.error = null;
        this.stepEmail = true;
        this.stepOtp = false;
        this.otpInput = '';
    }


    handleEmail(event) {
        this.email = event.target.value;
    }

    async sendOtp() {
        if (!this.email) {
            this.error = 'Please enter a valid email';
            return;
        }
        // Generate OTP in JS
        this.otpGenerated = Math.floor(100000 + Math.random() * 900000).toString();

        try {
            await sendOtpEmail({ email: this.email, otpCode: this.otpGenerated })
                .then(() => {
                    this.stepEmail = false;
                    this.stepOtp = true;
                }).catch(() => {
                    this.error = 'Failed to send OTP email';
                });

        } catch (e) {
            this.error = e?.body?.message || 'Failed to send OTP';
        }
    }


    handleOtp(event) {
        this.otpInput = event.target.value;
    }

    verifyOtp() {
        if (this.otpInput === this.otpGenerated) {
            window.open(this.resumeUrl, '_blank');
            this.showModal = false;
        } else {
            this.error = 'Invalid OTP';
        }
    }
}