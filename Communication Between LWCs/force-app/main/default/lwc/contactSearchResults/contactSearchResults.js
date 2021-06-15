import { LightningElement, wire, api, track } from 'lwc';
import getContacts from '@salesforce/apex/ContactSearchController.getContacts';
import { refreshApex } from '@salesforce/apex';
import { publish, subscribe, MessageContext, APPLICATION_SCOPE } from 'lightning/messageService';
import ContactMC from '@salesforce/messageChannel/ContactMessageChannel__c';

export default class ContactSearchResults extends LightningElement {
    @api accountId = '';
    @track contacts;
    @track selectedContactId = '';
    isLoading = false;
    error = undefined;
    wiredContactsResult;

    @wire(MessageContext) messageContext;

    // Subscribe to the message channel
    subscribeMC() {
        // local contactId must receive the recordId from the message
        if (this.subscription || this.selectedContactId) {
            return;
        }
        // Subscribe to the message channel to retrieve the recordId and explicitly assign it to contactId.
        if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            ContactMC,
            (message) => { 
                if (message.refreshResults) {
                    this.refresh();
                }
            },
            { scope: APPLICATION_SCOPE }
        );
        }
    }
    // Calls subscribeMC()
    connectedCallback() {
        this.subscribeMC();
    }

    @api
    searchContacts(accountId) {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);
        this.accountId = accountId;
    }

    @wire(getContacts, { accountId: '$accountId' })
    wiredContacts(result) {
        this.contacts = result;
        if (result.error) {
            this.error = result.error;
            this.contacts = undefined;
        }
        this.isLoading = false;
        this.notifyLoading(this.isLoading);
    }

    updateSelectedTile(event) {
        this.selectedContactId = event.detail.contactId;
        this.sendMessageService(this.selectedContactId);
    }

    @api
    async refresh() {
        this.isLoading = true;
        this.notifyLoading(this.isLoading);      
        await refreshApex(this.contacts);
        this.isLoading = false;
        this.notifyLoading(this.isLoading);        
    }

    notifyLoading(isLoading) {
        if (isLoading) {
            this.dispatchEvent(new CustomEvent('loading'));
        } else {
            this.dispatchEvent(new CustomEvent('doneloading'));
        }
    }

    sendMessageService(contactId) { 
        publish(this.messageContext, ContactMC, { 
            recordId : contactId,
            refreshResults : false
        });
    }
}