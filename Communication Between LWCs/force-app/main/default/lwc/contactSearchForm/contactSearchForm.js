import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/ContactSearchController.getAccounts';

export default class BoatSearchForm extends LightningElement {
    @track selectedAccountId = '';
  
    // Private
    error = undefined;
    
    @track searchOptions = [];
    
    // Wire a custom Apex method
    @wire(getAccounts)
    accounts({ error, data }) {
        if (data) {
            console.log('getAccounts data: ' + data);
            for(var i=0; i<data.length; i++) {
                this.searchOptions = [...this.searchOptions ,{value: data[i].Id , label: data[i].Name}];                                   
            }
            this.searchOptions.unshift({ label: 'All Accounts', value: '' });

        } else if (error) {
            console.log('getAccounts error: ' + error);
            this.searchOptions = undefined;
            this.error = error;
        }
    }
    
    // Fires event that the search option has changed.
    // passes accountId (value of this.selectedAccountId) in the detail
    handleSearchOptionChange(event) {
        this.selectedAccountId = event.detail.value;
        // Create the const searchEvent
        // searchEvent must be the new custom event search
        const searchEvent = new CustomEvent('search', { detail: {accountId : this.selectedAccountId} });
        this.dispatchEvent(searchEvent);
    }
}