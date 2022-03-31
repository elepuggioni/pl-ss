import {By, until} from 'selenium-webdriver';
import {saveScreenshot, incrNum, getNum, screenshotsDir} from './main.js';
import {clickElementByCss, backArrow} from './main.js';
import {driver, microSleep, smallSleep, mediumSleep, bigSleep} from './main.js';

//naviga nei piani e dentro le opzioni per ciascuno
async function navigatePiani(){
    let piani = new Array();
    let tabs = new Array();
    let items = new Array();
    let item;

    //trova la lista dei piani
    await driver.wait(until.elementsLocated(By.css(".flex.xs12.sm6.lg4>.component-gradient-card")), 10000)
    .then(result => piani = result)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));
    
    for(let i = 0; i < piani.length; i++){
        //trova la lista dei piani (va refreshata se ricarichi la pagina)
        await driver.wait(until.elementsLocated(By.css(".flex.xs12.sm6.lg4>.component-gradient-card")), 10000)
        .then(result => piani = result)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));

        //clicca un piano
        await (piani[i]).click()
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));

        //prende lista di tab
        await driver.wait(until.elementsLocated(By.css(".v-tabs__item")), 10000)
        .then(result => tabs = result)
        .then(() => driver.sleep(smallSleep))
        .catch(err => console.log(err));

        for(let j = 1; j <= tabs.length; j++){
            //prende lista dei dettagli solo del tab corrente facendo magheggi con il xpath
            await driver.wait(until.elementsLocated(By.xpath("//*[@id=\"plans-wrapper\"]/div/div/div[4]/div[2]/div/div[" + j + "]/ul/li/.")), 10000)
            .then(result => items = result)
            .then(() => driver.sleep(smallSleep))
            .catch(err => console.log(err));

            for(let k = 1; k <= items.length; k++){
                //trova l'item da cliccare
                await driver.wait(until.elementLocated(By.xpath("//*[@id=\"plans-wrapper\"]/div/div/div[4]/div[2]/div/div[" + j + "]/ul/li[" + k + "]")), 10000)
                .then(result => item = result)
                .then(() => guardaDettagliPiano(item, i, j))
                .catch(err => console.log(err));
            }
            if(j < tabs.length){
                //clicca next tab se serve
                await clickNextTab(tabs[j], i, j);
            }
        }
        //esci dal piano
        await clickElementByCss(backArrow)
        .then(() => driver.sleep(mediumSleep));
    }
}
async function clickNextTab(tab, npiano, ntab){
    await tab.click()
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() + " - piano " + npiano + " - sezione " + ntab)))
    .then(() => incrNum())
    .catch(err => console.log(err));
}
//in un piano tariffa, all'interno di una sezione, apre un tab, si posiziona per vederlo bene,
//fa uno screenshot, chiude il tab
async function guardaDettagliPiano(item, npiano, ntab){
    //apri tab
    await item.click()
    .then(() => driver.sleep(microSleep))
    .then(() => driver.executeScript("arguments[0].scrollIntoView(true);", item))
    .then(() => driver.sleep(smallSleep))
    .then(() => (saveScreenshot(screenshotsDir, getNum() +  " - piano " + npiano + " - sezione " + ntab)))
    .then(() => incrNum())
    .catch(err => console.log(err));
    
    //chiudi tab
    await item.click()
    .then(() => driver.sleep(microSleep))
    .catch(err => console.log(err));
}

export { navigatePiani }