//selenium init
const {Builder, By, Key, until, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const service = new chrome.ServiceBuilder('./chromedriver.exe');
const driver = new Builder().forBrowser('chrome').setChromeService(service).build();
const actions = driver.actions();

//fs module init
const fs = require('fs');
const screenshotsDir = './Screenshots/';

//alcuni selector
const backArrow = '.v-icon.shrink.mdi.mdi-chevron-left';
const backArrowRegistrati = '.v-icon.mdi.mdi-arrow-left';
const backCross = ".layout.component-close-button.shrink.text-xs-right";

//counter per il nome degli screenshot
let imgN = 0;
//credenziali login prese da file credentials.txt
let username;
let password;
//quanto è lento il pc/la connessione? aumenta gli sleep in modo che faccia in tempo a
//caricare e fare screenshot
const coefficientePatata = 1;
//tipi di sleep in millisecondi usati nel programma
const microSleep = 200 * coefficientePatata;
const smallSleep = 400 * coefficientePatata;
const mediumSleep = 1000 * coefficientePatata;
const bigSleep = 2000 * coefficientePatata;

//legge username e password dal file credentials.txt
async function readCredentials(){
    let credentials = new Array();
    let fileStream = new String();
    fs.readFile("C:\\Users\\playc\\Desktop\\elena\\pl-ss\\credentials.txt", 'utf-8', (err, data) => {
        if (err) {
          console.error(err)
          return;
        }
        fileStream = data;
        credentials = fileStream.split(',');
        username = credentials[0];
        password = credentials[1];
        return;
      })
}
//cancella i contenuti della cartella screenshots
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
    }
    catch(error){
        console.log("There was an error clearing the screenshots folder. Error: " +  error);
    }
}
//directory deve includere uno slash alla fine
//filename non ha bisogno dell'estensione
async function saveScreenshot(directory, filename){
    try{
        await driver.takeScreenshot()
        .then((data) => fs.writeFileSync((directory + filename + '.png'), data, 'base64'))
        .catch(err => console.log("errore" + err));   
    }
    catch(error){
        console.log("I/O error: " + error);
    }
}
//clicca un elemento selezionato con css
async function clickElementByCss(selector){
    await driver.wait(until.elementLocated(By.css(selector)), 10000)
    .then(elem=> elem.click())
    .catch(err => console.log("errore" + err));   
}
//naviga dentro activity (piani, registrati, login)
async function navigateActivity(loggato){
    if(loggato){
        //entra in activity
        await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
        .then(activityButton => activityButton.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - activity')))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));
        
        //prenota macchina?
        await navigatePrenotazioni()
        .catch(err => console.log("errore" + err));

        //profilo
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Il mio profilo')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - activity - cosa cerchi - profilo')))
        .then(() => imgN++)
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));

        //prenotazioni
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Le mie prenotazioni')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - activity - cosa cerchi - profilo')))
        .then(() => imgN++)
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));
        
        //piani
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Piani tariffari')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - activity - cosa cerchi - profilo')))
        .then(() => imgN++)
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));
    }
    else{
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
        .catch(err => console.log("errore" + err));
        
        await navigatePiani()
        .then(() => clickElementByCss(backArrow))
        .catch(err => console.log("errore" + err));

        //clicca registrati
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Registrati')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(bigSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - registrazione')))
        .then(() => imgN++)
        //crea account?
        .then(() => clickElementByCss(backArrowRegistrati))
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - registrazione_annulla')))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));
        
        //conferma vuoi annullare registrazione
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Ok')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .catch(err => console.log("errore" + err));
    }
}
async function navigatePrenotazioni(){
    /*await prenotaVeicoloRiservato()
    .catch(err => console.log("errore" + err));

    //entra in activity
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    await prenotaAutoFurgone()
    .catch(err => console.log("errore" + err));
    */
    //clicca bicicletta
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'bicicletta')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    await prenotaVeicolo('bicicletta', 'One Way')
    .catch(err => console.log("errore" + err));
    //back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    //clicca ami 
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view-home\"]/div[1]/div[5]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    await prenotaVeicolo('AMI', 'One Way')
    .catch(err => console.log("errore" + err));

    await prenotaVeicolo('AMI', 'Free-Floating')
    .catch(err => console.log("errore" + err));
    
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
}
//prenota veicolo riservato
async function prenotaVeicoloRiservato(){
    let present = false;
    //veicolo riservato
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Veicolo riservato')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    await driver.sleep(mediumSleep);
    await driver.findElement(By.css(".v-progress-circular__overlay"), 10000)
    .then(() => present = true)
    .catch(err => console.log("errore" + err));

    if(present){
        //spiegazione
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then((button) => button.click())
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));
    }    
    //clicca check in
    await driver.wait(until.elementLocated(By.css(".v-text-field__slot")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca una data
    await driver.wait(until.elementLocated(By.css(".v-btn.v-btn--flat.v-btn--floating.v-btn--outline")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //clicca orari
    await driver.wait(until.elementLocated(By.css(".v-select__selections")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca un orario
    await driver.wait(until.elementLocated(By.css(".v-list__tile__title")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    //clicca check out
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"app\"]/div[4]/main/div/div/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div[2]/span/div/div/div[1]/div/div/div[1]/div")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca una data
    await driver.wait(until.elementLocated(By.css(".v-btn.v-btn--flat.v-btn--floating.v-btn--outline")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca orari
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"app\"]/div[5]/main/div/div/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div[3]/span/div/div/div/div[1]/div[1]/div[1]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca un orario
    await driver.wait(until.elementLocated(By.css(".v-list__tile__title")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //scegli un'auto
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //mostra foto
    await driver.wait(until.elementLocated(By.css(".v-icon.grow.mdi.mdi-chevron-down")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".v-icon.grow.mdi.mdi-chevron-up"))))
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //scegli indirizzo
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //clicca info
    await driver.wait(until.elementLocated(By.css(".v-icon.mb-3.v-icon--link.mdi.mdi-information")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi
    await driver.wait(until.elementLocated(By.css(".v-icon.v-icon--link.mdi.mdi-close")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    
    //scegli pacchetto
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[@id=\"app\"]/div[7]/main/div/div/div/div[1]/div/div[2]/div[1]/div[3]")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //go back
    await driver.get('https://mobile.playcar.net')
    .catch(err => console.log("errore" + err));
    //skippa roba
    await skipNotices()
    .catch(err => console.log("errore" + err)); 
}
async function prenotaAutoFurgone(){
    let autoDisponibili;
    //auto o furgone
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'o un furgone')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //ROUND TRIP
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Round Trip')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - round trip')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

     //espandi header
     await driver.wait(until.elementLocated(By.css(".v-expansion-panel__header")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - round trip')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
     //setta orari?
     //espandi header
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')]]")), 10000)
     .then(button => button.click())
     .then(() => driver.sleep(mediumSleep))
     .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - round trip - ricerca veicolo')))
     .then(() => imgN++)
     .catch(err => console.log("errore" + err));

    //siamo in ricerca veicolo
    //prende i figli del container (le auto disponibili)
    await driver.wait(until.elementsLocated(By.css(".transparent.v-card.v-card--flat.v-sheet")), 10000)
    .then(auto => autoDisponibili = auto)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
     
    for(let i = 0; i < autoDisponibili.length; i += 3){
        await driver.executeScript("arguments[0].scrollIntoView(true);", autoDisponibili[i])
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato - lista auto')))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));
    } 
    //clicca sull'ultima
    await (autoDisponibili[autoDisponibili.length -1]).click()
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato - dettagli auto')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //espandi info
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-chevron-double-down")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    //guarda info giu
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".v-expansion-panel__header")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato - dettagli auto')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //e più giù
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".container.estimate.text-xs-center")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota -  veicolo riservato - dettagli auto')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //go back
    await driver.get('https://mobile.playcar.net')
    .catch(err => console.log("errore" + err));
    //skippa roba
    await skipNotices()
    .catch(err => console.log("errore" + err));

    //FREE FLOATING ***********************************

    //siamo tornati in home, clicca activity di nuovo
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));

    //auto o furgone
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'o un furgone')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Free-Floating')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - free-floating')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //qr code
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Inquadra il codice QR')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - free-floating')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi
    await driver.wait(until.elementLocated(By.css(".v-icon.v-icon--link.mdi.mdi-close")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));

    //inserisci targa
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view-home\"]/div/div/div/div[3]/div[1]/form/div/div/div/div/div[1]/div/input")), 10000)
    .then((field) => field.sendKeys('INVERSTEST'))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));
    //conferma
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')]]")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - free floating')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    await driver.wait(until.elementLocated(By.css(".layout.component-close-button.text-xs-right")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - auto o furgone - free floating')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    
}
async function prenotaVeicolo(tipoVeicolo, tipoViaggio){
    //clicca tipo viaggio
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + tipoViaggio + "')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //qr code
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Inquadra il codice QR')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi
    await driver.wait(until.elementLocated(By.css(".layout.component-close-button.pa-3.absolute.text-xs-right")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));

    //inserisci targa
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view-home\"]/div/div/div/div[3]/div[1]/form/div/div/div/div/div[1]/div/input")), 10000)
    .then((field) => field.sendKeys('INVERSTEST'))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));
    //conferma
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')]]")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"modal-wrapper\"]/div/span/div/div/form/div/div[1]/div/i")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
}
//naviga nei piani e dentro le opzioni per ciascuno
async function navigatePiani(){
    //elenchi delle opzioni per ogni sezione
    let defaultItemsTab = new Map();
    defaultItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'Free': ['default', 'ff ami'],
        'Round': ['default', 'city compact', 'medium','premium', 'van',
                'van xl','short rent sharing', 'ev', 'ev+']
    };
    let touristItemsTab = new Map();
    touristItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'Free': ['free floating'],
        'Round': ['small sedan', 'medium','premium',
        'short rent sharing', 'ev', 'ev+']
    };
    let trimestraleItemsTab = new Map();
    trimestraleItemsTab = {
        'libero': ['bike sharing', 'monopattino', 'mantova'], 
        'Free': ['free floating'],
        'Round': ['small sedan', 'medium','premium',
        'easyvan', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let uniItemsTab = new Map();
    uniItemsTab = {
        'libero': ['bike sharing', 'mantova'], 
        'Free': ['free floating uni'],
        'Round': ['piccole berline', 'uni 2.0 - m','uni - premium',
        'uni 2.0 - van', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let economyItemsTab = new Map();
    economyItemsTab = {
        'Free': ['monopattini', 'economy car sharing'],
        'libero': ['bike sharing', 'monopattini one way', 'mantova'], 
        'Round': ['citycar', 'medium','premium',
        'van', 'van xl', 'short rent sharing', 'ev', 'ev+']
    };
    let amiamiItemsTab = new Map();
    amiamiItemsTab = {
        'Libero': ['ami ami 1€ allo sblocco +'] 
    }
    //raccoglie tutte le info di sezioni e tab
    let itemsTab = new Map();
    itemsTab.set('DEFAULT', defaultItemsTab);
    itemsTab.set('Tourist', touristItemsTab);
    itemsTab.set('trimestrale', trimestraleItemsTab);
    itemsTab.set('UNI 2.0', uniItemsTab);
    itemsTab.set('Economy', economyItemsTab);
    itemsTab.set('Ami AMI', amiamiItemsTab);

    //cicla nei piani
    for(const piano of itemsTab.keys()){
        let arr = itemsTab.get(piano);
        let tabs = Object.keys(arr);

        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + piano + "')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + piano)))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));

        //cicla nei tab
        for(const tab of tabs){
            //cicla negli elementi
            for(const item of arr[tab]){
                await guardaDettagliPiano(piano, tab, item);
            }
            if((tabs.indexOf(tab)) < tabs.length - 1){
                await clickNextTab(piano, tabs[(tabs.indexOf(tab)) + 1]);
            }
        }
        //torna indietro
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(mediumSleep));
    }
}
//tipoPiano, nomeTab sono string
async function clickNextTab(tipoPiano, nomeTab){
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + nomeTab + "')] and (@class = 'v-tabs__item')]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + tipoPiano + ' - ' + nomeTab)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
}
//in un piano tariffa, all'interno di una sezione, apre un tab, si posiziona per vederlo bene,
//fa uno screenshot, chiude il tab
//tipoPiano, mainTab, selector: string
async function guardaDettagliPiano(tipoPiano, mainTab, selector){
    //apri tab
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + selector + "')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(microSleep))
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[text()[contains(.,'" + selector + "')]]"))))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - ' + tipoPiano + ' - ' + mainTab + ' - ' + selector)))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    //chiudi tab
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + selector +"')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(microSleep))
    .catch(err => console.log("errore" + err));
}
//fa il login
async function doLogin(){
    //entra su login
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Hai già un account?')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - login')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //inserisce username
    await driver.wait(until.elementLocated(By.css("[autocomplete=username]")), 10000)
    .then((field) => field.sendKeys(username))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));
    //inserisce password
    await driver.wait(until.elementLocated(By.css("[autocomplete=current-password]")), 10000)
    .then((field) =>field.sendKeys(password))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));

    //clicca bottone login
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Login')] and (@class = 'v-btn__content')]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - settings_confirm')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    /* altri metodi per cliccare un bottone perché non riuscivo a farlo funzionare
    ma il bottone non c'entrava un cazzo il problema era l'input sopra <3 cesso <3

    await driver.wait(until.elementLocated(By.css("[autocomplete=current-password]")), 10000)
    .then((field) => field.sendKeys(Key.ENTER))
    .catch(err => console.log("errore" + err));

    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Login')] and (@class = 'v-btn__content')]"), 10000))
    .then(button => driver.executeScript("arguments[0].click()", button))
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - login')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    await driver.wait(until.elementLocated(By.css("[novalidate=novalidate"), 10000))
    .then(form => form.submit())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));
    */

    await skipNotices()
    .catch(err => console.log("errore" + err));

    //guarda i filtri nella home
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-filter-variant")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - filtri mappa')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    await driver.wait(until.elementLocated(By.css(".v-icon.mx-auto.mdi.mdi-chevron-up")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
}
async function skipNotices(){
    let present;
    //controlla che non mi stia chiedendo di settare impostazioni del mio account 
    await driver.findElements((By.xpath("//*[contains(.,'Passa ad un account business')]")), 10000)
    .then(() => present = true)
    .catch(err => present = false);

    //se sì tocca skippare sta roba
    if(present){
        //clicca continua come privato
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'privato')] and (@class = 'text-wrap')]")), 10000)
        .then(button => button.click())
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));

        //clicca skippa metodo pagamento
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .catch(err => console.log("errore" + err));

        //clicca skippa selezione piano
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then(button => button.click())
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log("errore" + err));
    }
}
//naviga dentro il profilo e tutte le opzioni
async function navigateProfilo(){
    //ora siamo in home, clicca profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));

    //* clicca alerts ***********************************************/
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-alert")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - alerts')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err)); 
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - alerts')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //torna in profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*clicca help  ***********************************************/
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-help")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - help')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err)); 
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - help')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - help')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - help')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //torna in profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*cambia pfp ***********************************************
    chiede permessi per webcam e si blocca
    await driver.wait(until.elementLocated(By.css(".component-button.small.camera-button.v-btn.v-btn--icon")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - cambia pfp')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //go back
    await driver.wait(until.elementLocated(By.css(".v-icon.v-icon--link.mdi.mdi-close")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
*/
    /*cambia account  ***********************************************
    ?????? non mi compare il bottone per cambiare account quando uso selenium???
    await driver.wait(until.elementLocated(By.css(".mdi-account-multiple")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home - cambia account')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //go back
    await clickElementByCss(backCross)
    .catch(err => console.log("errore" + err));
*/
    /*gestisci info  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Gestisci')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - gestisci')))
    .then(() => imgN++)
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[text()[contains(.,'Indirizzo Personale')]]"))))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - gestisci')))
    .then(() => imgN++)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /* non sono cliccabili, oopsie
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Salva')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - gestisci - salvato')))
    .then(() => imgN++)

    await driver.wait(until.elementLocated(By.css("component-button.v-btn.v-btn--depressed.v-btn--round")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))

    //ora siamo in home, clicca profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    */
   
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*clicca situazione contabile - riepilogo *******************************/
    await driver.wait(until.elementLocated(By.css(".component-gradient-card.component-card-with-report")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - situazione contabile - riepilogo')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca portafoglio - dettaglio
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Dettaglio')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - situazione contabile - riepilogo - dettaglio')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi dettagli
    await clickElementByCss(backCross)
    .catch(err => console.log("errore" + err));

    //clicca fatture 
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Fatture')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - situazione contabile - fatture')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca depositi
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'depositi')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - situazione contabile - depositi')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //chiudi situazione contabile
    await clickElementByCss(backArrow)
    .catch(err => console.log("errore" + err));

    /*apri credito prepagato  ***********************************************/
    await driver.wait(until.elementLocated(By.css(".layout.subheading.font-weight-regular.row.align-center")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - credito prepagato')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //annulla
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Annulla')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*inserisci codice coupon  ***********************************************/
    await driver.wait(until.elementLocated(By.css("[aria-label=\"Inserisci un codice coupon\"]")), 10000)
    .then((field) => field.sendKeys('cazzo'))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));
    //invia
    await driver.wait(until.elementLocated(By.css(".v-input__icon.v-input__icon--append")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log("errore" + err));
    //cazzo non è un coupon valido, che strano
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - coupon respinto')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    /*prenotazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Le mie prenotazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - prenotazioni - future')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //tutte
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Tutte')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - prenotazioni - tutte')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //i miei guidatori
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'I miei guidatori')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - prenotazioni - i miei guidatori')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    
    //aggiungi guidatore
    //ami questa parte la devo commentare perché non fa a chiudere il popup con qr code
    /*
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Aggiungi guidatore')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //chiudi
    await clickElementByCss(backCross)
    .catch(err => console.log("errore" + err));
    */
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*abbonamenti  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'I miei abbonamenti')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - abbonamenti')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //aggiungi piano
    await clickElementByCss(".component-button.mx-auto.my-4.v-btn.v-btn--floating.v-btn--depressed")
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - aggiungi abbonamento')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*guidatori  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'miei guidatori')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - guidatori')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //aggiungi guidatore
    await clickElementByCss(".component-button.mx-auto.my-4.v-btn.v-btn--floating.v-btn--depressed")
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - aggiungi guidatore')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //go back
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

     /*metodi di pagamento  ***********************************************/
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'metodi di pagamento')] and (@class = 'v-list__tile__title')]")), 10000)
     .then((button) => button.click())
     .then(() => driver.sleep(smallSleep))
     .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - metodi pagamento')))
     .then(() => imgN++)
     .catch(err => console.log("errore" + err));
     //aggiungi metodo
     await clickElementByCss(".v-icon.mdi.mdi-plus")
     .then(() => driver.sleep(mediumSleep))
     .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - aggiungi metodo pagamento')))
     .then(() => imgN++)
     .catch(err => console.log("errore" + err));
     /*conferma non funziona cazzo
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Continua')] and (@class = 'v-btn__content')]")), 10000)
     .then(() => driver.sleep(smallSleep))
     .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - aggiungi metodo pagamento -  conferma')))
     .then(() => imgN++)
    */
     //go back
     await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*documenti  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'documenti')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - documenti')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*segnalazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'segnalazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - segnalazioni')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    /*privacy  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Privacy')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - privacy')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //cicla nei contratti
    await driver.wait(until.elementsLocated(By.css("li, .v-expansion-panel__container")), 10000)
    .then(tabs => guardaPrivacyTabs(tabs))
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    //torna a profilo
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
    
    //clicca impostazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Impostazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - impostazioni')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //clicca centro supporto?
    /*
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Centro Supporto')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - impostazioni')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    */
    //clicca aggiungi account
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Aggiungi account')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - impostazioni -  aggiungi account')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //torna indietro
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    //clicca cambia password
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Cambia Password')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - impostazioni -  cambia password')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
    //torna indietro
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));

    //clicca esci
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Esci')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - profilo - impostazioni - esci')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
}
//naviga dentro i vari tab della sezione privacy del profilo
async function guardaPrivacyTabs(tabs){
    for(const tab of tabs){
        await tab.click()
        .then(() => driver.sleep(microSleep))
        .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", tab))
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, imgN + ' - privacy agreement')))
        .then(() => imgN++)
        .catch(err => console.log("errore" + err));
        
        //chiudi tab
        await tab.click()
        .then(() => driver.sleep(microSleep))
        .catch(err => console.log("errore" + err));
    }
}
//main
async function doStuff(){
    clearScreenshotsFolder();
    driver.manage().window().maximize();

    //home screenshot
    await driver.get('https://mobile.playcar.net')
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, imgN + ' - home')))
    .then(() => imgN++)
    .catch(err => console.log("errore" + err));
/*
    //naviga in activity
    await navigateActivity(false)
    .catch(err => console.log(err));

    
*/
    //siamo tornati in home, clicca activity di nuovo
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));

    //legge credenziali da file
    await readCredentials();
    //fai login
    await doLogin()
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));  
   
    //naviga in activity da loggato
    await navigateActivity(true)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log("errore" + err));
/*
    //naviga nel profilo
    await navigateProfilo()
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log("errore" + err));
*/
}
(async function(){
    await doStuff()
    .then(() => driver.quit())
    .catch(() => driver.quit())
})();
