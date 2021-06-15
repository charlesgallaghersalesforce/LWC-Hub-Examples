import { LightningElement, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { subscribe, MessageContext, APPLICATION_SCOPE, publish } from 'lightning/messageService';
import ContactMC from '@salesforce/messageChannel/ContactMessageChannel__c';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

// Contact Schema Imports
import CONTACT_ID_FIELD from '@salesforce/schema/Contact.Id';
import CONTACT_FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
const CONTACT_FIELDS = [CONTACT_ID_FIELD, CONTACT_FIRSTNAME_FIELD, CONTACT_LASTNAME_FIELD];

export default class ContactDetails extends NavigationMixin(LightningElement) {
    contactId;
    @track wiredRecord;
    
    // Decide when to show or hide the icon
    // returns 'standard:contact' or null
    get detailsTabIconName() {
        return this.wiredRecord.data ? 'standard:contact' : null;
    }
    
    // Utilize getFieldValue to extract the boat name from the record wire
    get contactName() {
        let firstName = getFieldValue(this.wiredRecord.data, CONTACT_FIRSTNAME_FIELD);
        let lastName = getFieldValue(this.wiredRecord.data, CONTACT_LASTNAME_FIELD);
        return firstName + ' ' + lastName;
    }

    @wire(getRecord,{ recordId: '$contactId', fields: CONTACT_FIELDS})
    wiredRecord;
    
    // Private
    subscription = null;

    // Initialize messageContext for Message Service
    @wire(MessageContext)
    messageContext;

    // Subscribe to the message channel
    subscribeMC() {
        // local contactId must receive the recordId from the message
        if (this.subscription || this.contactId) {
        return;
        }
        // Subscribe to the message channel to retrieve the recordId and explicitly assign it to contactId.
        if (!this.subscription) {
        this.subscription = subscribe(
            this.messageContext,
            ContactMC,
            (message) => { 
                if (!message.refreshResults) {
                    this.contactId = message.recordId; 
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

    handleSuccess() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Contact updated successfully!',
                variant: 'success'
            })
        );
        publish(this.messageContext, ContactMC, { 
            recordId : this.contactId,
            refreshResults : true
        });
    }
    
    // Navigates to record page
    navigateToRecordViewPage() {
        this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.contactId,
            actionName: 'view'
        }
        });
    }
}
