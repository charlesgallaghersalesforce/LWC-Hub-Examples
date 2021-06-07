import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import getContacts from '@salesforce/apex/GetRelatedContacts.getContacts';
import updateContacts from '@salesforce/apex/GetRelatedContacts.updateContacts';

//Columns to use on the data table
const COLUMNS = [
    {label: 'Id', fieldName: 'id', type: 'url', typeAttributes: {label: { fieldName: 'name' }, target: '_blank'}, sortable: true},
    {label: 'Title', fieldName: 'title', editable: true},
    {label: 'Phone', fieldName: 'phone', editable: true},
    {label: 'Email', fieldName: 'email', editable: true},
    {label: 'Mailing City', fieldName: 'city'}
]

export default class RelatedContacts extends LightningElement 
{
    //When you use object destructuring you're extracting values from the provisioned value, losing the provisioned value itself
    //So we need this seperate variable to make refreshApex work (i.e {data, error} doesn't work with refreshApex)
    //For reference: https://salesforce.stackexchange.com/questions/251782/cant-get-refreshapex-to-work-in-lwc
    provisionedValue; 

    //When your component is invoked in a record context in Lightning Experience 
    //or in the mobile app, recordId is set to the 18-character ID of the record
    @api recordId;

    //Array to store the contacts returned from the Apex call, this variable will
    //also be used to populate the data-table in the HTML 
    @track contacts = [];

    //Populate columns for data table
    columns = COLUMNS;

    //Variable to track edits
    draftValues = [];

    //Create wire to get related contacts
    @wire(getContacts, {accountId: '$recordId'})
    wiredContacts(provisionedValue)
    {
        this.provisionedValue = provisionedValue; // track the provisioned value
        const { data, error } = provisionedValue; // destructure it for convenience
        if(data)
        {
            //Set the data for the table
            let temp = [];
            data.forEach(element => {
                let elt = {};
                elt.name = element.Name;
                elt.id = `/${element.Id}`;
                elt.title = element.Title;
                elt.phone = element.Phone;
                elt.email = element.Email;
                elt.city = element.MailingCity;
                temp.push(elt);
            });

            this.contacts = temp;
        }
        else
        {
            const event = new ShowToastEvent({
                "title": "Problem retrieving Contacts",
                "message": "There was a problem retrieving the related contacts for this account",
            });
            this.dispatchEvent(event);
        }
    } 

    //Handle save
    handleSave(event) {

        const fields = {}; 

        //Make list of contacts to update
        let editedContacts = [];

        //Go through all updated contacts and new values and push those to the editedContacts array
        for(const draftContact in event.detail.draftValues)
        {
            let tempContact = {};

            let values = event.detail.draftValues[draftContact];

            let rowId = (values.Id).slice(4); 

            for(const newValue in values)
            {
                if(newValue == 'email')
                {
                    tempContact.Email = values.email;
                }
                else if(newValue == 'phone')
                {
                    tempContact.Phone = values.phone;
                }
                else if(newValue == 'title')
                {
                    tempContact.Title = values.title;
                }

                tempContact.Id = (this.contacts[rowId].id).slice(1);
            }

            editedContacts.push(tempContact);
        }

        //Update the contacts
        updateContacts({
            contactsToUpdate: editedContacts
        })
        .then(result => {

            this.draftValues = [];

            // Display fresh data in the datatable
            this.refresh();

            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contacts updated',
                    variant: 'success'
                })
            );

        })
        .catch(error => {
            const event = new ShowToastEvent({
                "title": "Problem updating Contacts",
                "message": "There was a problem updating the related contacts for this account",
            });
            this.dispatchEvent(event);
        })
    }

    refresh() {
        return refreshApex(this.provisionedValue); 
    }

    //Javascript to open modal on New button click
}