import {By, until} from 'selenium-webdriver';
import {username, password} from './main.js';
import {saveScreenshot, screenshotsDir, incrNum, getNum} from './main.js';
import {skipNotices, clickElementByCss, backArrow} from './main.js';
import {driver, microSleep, smallSleep, mediumSleep, bigSleep} from './main.js';

//fa il login
async function doLogin(){
    //entra su login
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Hai già un account?')]]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - login')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //inserisce username
    await driver.wait(until.elementLocated(By.css("[autocomplete=username]")), 10000)
    .then((field) => field.sendKeys(username))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));
    //inserisce password
    await driver.wait(until.elementLocated(By.css("[autocomplete=current-password]")), 10000)
    .then((field) =>field.sendKeys(password))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));

    //clicca bottone login
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Login')] and (@class = 'v-btn__content')]"), 10000))
    .then(button => button.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log(err));

    /* altri metodi per cliccare un bottone perché non riuscivo a farlo funzionare
    ma il bottone non c'entrava un cazzo il problema era l'input sopra <3 cesso <3

    await driver.wait(until.elementLocated(By.css("[autocomplete=current-password]")), 10000)
    .then((field) => field.sendKeys(Key.ENTER))
    .catch(err => console.log(err));

    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Login')] and (@class = 'v-btn__content')]"), 10000))
    .then(button => driver.executeScript("arguments[0].click()", button))
    .then(() => driver.sleep(bigSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - login')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    
    await driver.wait(until.elementLocated(By.css("[novalidate=novalidate"), 10000))
    .then(form => form.submit())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log(err));
    */

    await skipNotices()
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home login')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //guarda i filtri nella home
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-filter-variant")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - filtri mappa')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    await driver.wait(until.elementLocated(By.css(".v-icon.mx-auto.mdi.mdi-chevron-up")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
}

//naviga dentro il profilo e tutte le opzioni
async function navigateProfilo(){
    //ora siamo in home, clicca profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo')))
    .then(() => incrNum())
    .catch(err => console.log(err));

    //* clicca alerts ***********************************************/
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-alert")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - alerts')))
    .then(() => incrNum())
    .catch(err => console.log(err)); 
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - alerts')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //torna in profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*clicca help  ***********************************************/
    await driver.wait(until.elementLocated(By.css(".v-icon.mdi.mdi-help")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - help')))
    .then(() => incrNum())
    .catch(err => console.log(err)); 
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - help')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - help')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //ok
    await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - help')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //torna in profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*cambia pfp ***********************************************
    chiede permessi per webcam e si blocca
    await driver.wait(until.elementLocated(By.css(".component-button.small.camera-button.v-btn.v-btn--icon")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - cambia pfp')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //go back
    await driver.wait(until.elementLocated(By.css(".v-icon.v-icon--link.mdi.mdi-close")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
*/
    /*cambia account  ***********************************************
    ?????? non mi compare il bottone per cambiare account quando uso selenium???
    await driver.wait(until.elementLocated(By.css(".mdi-account-multiple")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - home - cambia account')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //go back
    await clickElementByCss('.layout.component-close-button.shrink.text-xs-right')
    .catch(err => console.log(err));
*/
    /*gestisci info  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Gestisci')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - gestisci')))
    .then(() => incrNum())
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", driver.findElement(By.xpath("//*[text()[contains(.,'Indirizzo Personale')]]"))))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - gestisci')))
    .then(() => incrNum())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /* non sono cliccabili, oopsie
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Salva')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - gestisci - salvato')))
    .then(() => incrNum())

    await driver.wait(until.elementLocated(By.css("component-button.v-btn.v-btn--depressed.v-btn--round")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))

    //ora siamo in home, clicca profilo
    await driver.wait(until.elementLocated(By.css(".v-avatar")), 10000)
    .then(button => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    */
   
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*clicca situazione contabile - riepilogo *******************************/
    await driver.wait(until.elementLocated(By.css(".component-gradient-card.component-card-with-report")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - situazione contabile - riepilogo')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca portafoglio - dettaglio
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Dettaglio')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - situazione contabile - riepilogo - dettaglio')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //chiudi dettagli
    await clickElementByCss('.layout.component-close-button.shrink.text-xs-right')
    .catch(err => console.log(err));

    //clicca fatture 
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Fatture')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - situazione contabile - fatture')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca depositi
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'depositi')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - situazione contabile - depositi')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //chiudi situazione contabile
    await clickElementByCss(backArrow)
    .catch(err => console.log(err));

    /*apri credito prepagato  ***********************************************/
    await driver.wait(until.elementLocated(By.css(".layout.subheading.font-weight-regular.row.align-center")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - credito prepagato')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //annulla
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Annulla')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*inserisci codice coupon  ***********************************************/
    await driver.wait(until.elementLocated(By.css("[aria-label=\"Inserisci un codice coupon\"]")), 10000)
    .then((field) => field.sendKeys('cazzo'))
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));
    //invia
    await driver.wait(until.elementLocated(By.css(".v-input__icon.v-input__icon--append")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(mediumSleep))
    .catch(err => console.log(err));
    //cazzo non è un coupon valido, che strano
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Conferma')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - coupon respinto')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    
    /*prenotazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Le mie prenotazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - prenotazioni - future')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //tutte
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Tutte')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - prenotazioni - tutte')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //i miei guidatori
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'I miei guidatori')] and (@class = 'v-tabs__item')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - prenotazioni - i miei guidatori')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    
    //aggiungi guidatore
    //ami questa parte la devo commentare perché non fa a chiudere il popup con qr code
    /*
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Aggiungi guidatore')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //chiudi
    await clickElementByCss('.layout.component-close-button.shrink.text-xs-right')
    .catch(err => console.log(err));
    */
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*abbonamenti  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'I miei abbonamenti')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - abbonamenti')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //aggiungi piano
    await clickElementByCss(".component-button.mx-auto.my-4.v-btn.v-btn--floating.v-btn--depressed")
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - aggiungi abbonamento')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*guidatori  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'miei guidatori')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - guidatori')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //aggiungi guidatore
    await clickElementByCss(".component-button.mx-auto.my-4.v-btn.v-btn--floating.v-btn--depressed")
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - aggiungi guidatore')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //go back
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

     /*metodi di pagamento  ***********************************************/
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'metodi di pagamento')] and (@class = 'v-list__tile__title')]")), 10000)
     .then((button) => button.click())
     .then(() => driver.sleep(smallSleep))
     .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - metodi pagamento')))
     .then(() => incrNum())
     .catch(err => console.log(err));
     //aggiungi metodo
     await clickElementByCss(".v-icon.mdi.mdi-plus")
     .then(() => driver.sleep(mediumSleep))
     .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - aggiungi metodo pagamento')))
     .then(() => incrNum())
     .catch(err => console.log(err));
     /*conferma non funziona cazzo
     await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Continua')] and (@class = 'v-btn__content')]")), 10000)
     .then(() => driver.sleep(smallSleep))
     .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - aggiungi metodo pagamento -  conferma')))
     .then(() => incrNum())
    */
     //go back
     await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*documenti  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'documenti')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - documenti')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //go back
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*segnalazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'segnalazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - segnalazioni')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    /*privacy  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Privacy')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - privacy')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //cicla nei contratti
    await driver.wait(until.elementsLocated(By.css("li, .v-expansion-panel__container")), 10000)
    .then(tabs => guardaPrivacyTabs(tabs))
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    //torna a profilo
    await clickElementByCss(backArrow)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    
    //clicca impostazioni  ***********************************************/
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Impostazioni')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - impostazioni')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //clicca centro supporto?
    /*
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Centro Supporto')] and (@class = 'v-list__tile__title')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - impostazioni')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    */
    //clicca aggiungi account
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Aggiungi account')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - impostazioni -  aggiungi account')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //torna indietro
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    //clicca cambia password
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Cambia Password')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - impostazioni -  cambia password')))
    .then(() => incrNum())
    .catch(err => console.log(err));
    //torna indietro
    await clickElementByCss(".v-icon.v-icon--link.mdi.mdi-close")
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    //clicca esci
    await driver.wait(until.elementLocated(By.xpath("//*[text()[contains(.,'Esci')] and (@class = 'v-btn__content')]")), 10000)
    .then((button) => button.click())
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - profilo - impostazioni - esci')))
    .then(() => incrNum())
    .catch(err => console.log(err));
}
//naviga dentro i vari tab della sezione privacy del profilo
async function guardaPrivacyTabs(tabs){
    for(const tab of tabs){
        await tab.click()
        .then(() => driver.sleep(microSleep))
        .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", tab))
        .then(() => driver.sleep(smallSleep))
        .then(() => (saveScreenshot(screenshotsDir, getNum() + ' - privacy agreement')))
        .then(() => incrNum())
        .catch(err => console.log(err));
        
        //chiudi tab
        await tab.click()
        .then(() => driver.sleep(microSleep))
        .catch(err => console.log(err));
    }
}

export { doLogin, navigateProfilo }