# salesforce-mobilepublisher-demo

## Deploy to scratch org

```
sfdx force:org:create -f config/project-scratch-def.json -a mb-scratch --setdefaultusername
sfdx force:source:push
ROLE_ID=`sfdx force:data:soql:query -q "select id from UserRole where Name='CEO'" --json | jq ".result.records[0].Id" -r`
sfdx force:data:record:update -s User -w "Name='User User'" -v "LanguageLocaleKey=en_US TimeZoneSidKey=Europe/Paris LocaleSidKey=da UserPreferencesUserDebugModePref=true UserPreferencesApexPagesDeveloperMode=true UserRoleId='${ROLE_ID}'"
```
