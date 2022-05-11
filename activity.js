import {By, until} from 'selenium-webdriver';
import { navigatePiani } from './piani.js';
import {saveScreenshot, screenshotsDir, incrNum, getNum} from './main.js';
import {skipNotices, clickElementByCss, backArrow} from './main.js';
import {driver, microSleep, smallSleep, mediumSleep, bigSleep} from './main.js';

//naviga dentro activity (piani, registrati, login)
async function navigateActivity(loggato){
    if(loggato){
        //entra in activity
        await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
        .then(activityButton => activityButton.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity')))
        .then(() => incrNum())
        .catch(err => console.log(err));
        
        //prenota macchina?
        await navigatePrenotazioni()
        .catch(err => console.log(err));

        //profilo
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Il mio profilo')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity - cosa cerchi - profilo')))
        .then(() => incrNum())
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));

        //prenotazioni
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Le mie prenotazioni')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity - cosa cerchi - profilo')))
        .then(() => incrNum())
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));
        
        //piani
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Piani tariffari')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity - cosa cerchi - profilo')))
        .then(() => incrNum())
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));
    }
    else{
        //entra in activity
        await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
        .then(activityButton => activityButton.click())
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity')))
        .then(() => incrNum())
        .catch(err => console.log(err));
        
        //clicca su piani ed entra per navigare in tutti i piani
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Piani tariffari')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(bigSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - piani_tariffari')))
        .then(() => incrNum())
        .catch(err => console.log(err));
        
        await navigatePiani()
        .then(() => clickElementByCss(backArrow))
        .catch(err => console.log(err));

        //clicca registrati
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Registrati')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(bigSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - registrazione')))
        .then(() => incrNum())
        //crea account?
        .then(() => clickElementByCss('.v-icon.mdi.mdi-arrow-left'))
        .then(() => driver.sleep(mediumSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - registrazione_annulla')))
        .then(() => incrNum())
        .catch(err => console.log(err));
        
        //conferma vuoi annullare registrazione
        await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Ok')]]"), 10000))
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .catch(err => console.log(err));
    }
}
async function navigatePrenotazioni(){
    //prenota veicolo riservato
    await prenotaVeicoloRiservato()
    .catch(err => console.log(err));

    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //prenota auto o furgone, round trip
    await prenotaAutoFurgoneRound()
    .catch(err => console.log(err));

    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - activity')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //clicca auto o furgone
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'o un furgone')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //prenota auto o furgone, free-floating
    await prenotaVeicolo('furgone', 'Free-Floating')
    .catch(err => console.log(err));

    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    
    //clicca bicicletta
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'bicicletta')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));

    //prenota bicicletta
    await prenotaVeicolo('bicicletta', 'One Way')
    .catch(err => console.log(err));

    //back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    //clicca ami 
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view-home\"]/div[1]/div[5]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));

    //prenota ami
    await prenotaVeicolo('AMI', 'One Way')
    .catch(err => console.log(err));
    await prenotaVeicolo('AMI', 'Free-Floating')
    .catch(err => console.log(err));
    
    //back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
}
//prenota veicolo riservato
async function prenotaVeicoloRiservato(){
    let present = false;
    //veicolo riservato
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Veicolo riservato')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    await driver.sleep(mediumSleep);
    await driver.findElement(By.css(".v-progress-circular__overlay"), 10000)
    .then(() => present = true)
    .catch(err => console.log(err));

    if(present){
        //spiegazione
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then((button) => button.click())
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
        .then(() => incrNum())
        .catch(err => console.log(err));
    }    
    //clicca check in
    await driver.wait(until.elementLocated(By.css(".v-text-field__slot")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca una data
    await driver.wait(until.elementLocated(By.css(".v-btn.v-btn--flat.v-btn--floating.v-btn--outline")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //clicca orari
    await driver.wait(until.elementLocated(By.css(".v-select__selections")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca un orario
    await driver.wait(until.elementLocated(By.css(".v-list__tile__title")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    //clicca check out
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"app\"]/div[4]/main/div/div/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div[2]/span/div/div/div[1]/div/div/div[1]/div")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca una data
    await driver.wait(until.elementLocated(By.css(".v-btn.v-btn--flat.v-btn--floating.v-btn--outline")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca orari
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"app\"]/div[5]/main/div/div/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div[3]/span/div/div/div/div[1]/div[1]/div[1]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca un orario
    await driver.wait(until.elementLocated(By.css(".v-list__tile__title")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //scegli un'auto
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //mostra foto
    await driver.wait(until.elementLocated(By.css(".v-icon.grow.mdi.mdi-chevron-down")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".v-icon.grow.mdi.mdi-chevron-up"))))
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //scegli indirizzo
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //clicca info
    await driver.wait(until.elementLocated(By.css(".v-icon.mb-3.v-icon--link.mdi.mdi-information")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //chiudi
    await driver.wait(until.elementLocated(By.css(".v-icon.v-icon--link.mdi.mdi-close")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    
    //scegli pacchetto
    await driver.wait(until.elementLocated(By.css(".v-icon.my-auto.v-icon--link.mdi.mdi-radiobox-blank")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //vai avanti
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[@id=\"app\"]/div[7]/main/div/div/div/div[1]/div/div[2]/div[1]/div[3]")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota -  veicolo riservato')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //go back
    await driver.get('https://mobile.playcar.net')
    .catch(err => console.log(err));
    //skippa roba
    await skipNotices()
    .catch(err => console.log(err)); 
}
//prenota auto o furgone, solo per round trip
async function prenotaAutoFurgoneRound(){
    let autoDisponibili;
    //auto o furgone
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'o un furgone')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //ROUND TRIP
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Round Trip')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip')))
    .then(() => incrNum())
    .catch(err => console.log(err));

     //espandi header
     await driver.wait(until.elementLocated(By.css(".v-expansion-panel__header")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip')))
    .then(() => incrNum())
    .catch(err => console.log(err));
     //setta orari?
     //espandi header
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')]]")), 10000)
     .then(button => button.click())
     .then(() => driver.sleep(mediumSleep))
     .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip - ricerca veicolo')))
     .then(() => incrNum())
     .catch(err => console.log(err));

    //siamo in ricerca veicolo
    //prende i figli del container (le auto disponibili)
    await driver.wait(until.elementsLocated(By.css(".transparent.v-card.v-card--flat.v-sheet")), 10000)
    .then(auto => autoDisponibili = auto)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
     
    for(let i = 0; i < autoDisponibili.length; i += 3){
        await driver.executeScript("arguments[0].scrollIntoView(true);", autoDisponibili[i])
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip - lista auto')))
        .then(() => incrNum())
        .catch(err => console.log(err));
    } 
    //clicca sull'ultima
    await (autoDisponibili[autoDisponibili.length -1]).click()
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip - dettagli auto')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //espandi info
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-chevron-double-down")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));

    //guarda info giu
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".v-expansion-panel__header")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip - dettagli auto')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //e più giù
    await driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.css(".container.estimate.text-xs-center")))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - furgone - round trip - dettagli auto')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //go back
    await driver.get('https://mobile.playcar.net')
    .catch(err => console.log(err));
    //skippa roba
    await skipNotices()
    .catch(err => console.log(err));
}
//prenota veicolo generico dove c'è solo qr code/targa
async function prenotaVeicolo(tipoVeicolo, tipoViaggio){
    //clicca tipo viaggio
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'" + tipoViaggio + "')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //qr code
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Inquadra il codice QR')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //chiudi
    await driver.wait(until.elementLocated(By.css(".layout.component-close-button.pa-3.absolute.text-xs-right")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log(err));

    //inserisci targa
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"view-home\"]/div/div/div/div[3]/div[1]/form/div/div/div/div/div[1]/div/input")), 10000)
    .then((field) => field.sendKeys('INVERSTEST'))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));
    //conferma
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')]]")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //chiudi
    await driver.wait(until.elementLocated(By.xpath("//*[@id=\"modal-wrapper\"]/div/span/div/div/form/div/div[1]/div/i")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - prenota - ' + tipoVeicolo + ' - ' + tipoViaggio)))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
}

export { navigateActivity }