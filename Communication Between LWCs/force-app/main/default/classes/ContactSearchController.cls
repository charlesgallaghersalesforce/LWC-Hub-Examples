public with sharing class ContactSearchController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        String query = 'SELECT '
                     + 'Id, Name '
                     + 'FROM Account '
                     + 'ORDER BY Name ASC';
        return Database.query(query);
    }

    @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accountId){
        String query = 'SELECT '
                     + 'Id, FirstName, LastName, Phone, Email, Title '
                     + 'FROM Contact';
        if (String.isNotBlank(accountId)) {
            query += ' WHERE AccountId =: accountId ';
        }
        query += ' ORDER BY FirstName, LastName ASC ';
        if (String.isBlank(accountId)) {
            query += ' LIMIT 50 ';
        }
        return Database.query(query);
    }
}
