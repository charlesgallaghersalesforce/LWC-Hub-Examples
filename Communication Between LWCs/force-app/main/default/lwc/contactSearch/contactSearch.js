import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class ContactSearch extends NavigationMixin(LightningElement) {

    isLoading = false;

    accountId = '';
  
    // Handles loading event
    handleLoading() { 
        this.isLoading = true;
    }
    
    // Handles done loading event
    handleDoneLoading() {
        this.isLoading = false;
    }
    
    // Handles search contact event
    // This custom event comes from the form
    searchContacts(event) {
        const selectedAccount = event.detail.accountId;
        this.accountId = selectedAccount;
        this.template.querySelector("c-contact-search-results").searchContacts(this.accountId);
    }

}