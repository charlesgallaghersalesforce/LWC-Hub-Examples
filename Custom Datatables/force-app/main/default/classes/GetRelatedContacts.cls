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
        /*try
        {
            modulesToReturn = [Select Id, Name, Status__c, Must_Complete_By__c, Hours_Required__c, Actual_Hours_Spent__c 
                               From Module__c 
                               Where Onboarding__c =: onboardingId 
                               ORDER BY Sort_Order__c ASC];
        }
        catch(Exception ex)
        {
            System.debug('Exception: ' + ex);
        }*/
        return contactsToReturn;
    }
}