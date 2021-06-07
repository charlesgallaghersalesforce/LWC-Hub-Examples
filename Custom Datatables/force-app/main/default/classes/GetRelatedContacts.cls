/**
 * @description       : Gets related contacts associated to a specific account
 * @author            : Charles Gallagher
 * @last modified on  : 06-07-2021
 * @last modified by  : Charles Gallagher
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-07-2021   Charles Gallagher  Initial Version
**/
public class GetRelatedContacts 
{
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(Id accountId)
    {
        List<Contact> contactsToReturn = new List<Contact>();
        try
        {
            contactsToReturn = [Select Id, Name, Title, Phone, Email, MailingCity 
                               From Contact 
                               Where AccountId =: accountId ];
        }
        catch(Exception ex)
        {
            System.debug('Exception: ' + ex);
        }
        return contactsToReturn;
    }
    
    @AuraEnabled
    public static void updateContacts(List<Contact> contactsToUpdate)
    {
        update contactsToUpdate;
    }
}