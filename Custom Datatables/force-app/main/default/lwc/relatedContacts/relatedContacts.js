import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

//Columns to use on the data table
const COLUMNS = [
    {label: 'Id', fieldName: 'id', type: 'url', typeAttributes: {label: { fieldName: 'name' }, target: '_blank'}, sortable: true},
    {label: 'Title', fieldName: 'title'},
    {label: 'Phone', fieldName: 'phone'},
    {label: 'Email', fieldName: 'email'},
    {label: 'Mailing City', fieldName: 'city'},
]

export default class RelatedContacts extends LightningElement 
{
    //When your component is invoked in a record context in Lightning Experience 
    //or in the mobile app, recordId is set to the 18-character ID of the record
    @api recordId;

    //Array to store the contacts returned from the Apex call, this variable will
    //also be used to populate the data-table in the HTML 
    @track contacts = [];

    //Populate columns for data table
    columns = COLUMNS;

    //Create wire to get related contacts 

    //Javascript to open modal on New button click
}