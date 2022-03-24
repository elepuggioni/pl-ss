//selenium init
const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const service = new chrome.ServiceBuilder('./chromedriver.exe');
const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

//fs module init
const fs = require('fs');
const screenshotsDir = './Screenshots/';

//alcuni selector
const backArrow = '.v-icon.shrink.mdi.mdi-chevron-left';
const backArrowRegistrati = '.v-icon.mdi.mdi-arrow-left';

//altre cose
let imgN = 0;
//quanto è lento il pc/la connessione? aumenta gli sleep in modo che faccia in tempo a
//caricare e fare screenshot
const coefficientePatata = 1;
//tipi di sleep in millisecondi usati nel programma
const microSleep = 200 * coefficientePatata;
const smallSleep = 400 * coefficientePatata;
const mediumSleep = 1000 * coefficientePatata;
const bigSleep = 2000 * coefficientePatata;

function clearScreenshotsFolder(){
    try{
    fs.readdir(screenshotsDir, (err, files) => {
        if (err) throw err;
      
        for (const file of files) {
          fs.unlink(screenshotsDir + file, err => {
            if (err) throw err;
          });
        }
      });
    }catch(error){
        console.log("There was an error clearing the screenshots folder. Error: " +  error);
    }
}
function cazzo(directory, filename){
    return (function() {driver.takeScreenshot().then((data) => fs.writeFileSync((directory + filename + '.png'), data, 'base64'))})();
}
//directory deve includere uno slash alla fine
//filename non ha bisogno dell'estensione
function saveScreenshot(directory, filename){
    try{
        cazzo(directory, filename);
    }
    catch(error){
        console.log("I/O error: " + error);
    }
}
//clicca un elemento
async function clickElement(selector){
    await driver.wait(until.elementLocated(By.css(selector)), 10000)
    .then(elem=> elem.click())
    .catch(err => console.log("errore" + err));   
}
//restituisce array dei figli selezionati da childrenselector 
//di un oggetto selezionato da parentselector
async function getChildrenByCss(parentSelector, childrenSelector){
    let children = new Array();
    await driver.wait(until.elementLocated(By.css(parentSelector)), 10000).findElements(By.css(childrenSelector))
    .then(result => children = result)
    .catch(err => console.log("errore" + err));
    return children;
}
async function navigateOpzioniPianiTabs(tipoPiano, mainTab, selector){
    //apri tab
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + selector + "')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(microSleep))
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[text()[contains(.,'" + selector + "')]]"))))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + tipoPiano + ' - ' + mainTab + ' - ' + selector)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //await driver.findElement(By.css("body")).sendKeys(Key.PAGE_DOWN)

    //chiudi tab
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + selector +"')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(microSleep))
    .catch(err => console.log("errore" + err));
}
async function navigateOpzioniPiani(tipoPiano, nomeTab, itemsTab){
    for(const item of Object.values(itemsTab)){
        await navigateOpzioniPianiTabs(tipoPiano, nomeTab, item);
    }
}
async function clickNextTab(tipoPiano, nomeTab){
    return await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + nomeTab + "')] and (@class = 'v-tabs__item')]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + tipoPiano + ' - ' + nomeTab)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
}
async function navigatePiani(){
    //naviga nei piani e dentro le opzioni per ciascuno
    let tipoPiano = ['DEFAULT', 'Tourist', 'trimestrale', 'UNI 2.0', 'Economy', 'Ami AMI'];
    
    let nomiTabs = new Map()
    nomiTabs.set('libero', "One way libero");
    nomiTabs.set('free', "Free-Floating");
    nomiTabs.set('round', "Round trip");

    let defaultItemsTab = new Map();
    defaultItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'free': ['default', 'ff ami'],
        'round': ['default', 'city compact', 'medium','premium', 'van',
                'van xl','short rent sharing', 'ev', 'ev+']
    };
    let touristItemsTab = new Map();
    touristItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'free': ['free floating'],
        'round': ['small sedan', 'medium','premium',
        'short rent sharing', 'ev', 'ev+']
    };
    let trimestraleItemsTab = new Map();
    trimestraleItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'free': ['free floating'],
        'round': ['small sedan', 'medium','premium',
        'easyvan', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let uniItemsTab = new Map();
    uniItemsTab = {
        'libero': ['bike sharing', 'mantova'], 
        'free': ['free floating uni'],
        'round': ['piccole berline', 'uni 2.0 - m','uni - premium',
        'uni 2.0 - van', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let economyItemsTab = new Map();
    economyItemsTab = {
        'free': ['monopattini', 'economy car sharing'],
        'libero': ['bike sharing', 'monopattini one way', 'mantova'], 
        'round': ['citycar', 'medium','premium',
        'van', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let amiamiItemsTab = new Map();
    amiamiItemsTab = {
        'libero': ['ami ami 1€ allo sblocco +'] 
    }

    let itemsTab = new Map();
    itemsTab.set('DEFAULT', defaultItemsTab);
    itemsTab.set('Tourist', touristItemsTab);
    itemsTab.set('trimestrale', trimestraleItemsTab);
    itemsTab.set('UNI 2.0', uniItemsTab);
    itemsTab.set('Economy', economyItemsTab);
    itemsTab.set('Ami AMI', amiamiItemsTab);

    //clicca piano default
    for(const piano of tipoPiano){
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + piano + "')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + piano)))
        .then(() => imgN++)
        .then(navigateOpzioniPiani(piano, nomiTabs, defaultItemsTab))
        .catch(err => console.log("errore" + err));
        
        if(piano == 'Ami AMI'){
            await navigateOpzioniPiani(piano, nomiTabs.get('libero'), (itemsTab.get(piano))['libero']);
        }
        else if(piano == 'Economy'){
            await navigateOpzioniPiani(piano, nomiTabs.get('free'), (itemsTab.get(piano))['free']);

            await clickNextTab(piano, nomiTabs.get('libero'));
            await navigateOpzioniPiani(piano, nomiTabs.get('libero'), (itemsTab.get(piano))['libero']);
            
            await clickNextTab(piano, nomiTabs.get('round'));
            await navigateOpzioniPiani(piano, nomiTabs.get('round'), (itemsTab.get(piano))['round']);
        }
        else{
            await navigateOpzioniPiani(piano, nomiTabs.get('libero'), (itemsTab.get(piano))['libero']);

            await clickNextTab(piano, nomiTabs.get('free'));
            await navigateOpzioniPiani(piano, nomiTabs.get('free'), (itemsTab.get(piano))['free']);
            
            await clickNextTab(piano, nomiTabs.get('round'));
            await navigateOpzioniPiani(piano, nomiTabs.get('round'), (itemsTab.get(piano))['round']);
        }
        await clickElement(backArrow)
        .then(() => driver.sleep(mediumSleep));
    }
}
async function navigateActivity(){
    //entra in activity
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - activity')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    //clicca su piani ed entra per navigare in tutti i piani
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Piani tariffari')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - piani_tariffari')))
    .then(() => imgN++)
    .then(() => navigatePiani())
    .then(() => clickElement(backArrow))
    .catch(err => console.log("errore" + err));
    
    //clicca registrati
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Registrati')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - registrazione')))
    .then(() => imgN++)
    //crea account?
    .then(() => clickElement(backArrowRegistrati))
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - registrazione_annulla')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    //conferma vuoi annullare registrazione
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Ok')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    //siamo tornati in home, clicca activity di nuovo
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    //clicca login
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Hai già un account?')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - login')))
    .then(() => imgN++)
    //fai login
    .then(() => clickElement(backArrow))
    .catch(err => console.log("errore" + err));   
}

async function doStuff(){
    clearScreenshotsFolder();
    driver.manage().window().maximize();

    //home screenshot
    await driver.get('https://mobile.playcar.net')
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //naviga in activity
    await navigateActivity()
    .catch(err => console.log(err));
}

(async function(){await doStuff().then(() => driver.quit())})();
