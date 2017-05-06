var child_process=require('child_process');

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();

var exitStatus=1;

console.log('Getting org details');
var orgDetail=JSON.parse(child_process.execFileSync('sfdx', ['force:org:describe', '--json']));
var instance=orgDetail.instanceUrl;
var token=orgDetail.accessToken;
console.log('Logging in');
driver.get(instance + '/secur/frontdoor.jsp?sid=' + token);
driver.sleep(10000).then(_ => console.log('Opening the unit test page'));
driver.navigate().to(instance + '/c/JobsTestApp.app');
driver.sleep(2000).then(_ => console.log('Running tests'));
driver.findElement(By.id('slds-btn')).click();
driver.sleep(2000).then(_ => console.log('Checking results'));

driver.findElement(By.id("status")).getText().then(function(text) {
    console.log('Status = ' + text);
    if (text==='Success') {
        exitStatus=0;
    }
});
driver.sleep(10000);
driver.quit().then(_ => process.exit(exitStatus));
