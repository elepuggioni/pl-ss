import {navigateActivity} from './activity.js';
import {doLogin, navigateProfilo} from './profilo.js';

//selenium init
import {Builder, By, Key, until, Capabilities} from 'selenium-webdriver';
import slchromepkg from 'selenium-webdriver/chrome.js';
const chrome = slchromepkg;
const service = new chrome.ServiceBuilder('./chromedriver.exe');
const driver = new Builder().forBrowser('chrome').setChromeService(service).build();
const actions = driver.actions();

//fs module init
import filesystempkg from 'fs'
const fs = filesystempkg;
const screenshotsDir = './Screenshots/';

//alcuni selector
const backArrow = '.v-icon.shrink.mdi.mdi-chevron-left';

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
    await driver.takeScreenshot()
    .then((data) => fs.writeFileSync((directory + filename + ".png"), data, 'base64'))
    .catch(err => console.log(err));   
   
}
function incrNum(){
    imgN++;
}
function getNum(){
    return imgN;
}
//clicca un elemento selezionato con css
async function clickElementByCss(selector){
    await driver.wait(until.elementLocated(By.css(selector)), 10000)
    .then(elem=> elem.click())
    .catch(err => console.log(err));   
}
//salta messaggi di finire di settare le impostazioni
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
        .then(() => driver.sleep(mediumSleep))
        .catch(err => console.log(err));

        //clicca skippa metodo pagamento
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then(button => button.click())
        .then(() => driver.sleep(bigSleep))
        .catch(err => console.log(err));

        //clicca skippa selezione piano
        await driver.wait(until.elementLocated(By.css(".v-progress-circular__overlay")), 10000)
        .then(button => button.click())
        .then(() => driver.sleep(mediumSleep))
        .catch(err => console.log(err));
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
    .catch(err => console.log(err));

    //naviga in activity
    await navigateActivity(false)
    .catch(err => console.log(err));

    //siamo tornati in home, clicca activity di nuovo
    await driver.wait(until.elementLocated(By.css('.v-responsive.v-image.ma-auto')), 10000)
    .then(activityButton => activityButton.click())
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log(err));

    //legge credenziali da file
    await readCredentials();
    //fai login
    await doLogin()
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));  
   
    //naviga in activity da loggato
    await navigateActivity(true)
    .then(() => driver.sleep(smallSleep))
    .catch(err => console.log(err));

    //naviga nel profilo
    await navigateProfilo()
    .then(() => driver.sleep(bigSleep))
    .catch(err => console.log(err));
}
(async function(){
    await doStuff()
    .then(() => driver.quit())
    .catch(() => driver.quit())
})();


export {username, password};
export {saveScreenshot, incrNum, getNum, screenshotsDir}
export {skipNotices, clickElementByCss, backArrow}
export {driver, microSleep, smallSleep, mediumSleep, bigSleep}