/**
 * @description       : Tests GetRelatedContacts
 * @author            : Charles Gallagher
 * @last modified on  : 06-07-2021
 * @last modified by  : Charles Gallagher
 * Modifications Log 
 * Ver   Date         Author             Modification
 * 1.0   06-07-2021   Charles Gallagher  Initial Version
**/
@isTest
public class GetRelatedContactsTest 
{
	static testMethod void getContactsTest()
    {
        Account testAccount = new Account(Name = 'Test');
        
        insert testAccount;
        
        List<Contact> contactsToInsert = new List<Contact>();
        
        Contact testContact1 = new Contact(FirstName = 'Steve', 
                                           LastName = 'Rogers', 
                                           Title = 'Avenger',
                                           Phone = '1111111111', 
                                           Email = 'test@test1gmail.com', 
                                           MailingCity = 'Brooklyn',
                                           AccountId = testAccount.Id);
        contactsToInsert.add(testContact1);
        
        Contact testContact2 = new Contact(FirstName = 'Bat', 
                                           LastName = 'Man', 
                                           Title = 'Marvel',
                                           Phone = '2222222222', 
                                           Email = 'test@test2gmail.com', 
                                           MailingCity = 'Gotham City',
                                           AccountId = testAccount.Id);
        contactsToInsert.add(testContact2);
        
        insert contactsToInsert;
        
        Test.startTest();
		List<Contact> relatedContacts = GetRelatedContacts.getContacts(testAccount.Id);        
        Test.stopTest();
        
        System.assertEquals(2, relatedContacts.size());
        System.assertEquals('Steve Rogers', relatedContacts[0].Name);
        System.assertEquals('Bat Man', relatedContacts[1].Name);
    }
    
    static testMethod void updateContactsTest()
    {
        Account testAccount = new Account(Name = 'Test');
        
        insert testAccount;
        
        List<Contact> contactsToInsert = new List<Contact>();
        
        Contact testContact1 = new Contact(FirstName = 'Steve', 
                                           LastName = 'Rogers', 
                                           Title = 'Avenger',
                                           Phone = '1111111111', 
                                           Email = 'test@test1gmail.com', 
                                           MailingCity = 'Brooklyn',
                                           AccountId = testAccount.Id);
        contactsToInsert.add(testContact1);
        
        Contact testContact2 = new Contact(FirstName = 'Bat', 
                                           LastName = 'Man', 
                                           Title = 'Marvel',
                                           Phone = '2222222222', 
                                           Email = 'test@test2gmail.com', 
                                           MailingCity = 'Gotham City',
                                           AccountId = testAccount.Id);
        contactsToInsert.add(testContact2);
        
        insert contactsToInsert;
        
        List<Contact> contactsToUpdate = new List<Contact>();
        testContact1.Title = 'Ex Avenger';
        
        contactsToUpdate.add(testContact1);
        
        GetRelatedContacts.updateContacts(contactsToUpdate);
        
        List<Contact> updatedContacts = [Select Id, Title From Contact Where Id in: contactsToUpdate];
        
        System.assertEquals('Ex Avenger', updatedContacts[0].Title);
    }
}