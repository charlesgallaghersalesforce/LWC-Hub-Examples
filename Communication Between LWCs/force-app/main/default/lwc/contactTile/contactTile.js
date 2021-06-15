import { LightningElement, wire, api } from 'lwc';

const TILE_WRAPPER_SELECTED_CLASS = 'tile-wrapper selected';
const TILE_WRAPPER_UNSELECTED_CLASS = 'tile-wrapper';

export default class ContactTile extends LightningElement {
    @api contact;
    @api selectedContactId;
    
    // Getter for dynamically setting the background image for the picture
    get backgroundStyle() {
        return 'background-image:url(https://playful-shark-clandr-dev-ed--c.visualforce.com/resource/1623623736000/Avatar)';
    }
    
    // Getter for dynamically setting the tile class based on whether the
    // current boat is selected
    get tileClass() {
        if (this.contact.Id == this.selectedContactId) {
            return TILE_WRAPPER_SELECTED_CLASS;
        }
        return TILE_WRAPPER_UNSELECTED_CLASS;
    }
    
    // Fires event with the Id of the boat that has been selected.
    selectContact() {
        this.selectedContactId = this.contact.Id;
        const selectContact = new CustomEvent('contactselect', { detail: {contactId : this.selectedContactId} });
        this.dispatchEvent(selectContact);
    }
}
  