const fs = require('fs');
const aes = require('aes-js');
const axios = require('axios');
const delay = require('delay');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const fetch = require('node-fetch');
const Sms = require('./smsActivate.js');
const Five = require('./helpers/5sim.js');
const decomp = require('decompress');
const inquirer = require('inquirer');
const ghost = require(`ghost-cursor`);
const puppeteer = require('puppeteer');
const JSSoup = require('jssoup').default;
const setTitle = require('console-title');
const startTasks = require('./nikeGen');
const { Webhook, MessageBuilder } = require(`discord-webhook-node`);
const logo =  ``;

class CommandLineInterface {

    // Global values
    constructor() {

        // Prompts
        this.moduleMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please choose a module to run:'),
            choices: [ 'Nike Generator', 'Amazon Generator (Coming Soon)', 'Outlook Generator (Coming Soon)', 'Exit']
        };
        this.mainMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Api Settings', 'Task Settings', 'Chrome Settings', 'License Settings', 'Email Settings', 'Proxy Settings', 'Webhook Settings', 'Exit' ]
        };
        this.chromeMenu = {
            name: 'choice',
            message: chalk.yellow('Please make a choice: '),
            type: 'list',
            choices: [ 'Load Chrome Path', 'Replace Chrome Path' , 'Go Back', 'Exit']
        };
        this.taskMenu = {
            name: 'option', 
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Start Tasks', 'Load Tasks', 'Remove Tasks', 'Go Back', 'Exit' ]
        };
        this.licenseMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Replace License', 'Go Back', 'Exit' ]
        };
        this.exportMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice'),
            choices: [ 'Export Verified Accounts', 'Export Failed Accounts', 'Go Back', 'Exit' ]
        };
        this.webhookMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Load Webhooks', 'Remove Webhooks', 'Test Webhooks', 'Go Back', 'Exit' ]
        };
        this.webChoices = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Load Success Webhook', 'Load Failed Webhook', 'Remove Success Webhook', 'Remove Failed Webhook', 'Test Success Webhook', 'Test Failed Webhook', 'Go Back', 'Exit' ]
        };
        this.emailMenu = {
            name: 'option', 
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Catchall Settings', 'Other Email Settings', 'Go Back', 'Exit' ]
        };
        this.catchMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Load Catchall', 'Remove Catchall', 'Go Back', 'Exit' ]
        };
        this.proxyMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ 'Load Proxies', 'Remove Proxies', 'Go Back', 'Exit' ]
        };
        this.apiMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please choose you api service:'),
            choices: ['Load Api Key', 'Remove Api Key', 'Check Balance', 'Check Prices/Stock', 'Go Back', 'Exit']
        };
        this.apiServices = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Please make your choice:'),
            choices: [ '5sim', 'Sms Activate', 'Go Back', 'Exit' ]
        };
        this.customEmailMenu = {
            name: 'option',
            type: 'list',
            message: chalk.yellow('Pleas make your choice:'),
            choices: [ 'Load Emails', 'Remove Emails', 'Go Back', 'Exit' ]
        };

        // Other Variables
        this.mainKey = '157e23a6c5ee6b439646d95a45d53fd87350bcc36a6163e8ff1f0bfdadc0fdf5cc4e16f797acca892d6409ca7524ddda';
        this.cookKey = '304a985e3b140c64c326a01b42de7e830cf6fd2ec704eead745e3d4ac7d70f09063c2d5da45a121dfd25d64de87f45f5';
        this.versionLink = 'a2b4a7072c903488613809b17b110829377a0cd38fcf37fe9f067072aee66c63d5090070090877ca44d2c9fff13fe9f3a6d2d413067ef70442d4c5c84bb3777550d7a6b987902b3d70095e3605e98d75';
        this.image = 'https://cdn.discordapp.com/attachments/739242868379484162/829053466617577523/venom_logo.png';
        this.donwloadUrl = 'https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Win_x64';
        this.decKey = [133, 222, 222, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161];
        this.decKeyIV = [111, 222, 129, 111, 50, 23, 12, 33, 76, 23, 12, 43, 19, 65, 54, 34];
        this.operatingSystem = process.platform;
        this.fiveApi = new Five();
        this.smsApi = new Sms();
        this.version = 'v0.0.3';
        this.user = '';

        // Country array for valid countries for Nike
        this.smsCountries = {
            "0":{
                "id":0,
                "rus":"????????????",
                "eng":"Russia",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "1":{
                "id":1,
                "rus":"??????????????",
                "eng":"Ukraine",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "2":{
                "id":2,
                "rus":"??????????????????",
                "eng":"Kazakhstan",
                "chn":"???????????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "3":{
                "id":3,
                "rus":"??????????",
                "eng":"China",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "4":{
                "id":4,
                "rus":"??????????????????",
                "eng":"Philippines",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "5":{
                "id":5,
                "rus":"????????????",
                "eng":"Myanmar",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "6":{
                "id":6,
                "rus":"??????????????????",
                "eng":"Indonesia",
                "chn":"???????????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "7":{
                "id":7,
                "rus":"????????????????",
                "eng":"Malaysia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "8":{
                "id":8,
                "rus":"??????????",
                "eng":"Kenya",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "9":{
                "id":9,
                "rus":"????????????????",
                "eng":"Tanzania",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "10":{
                "id":10,
                "rus":"??????????????",
                "eng":"Vietnam",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "11":{
                "id":11,
                "rus":"????????????????????",
                "eng":"Kyrgyzstan",
                "chn":"??????????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "12":{
                "id":12,
                "rus":"?????? (??????????????????????)",
                "eng":"USA (virtual)",
                "chn":"??????????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "13":{
                "id":13,
                "rus":"??????????????",
                "eng":"Israel",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "14":{
                "id":14,
                "rus":"??????????????",
                "eng":"HongKong",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "15":{
                "id":15,
                "rus":"????????????",
                "eng":"Poland",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "16":{
                "id":16,
                "rus":"????????????",
                "eng":"England",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "17":{
                "id":17,
                "rus":"????????????????????",
                "eng":"Madagascar",
                "chn":"???????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "18":{
                "id":18,
                "rus":"??????. ??????????",
                "eng":"DCongo",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "19":{
                "id":19,
                "rus":"??????????????",
                "eng":"Nigeria",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "20":{
                "id":20,
                "rus":"??????????",
                "eng":"Macao",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "21":{
                "id":21,
                "rus":"????????????",
                "eng":"Egypt",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "22":{
                "id":22,
                "rus":"??????????",
                "eng":"India",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "23":{
                "id":23,
                "rus":"????????????????",
                "eng":"Ireland",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "24":{
                "id":24,
                "rus":"????????????????",
                "eng":"Cambodia",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "25":{
                "id":25,
                "rus":"????????",
                "eng":"Laos",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "26":{
                "id":26,
                "rus":"??????????",
                "eng":"Haiti",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":0
            },
            "27":{
                "id":27,
                "rus":"?????? ??'??????????",
                "eng":"Ivory",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "28":{
                "id":28,
                "rus":"????????????",
                "eng":"Gambia",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "29":{
                "id":29,
                "rus":"????????????",
                "eng":"Serbia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "30":{
                "id":30,
                "rus":"??????????",
                "eng":"Yemen",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "31":{
                "id":31,
                "rus":"??????",
                "eng":"Southafrica",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "32":{
                "id":32,
                "rus":"??????????????",
                "eng":"Romania",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "33":{
                "id":33,
                "rus":"????????????????",
                "eng":"Colombia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "34":{
                "id":34,
                "rus":"??????????????",
                "eng":"Estonia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "35":{
                "id":35,
                "rus":"??????????????????????",
                "eng":"Azerbaijan",
                "chn":"????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "36":{
                "id":36,
                "rus":"????????????",
                "eng":"Canada",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "37":{
                "id":37,
                "rus":"??????????????",
                "eng":"Morocco",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "38":{
                "id":38,
                "rus":"????????",
                "eng":"Ghana",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "39":{
                "id":39,
                "rus":"??????????????????",
                "eng":"Argentina",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "40":{
                "id":40,
                "rus":"????????????????????",
                "eng":"Uzbekistan",
                "chn":"??????????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "41":{
                "id":41,
                "rus":"??????????????",
                "eng":"Cameroon",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "42":{
                "id":42,
                "rus":"??????",
                "eng":"Chad",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "43":{
                "id":43,
                "rus":"????????????????",
                "eng":"Germany",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "44":{
                "id":44,
                "rus":"??????????",
                "eng":"Lithuania",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "45":{
                "id":45,
                "rus":"????????????????",
                "eng":"Croatia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "46":{
                "id":46,
                "rus":"????????????",
                "eng":"Sweden",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "47":{
                "id":47,
                "rus":"????????",
                "eng":"Iraq",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "48":{
                "id":48,
                "rus":"????????????????????",
                "eng":"Netherlands",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "49":{
                "id":49,
                "rus":"????????????",
                "eng":"Latvia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "50":{
                "id":50,
                "rus":"??????????????",
                "eng":"Austria",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "51":{
                "id":51,
                "rus":"????????????????",
                "eng":"Belarus",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "52":{
                "id":52,
                "rus":"??????????????",
                "eng":"Thailand",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "53":{
                "id":53,
                "rus":"????????. ????????????",
                "eng":"Saudiarabia",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "54":{
                "id":54,
                "rus":"??????????????",
                "eng":"Mexico",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "55":{
                "id":55,
                "rus":"??????????????",
                "eng":"Taiwan",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "56":{
                "id":56,
                "rus":"??????????????",
                "eng":"Spain",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "57":{
                "id":57,
                "rus":"????????",
                "eng":"Iran",
                "chn":"??????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "58":{
                "id":58,
                "rus":"??????????",
                "eng":"Algeria",
                "chn":"???????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "59":{
                "id":59,
                "rus":"????????????????",
                "eng":"Slovenia",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "60":{
                "id":60,
                "rus":"??????????????????",
                "eng":"Bangladesh",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "61":{
                "id":61,
                "rus":"??????????????",
                "eng":"Senegal",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "62":{
                "id":62,
                "rus":"????????????",
                "eng":"Turkey",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "63":{
                "id":63,
                "rus":"??????????",
                "eng":"Czech",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "64":{
                "id":64,
                "rus":"??????-??????????",
                "eng":"Srilanka",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "65":{
                "id":65,
                "rus":"????????",
                "eng":"Peru",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "66":{
                "id":66,
                "rus":"????????????????",
                "eng":"Pakistan",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "67":{
                "id":67,
                "rus":"?????????? ????????????????",
                "eng":"Newzealand",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "68":{
                "id":68,
                "rus":"????????????",
                "eng":"Guinea",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "69":{
                "id":69,
                "rus":"????????",
                "eng":"Mali",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "70":{
                "id":70,
                "rus":"??????????????????",
                "eng":"Venezuela",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "71":{
                "id":71,
                "rus":"??????????????",
                "eng":"Ethiopia",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "72":{
                "id":72,
                "rus":"????????????????",
                "eng":"Mongolia",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "73":{
                "id":73,
                "rus":"????????????????",
                "eng":"Brazil",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "74":{
                "id":74,
                "rus":"????????????????????",
                "eng":"Afghanistan",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "75":{
                "id":75,
                "rus":"????????????",
                "eng":"Uganda",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "76":{
                "id":76,
                "rus":"????????????",
                "eng":"Angola",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "77":{
                "id":77,
                "rus":"????????",
                "eng":"Cyprus",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "78":{
                "id":78,
                "rus":"??????????????",
                "eng":"France",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "79":{
                "id":79,
                "rus":"??????????-?????????? ????????????",
                "eng":"Papua",
                "chn":"?????????????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "80":{
                "id":80,
                "rus":"????????????????",
                "eng":"Mozambique",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "81":{
                "id":81,
                "rus":"??????????",
                "eng":"Nepal",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "82":{
                "id":82,
                "rus":"??????????????",
                "eng":"Belgium",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "83":{
                "id":83,
                "rus":"????????????????",
                "eng":"Bulgaria",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "84":{
                "id":84,
                "rus":"??????????????",
                "eng":"Hungary",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "85":{
                "id":85,
                "rus":"??????????????",
                "eng":"Moldova",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "86":{
                "id":86,
                "rus":"????????????",
                "eng":"Italy",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "87":{
                "id":87,
                "rus":"????????????????",
                "eng":"Paraguay",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "88":{
                "id":88,
                "rus":"????????????????",
                "eng":"Honduras",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "89":{
                "id":89,
                "rus":"??????????",
                "eng":"Tunisia",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "90":{
                "id":90,
                "rus":"??????????????????",
                "eng":"Nicaragua",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "91":{
                "id":91,
                "rus":"??????????-??????????",
                "eng":"Timorleste",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "92":{
                "id":92,
                "rus":"??????????????",
                "eng":"Bolivia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "93":{
                "id":93,
                "rus":"?????????? ????????",
                "eng":"Costarica",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "94":{
                "id":94,
                "rus":"??????????????????",
                "eng":"Guatemala",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "95":{
                "id":95,
                "rus":"??????",
                "eng":"Uae",
                "chn":"????????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "96":{
                "id":96,
                "rus":"????????????????",
                "eng":"Zimbabwe",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "97":{
                "id":97,
                "rus":"????????????-????????",
                "eng":"Puertorico",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "98":{
                "id":98,
                "rus":"??????????",
                "eng":"Sudan",
                "chn":"????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "99":{
                "id":99,
                "rus":"????????",
                "eng":"Togo",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "100":{
                "id":100,
                "rus":"????????????",
                "eng":"Kuwait",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "101":{
                "id":101,
                "rus":"??????????????????",
                "eng":"Salvador",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "102":{
                "id":102,
                "rus":"??????????",
                "eng":"Libyan",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "103":{
                "id":103,
                "rus":"????????????",
                "eng":"Jamaica",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "104":{
                "id":104,
                "rus":"???????????????? ?? ????????????",
                "eng":"Trinidad",
                "chn":"????????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "105":{
                "id":105,
                "rus":"??????????????",
                "eng":"Ecuador",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "106":{
                "id":106,
                "rus":"??????????????????",
                "eng":"Swaziland",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "107":{
                "id":107,
                "rus":"????????",
                "eng":"Oman",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "108":{
                "id":108,
                "rus":"???????????? ?? ??????????????????????",
                "eng":"Bosnia",
                "chn":"??????????????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "109":{
                "id":109,
                "rus":"?????????????????????????? ????????????????????",
                "eng":"Dominican",
                "chn":"?????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "110":{
                "id":110,
                "rus":"??????????",
                "eng":"Syrian",
                "chn":"?????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "111":{
                "id":111,
                "rus":"??????????",
                "eng":"Qatar",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "112":{
                "id":112,
                "rus":"????????????",
                "eng":"Panama",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "113":{
                "id":113,
                "rus":"????????",
                "eng":"Cuba",
                "chn":"??????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "114":{
                "id":114,
                "rus":"????????????????????",
                "eng":"Mauritania",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "115":{
                "id":115,
                "rus":"????????????-??????????",
                "eng":"Sierraleone",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "116":{
                "id":116,
                "rus":"????????????????",
                "eng":"Jordan",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "117":{
                "id":117,
                "rus":"????????????????????",
                "eng":"Portugal",
                "chn":"?????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "118":{
                "id":118,
                "rus":"????????????????",
                "eng":"Barbados",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "119":{
                "id":119,
                "rus":"??????????????",
                "eng":"Burundi",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "120":{
                "id":120,
                "rus":"??????????",
                "eng":"Benin",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "121":{
                "id":121,
                "rus":"????????????",
                "eng":"Brunei",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "122":{
                "id":122,
                "rus":"????????????",
                "eng":"Bahamas",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "123":{
                "id":123,
                "rus":"????????????????",
                "eng":"Botswana",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "124":{
                "id":124,
                "rus":"??????????",
                "eng":"Belize",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "125":{
                "id":125,
                "rus":"??????",
                "eng":"Caf",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "126":{
                "id":126,
                "rus":"????????????????",
                "eng":"Dominica",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "127":{
                "id":127,
                "rus":"??????????????",
                "eng":"Grenada",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "128":{
                "id":128,
                "rus":"????????????",
                "eng":"Georgia",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":1
            },
            "129":{
                "id":129,
                "rus":"????????????",
                "eng":"Greece",
                "chn":"??????",
                "visible":1,
                "retry":1,
                "rent":1,
                "multiService":1
            },
            "130":{
                "id":130,
                "rus":"????????????-??????????",
                "eng":"Guineabissau",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "131":{
                "id":131,
                "rus":"????????????",
                "eng":"Guyana",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "132":{
                "id":132,
                "rus":"????????????????",
                "eng":"Iceland",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "133":{
                "id":133,
                "rus":"????????????",
                "eng":"Comoros",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "134":{
                "id":134,
                "rus":"????????-???????? ?? ??????????",
                "eng":"Saintkitts",
                "chn":"?????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "135":{
                "id":135,
                "rus":"??????????????",
                "eng":"Liberia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "136":{
                "id":136,
                "rus":"????????????",
                "eng":"Lesotho",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "137":{
                "id":137,
                "rus":"????????????",
                "eng":"Malawi",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "138":{
                "id":138,
                "rus":"??????????????",
                "eng":"Namibia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "139":{
                "id":139,
                "rus":"??????????",
                "eng":"Niger",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "140":{
                "id":140,
                "rus":"????????????",
                "eng":"Rwanda",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "141":{
                "id":141,
                "rus":"????????????????",
                "eng":"Slovakia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "142":{
                "id":142,
                "rus":"??????????????",
                "eng":"Suriname",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "143":{
                "id":143,
                "rus":"??????????????????????",
                "eng":"Tajikistan",
                "chn":"???????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "144":{
                "id":144,
                "rus":"????????????",
                "eng":"Monaco",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "145":{
                "id":145,
                "rus":"??????????????",
                "eng":"Bahrain",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "146":{
                "id":146,
                "rus":"??????????????",
                "eng":"Reunion",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "147":{
                "id":147,
                "rus":"????????????",
                "eng":"Zambia",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "148":{
                "id":148,
                "rus":"??????????????",
                "eng":"Armenia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "149":{
                "id":149,
                "rus":"????????????",
                "eng":"Somalia",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "150":{
                "id":150,
                "rus":"??????????",
                "eng":"Congo",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "151":{
                "id":151,
                "rus":"????????",
                "eng":"Chile",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "152":{
                "id":152,
                "rus":"??????????????-????????",
                "eng":"Furkinafaso",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "153":{
                "id":153,
                "rus":"??????????",
                "eng":"Lebanon",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "154":{
                "id":154,
                "rus":"??????????",
                "eng":"Gabon",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "155":{
                "id":155,
                "rus":"??????????????",
                "eng":"Albania",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "156":{
                "id":156,
                "rus":"??????????????",
                "eng":"Uruguay",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "157":{
                "id":157,
                "rus":"????????????????",
                "eng":"Mauritius",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "158":{
                "id":158,
                "rus":"??????????",
                "eng":"Bhutan",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "159":{
                "id":159,
                "rus":"????????????????",
                "eng":"Maldives",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "160":{
                "id":160,
                "rus":"??????????????????",
                "eng":"Guadeloupe",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "161":{
                "id":161,
                "rus":"????????????????????????",
                "eng":"Turkmenistan",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "162":{
                "id":162,
                "rus":"?????????????????????? ????????????",
                "eng":"Frenchguiana",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "163":{
                "id":163,
                "rus":"??????????????????",
                "eng":"Finland",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "164":{
                "id":164,
                "rus":"????????-??????????",
                "eng":"Saintlucia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "165":{
                "id":165,
                "rus":"????????????????????",
                "eng":"Luxembourg",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "166":{
                "id":166,
                "rus":"????????-?????????????? ?? ????????????????",
                "eng":"Saintvincentgrenadines",
                "chn":"??????????????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "167":{
                "id":167,
                "rus":"???????????????????????????? ????????????",
                "eng":"Equatorialguinea",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "168":{
                "id":168,
                "rus":"??????????????",
                "eng":"Djibouti",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "169":{
                "id":169,
                "rus":"?????????????? ?? ??????????????",
                "eng":"Antiguabarbuda",
                "chn":"?????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "170":{
                "id":170,
                "rus":"?????????????? ????????????",
                "eng":"Caymanislands",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "171":{
                "id":171,
                "rus":"????????????????????",
                "eng":"Montenegro",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "172":{
                "id":172,
                "rus":"??????????",
                "eng":"Denmark",
                "chn":"??????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "173":{
                "id":173,
                "rus":"??????????????????",
                "eng":"Switzerland",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "174":{
                "id":174,
                "rus":"????????????????",
                "eng":"Norway",
                "chn":"??????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "175":{
                "id":175,
                "rus":"??????????????????",
                "eng":"Australia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "176":{
                "id":176,
                "rus":"??????????????",
                "eng":"Eritrea",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "177":{
                "id":177,
                "rus":"?????????? ??????????",
                "eng":"Southsudan",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "178":{
                "id":178,
                "rus":"??????-???????? ?? ????????????????",
                "eng":"Saotomeandprincipe",
                "chn":"????????????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "179":{
                "id":179,
                "rus":"??????????",
                "eng":"Aruba",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "180":{
                "id":180,
                "rus":"????????????????????",
                "eng":"Montserrat",
                "chn":"???????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "181":{
                "id":181,
                "rus":"??????????????",
                "eng":"Anguilla",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "182":{
                "id":182,
                "rus":"????????????",
                "eng":"Japan",
                "chn":"??????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "183":{
                "id":183,
                "rus":"???????????????? ??????????????????",
                "eng":"Northmacedonia",
                "chn":"????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "184":{
                "id":184,
                "rus":"???????????????????? ??????????????",
                "eng":"Seychelles",
                "chn":"??????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "185":{
                "id":185,
                "rus":"?????????? ??????????????????",
                "eng":"Newcaledonia",
                "chn":"??????????????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "186":{
                "id":186,
                "rus":"????????-??????????",
                "eng":"Capeverde",
                "chn":"?????????",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "187":{
                "id":187,
                "rus":"??????",
                "eng":"USA",
                "chn":"???????????????)",
                "visible":1,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "188":{
                "id":188,
                "rus":"??????????????????",
                "eng":"Palestine",
                "chn":"????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "189":{
                "id":189,
                "rus":"??????????",
                "eng":"Fiji",
                "chn":"??????",
                "visible":0,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "190":{
                "id":190,
                "rus":"?????????? ??????????",
                "eng":"Southkorea",
                "chn":"????????????",
                "visible":1,
                "retry":1,
                "rent":0,
                "multiService":0
            },
            "191":{
                "id":191,
                "rus":"???????????????? ??????????",
                "eng":"Northkorea",
                "chn":"?????????????????????????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "192":{
                "id":192,
                "rus":"???????????????? ????????????",
                "eng":"Westernsahara",
                "chn":"?????????????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "193":{
                "id":193,
                "rus":"???????????????????? ??????????????",
                "eng":"Solomonislands",
                "chn":"???????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "194":{
                "id":194,
                "rus":"????????????",
                "eng":"Jersey",
                "chn":"?????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "195":{
                "id":195,
                "rus":"??????????????",
                "eng":"Bermuda",
                "chn":"?????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "196":{
                "id":196,
                "rus":"????????????????",
                "eng":"Singapore",
                "chn":"??????????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "197":{
                "id":197,
                "rus":"??????????",
                "eng":"Tonga",
                "chn":"????????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "198":{
                "id":198,
                "rus":"??????????",
                "eng":"Samoa",
                "chn":"?????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            },
            "199":{
                "id":199,
                "rus":"????????????",
                "eng":"Malta",
                "chn":"?????????",
                "visible":0,
                "retry":0,
                "rent":0,
                "multiService":0
            }
        };

    };

    // Decrypt Algorhythm 
    async initKey(encHex) {
        let aesCbc, decHex, decBytes, decStr;
        decHex = await aes.utils.hex.toBytes(encHex);
        aesCbc = await new aes.ModeOfOperation.cbc(this.decKey, this.decKeyIV);
        decBytes = await aesCbc.decrypt(decHex);
        decStr = await aes.utils.utf8.fromBytes(decBytes);
        return decStr;
    };

    // Init files
    async initFiles() {
        let licenseData = {
            License: {}
        };
        let apiData = {
            Api: {
                Sms: {},
                '5sim': {}
            }
        };
        let catchData = [];
        let webhookData = {
            Webhook: {
                Success: {},
                Failed: {}
            }
        };
        let successData = {
            Accounts: []
        };
        let failedData = {
            Accounts: []
        };
        let chromeData = {
            Path: {}
        };
        if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data`)) {            
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        } else if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`)) {
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Cookies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            await mkdirp(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path`);
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(failedData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(successData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchData, null, 4));
            if (!fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`)) fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webhookData, null, 4));
        }
    };

    // Auth for license key
    async auth() {

        // Decypt auth keys
        let decKey1 = await this.initKey(this.mainKey);
        let decKey2 = await this.initKey(this.cookKey);
        let genKey = decKey1.replace('\x06\x06\x06\x06\x06\x06', '');
        let cookKey = decKey2.replace('\x06\x06\x06\x06\x06\x06', '');

        // Check if user has a key
        let licenseKey;
        let hasLicense = true;
        let initFileData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`);
        let initJson = JSON.parse(initFileData);
        if (JSON.stringify(initJson.License) == '{}') hasLicense = false;
        if (hasLicense != false) licenseKey = initJson.License.Key;

        // Login loop
        let auth = false;
        let mainResult;
        let cookResult
        while (auth != true) {
            
            // Greeting page
            await setTitle(`Venom Gen ${this.version} | Authorization`);
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow('* Authorization'));
            console.log(chalk.yellow('=='));

            // Ask user for key only is hasLicense is set to false
            if (hasLicense != true) {
                let userResp = await inquirer.prompt({ name: 'license', type: 'input', message: chalk.yellow('Please enter your venom license key:') })
                licenseKey = userResp.license.trim();
                console.clear();
                await setTitle(`Venom Gen ${this.version} | Verifying ${licenseKey}`);
                console.log(chalk.yellow(logo));
                console.log(chalk.yellow(`* Verifying ${chalk.green(licenseKey)}`));
                console.log(chalk.yellow('=='));
            } else {
                console.clear();
                await setTitle(`Venom Gen ${this.version} | Verifying ${licenseKey}`);
                console.log(chalk.yellow(logo));
                console.log(chalk.yellow(`* Verifying ${chalk.green(licenseKey)}`));
                console.log(chalk.yellow('=='));
            }
            
            // Send requests
            try {
                mainResult = await fetch(`https://api.hyper.co/v4/licenses/${licenseKey}`, { method: 'get', headers: { Authorization: genKey }, })
                if (mainResult.status != 200) {
                    cookResult = await fetch(`https://api.hyper.co/v4/licenses/${licenseKey}`, { method: 'get', headers: { Authorization: cookKey }, })
                    if (cookResult.status != 200) {
                        console.clear()
                        await setTitle(`Venom Gen ${this.version} | Invalid Key`);
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* Invalid license key!'));
                        console.log(chalk.yellow('=='));
                        if (hasLicense != false) {
                            hasLicense = false;
                        };
                    } else {
                        console.clear();
                        await setTitle(`Venom Gen ${this.version} | License Verified`);
                        console.log(chalk.yellow(logo));
                        console.log(chalk.green('* License has been verfied!'));
                        let metaBody = await mainResult.json();
                        this.user = metaBody['user']['discord']['username'];
                        let licenseJson = {
                            License: {
                                Key: licenseKey,
                                User: this.user
                            }
                        };
                        fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseJson, null, 4));
                    };
                } else {
                    console.clear();
                    await setTitle(`Venom Gen ${this.version} | License Verified`);
                    console.log(chalk.yellow(logo));
                    console.log(chalk.green('* License has been verfied!'));
                    let metaBody = await mainResult.json();
                    this.user = metaBody['user']['discord']['username'];
                    let licenseJson = {
                        License: {
                            Key: licenseKey,
                            User: this.user
                        }
                    };
                    fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseJson, null, 4));
                    auth = true;
                };
            } catch(err) {
                console.clear();
                await setTitle(`Venom Gen ${this.version} | Error Authenticating`);
                console.log(chalk.yellow(logo));
                console.log(chalk.red('* Error when authenticating your license key!'));
                console.log(chalk.yellow('=='));
                await delay(2500);
                await this.init();
            };
        };
        
    };

    // Greet User
    async greet() {
        console.clear()
        console.log(chalk.yellow(logo));
        console.log(chalk.yellow(`* Welcome To Venom Gen, ${chalk.green(this.user)}!`))
        console.log(chalk.yellow('=='));
    };

    // Discord presence
    discordPresence() {
        const discRpc = require('discord-rpc');
        const rpc = new discRpc.Client({
            transport: 'ipc'
        });
        rpc.on('ready', () => {
            rpc.setActivity({
                details: this.version,
                state: 'Cooking retail accounts...',
                startTimestamp: Date.now() - 500000,
                smallImageKey: 'twitter_logo',
                smallImageText: '@venom_gen',
                largeImageKey: 'venom_logo',
                largeImageText: 'Venom Gen',
                instance: true
            });
        });
        rpc.login({
            clientId: '819275178269737041',
        });
    };

    // Self-destruct on update
    async versionControl() {
        try {
            let resp = await axios.get('https://api.github.com/repos/dracoDevs/VenomVersionControl/releases');
            let newVersion = resp.data[0].tarball_url.split('/')[7]
            if (newVersion != this.version) console.clear(), console.log(chalk.yellow(logo)), console.log(chalk.yellow(`* ${chalk.red(`An update is available ${chalk.green(newVersion)}!`)}`)), console.log(chalk.yellow('==')), await delay(3000), process.exit();
            if (newVersion == this.version) console.clear(), console.log(chalk.yellow(logo)), console.log(chalk.yellow(`* ${chalk.green('No updates available!')}`)), console.log(chalk.yellow('==')), await delay(1000);
        } catch(err) {
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.red('* You are being rate limited please allow up to 10 seconds before running the bot!'));
            console.log(chalk.yellow('=='));
            await delay(2500);
            process.exit();
        }
    };

    // Api settings
    async apiSettings() {
        try {
            // General vars
            let fiveSim = chalk.red('Not found');
            let smsAct = chalk.red('Not found');
    
            // Extract both api keys if any
            let apiData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`);
            let apiJson = JSON.parse(apiData);
            if (JSON.stringify(apiJson.Api.Sms) != '{}') smsAct = apiJson.Api.Sms;
            if (JSON.stringify(apiJson.Api['5sim']) != '{}') fiveSim = apiJson.Api['5sim'];
    
            // Display api keys
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow(`* 5sim Key: ${chalk.green(fiveSim)}`));
            console.log(chalk.yellow(`* Sms Activate Key: ${chalk.green(smsAct)}`));
            console.log(chalk.yellow('=='));
            
            // Ask user for choice
            let apiChoice = await inquirer.prompt(this.apiServices);
    
            // Service option handling
            let balance;
            let statsArr;
            let userChoice;
            try {
                switch (apiChoice.option) {
                    case '5sim':
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow(`* 5sim Key: ${chalk.green(fiveSim)}`));
                        console.log(chalk.yellow('=='));
                        userChoice = await inquirer.prompt(this.apiMenu);
                        switch (userChoice.option) {
                            case 'Load Api Key':
                                if (fiveSim != 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You have an api key loaded already!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                userChoice = await inquirer.prompt({ name: 'key', type: 'input', message: chalk.yellow('Please enter you 5sim key:') });
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow(`* Saving Key ${chalk.green(userChoice.key)}`));
                                apiJson = {
                                    Api: {
                                        Sms: apiJson.Api.Sms,
                                        '5sim': userChoice.key.trim()
                                    }
                                };
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiJson, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green(`* Key has been saved!`));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.apiSettings();
                            case 'Remove Api Key':
                                if (fiveSim == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* There is no api key to remove!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                };
                                apiJson = {
                                    Api: {
                                        Sms: apiJson.Api.Sms,
                                        '5sim': {}
                                    }
                                };
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow('* Removing key...'));
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiJson, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green('* Key has been removed!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.apiSettings();
                            case 'Check Prices/Stock':
                                if (fiveSim == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You do not have an api key loaded!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                let sortedArr = await this.fiveApi.getPricesStock();
                                if (sortedArr == 'Error: Get prices and stock') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log( chalk.red('* There was an error while fetching prices and stock!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                } else {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.yellow('* 5sim Prices/Stock'))
                                    console.log(chalk.yellow('=='));
                                    sortedArr.forEach(item => {
                                        console.log(item.message);
                                    });
                                    console.log(chalk.yellow('=='));
                                    await delay(5000);
                                    await this.apiSettings();
                                };
                            case 'Check Balance':
                                if (fiveSim == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You do not have an api key loaded!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                balance = await this.fiveApi.checkBalance(smsAct);
                                if (balance != 'Invalid api key') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.yellow(`* Api balance: ${chalk.green(balance)}`));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                } else {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* Invalid api key provided!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                            case 'Go Back':
                                console.clear();
                                await this.apiSettings();
                            case 'Exit':
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow('* Exiting now...'));
                                await delay(2500);
                                process.exit();
                        };
                    case 'Sms Activate':
                        let errorArr = ['BAD_KEY', 'ERROR_SQL', 'NO_BALANCE', 'BAD_SERVICE', 'NO_BALANCE_FORWARD', 'NOT_AVAILABLE'];
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow(`* Sms Activate Key: ${chalk.green(smsAct)}`));
                        console.log(chalk.yellow('=='));
                        userChoice = await inquirer.prompt(this.apiMenu);
                        switch (userChoice.option) {
                            case 'Load Api Key':
                                if (smsAct != 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You have an api key loaded already!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                userChoice = await inquirer.prompt({ name: 'key', type: 'input', message: chalk.yellow('Please enter you Sms Activate key:') });
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow(`* Saving Key ${chalk.green(userChoice.key)}`));
                                console.log(chalk.yellow('=='));
                                apiJson = {
                                    Api: {
                                        Sms: userChoice.key.trim(),
                                        '5sim': apiJson.Api['5sim']
                                    }
                                };
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiJson, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green(`* Key has been saved!`));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.apiSettings();
                            case 'Remove Api Key':
                                if (smsAct == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* There is no api key to remove!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                };
                                apiJson = {
                                    Api: {
                                        Sms: {},
                                        '5sim': apiJson.Api['5sim']
                                    }
                                };
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow('* Removing key...'));
                                console.log(chalk.yellow('=='));
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`, JSON.stringify(apiJson, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green('* Key has been removed!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.apiSettings();
                            case 'Check Prices/Stock':
                                if (smsAct == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You do not have an api key loaded!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                let sortedArr = await this.smsApi.getPricesStock(smsAct);
                                switch (sortedArr) {
                                    case 'BAD_KEY':
                                        console.clear();
                                        console.log(chalk.yellow(logo));
                                        console.log(chalk.red('* Invalid api key provided!'));
                                        console.log(chalk.yellow('=='));
                                        await delay(2500);
                                        await this.apiSettings();
                                    case 'ERROR_SQL':
                                        console.clear();
                                        console.log(chalk.yellow(logo));
                                        console.log(chalk.red('* There was an error with Sms Activate!'));
                                        console.log(chalk.yellow('=='));
                                        await delay(2500);
                                        await this.apiSettings();
                                    default:
                                        console.clear();
                                        console.log(chalk.yellow(logo));
                                        console.log(chalk.yellow('* Sms Activate Prices/Stock'));
                                        console.log(chalk.yellow('=='));
                                        sortedArr.forEach(item => {
                                            console.log(item.message);
                                        });
                                        console.log(chalk.yellow('=='));
                                        await delay(5000);
                                        await this.apiSettings();
                                };
                            case 'Check Balance':
                                if (smsAct == 'Not found') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* You do not have an api key loaded!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                                balance = await this.smsApi.checkBalance(smsAct);
                                if (balance != 'Invalid key') {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.yellow(`* Api balance: ${chalk.green(balance)}`));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                } else {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* Invalid api key!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.apiSettings();
                                };
                            case 'Go Back':
                                console.clear();
                                await this.apiSettings();
                            case 'Exit':
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow('* Exiting now...'));
                                await delay(2500);
                                process.exit();
                        };
                    case 'Go Back':
                        console.clear();
                        await this.init();
                    case 'Exit':
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* Exiting now...'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        process.exit();
                };
            } catch(err) {
                switch (err) {
                    case 'Error: Invalid key':
                        console.clear();
                        console.log(challk.yelow(logo));
                        console.log(chalk.red('* Invalid api key provided!'));
                        console.log(chalk.yellow('=='));  
                    default: 
                        console.log(err);
                        await delay(9999);
                };
            };
        } catch(err) {
            throw 'Error: Api Settings';
        };

    };

    // Chrome Settings  
    async chromeSettings() {

        // Check if chrome path is already loaded
        let currentPath;
        let chromeData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`);
        chromeData = JSON.parse(chromeData);
        if (JSON.stringify(chromeData.Path) != '{}') currentPath = chalk.green(chromeData.Path.File);
        if (JSON.stringify(chromeData.Path) == '{}') currentPath = chalk.red('Not found');

        // Intro page
        console.clear();
        console.log(chalk.yellow(logo));
        console.log(chalk.yellow(`Chrome Path: ${currentPath}`));
        console.log(chalk.yellow('=='));

        // Prompt user for choice
        let userPath;
        let userChoice = await inquirer.prompt(this.chromeMenu);
        switch (userChoice.choice) {
            case 'Load Chrome Path':
                try {
                    if (currentPath != chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* You already have a chrome path loaded!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.chromeSettings();
                    };
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow(`Chrome Path: ${currentPath}`));
                    console.log(chalk.yellow('=='));
                    userPath = await inquirer.prompt({ name: 'path', type: 'input', message: chalk.yellow(`Please enter your chrome path (${chalk.green('chrome://version')}):`) });
                    if (!fs.existsSync(userPath.path)) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* Path does not exist!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.chromeSettings();
                    } else {
                        chromeData.Path.File = userPath.path;
                        fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.green('* Chrome path has been loaded!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.chromeSettings();
                    };
                } catch(err) {
                    console.log(err)
                    await delay(9999);
                };
            case 'Replace Chrome Path':
                if (currentPath == chalk.red('Not found')) {
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.red('* There is no path to replace!'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    await this.chromeSettings();
                };
                console.clear();
                console.log(chalk.yellow(logo));
                console.log(chalk.yellow(`Chrome Path: ${currentPath}`));
                console.log(chalk.yellow('=='));
                userPath = await inquirer.prompt({ name: 'path', type: 'input', message: chalk.yellow(`Please enter your chrome path (${chalk.green('chrome://version')}):`) });
                if (!fs.existsSync(userPath.path)) {
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.red('* Path does not exist!'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    await this.chromeSettings();
                } else {
                    chromeData.Path.File = userPath.path;
                    fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`, JSON.stringify(chromeData, null, 4));
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.green('* Chrome path has been loaded!'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    await this.chromeSettings();
                };
            case 'Go Back':
                console.clear();
                await this.init();
            case 'Exit':
                console.clear();
                console.log(chalk.yellow(logo));
                console.log(chalk.yellow('* Exiting now...'));
                console.log(chalk.yellow('=='));
                await delay(2500);
                process.exit();
        };

    };

    // License settings
    async licenseSettings() {
        try {
            let userChoice;
            let licenseData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`);
            licenseData = JSON.parse(licenseData);
            let currentLicense = licenseData.License
            if (JSON.stringify(currentLicense) == '{}') { 
                currentLicense = chalk.red('Not found'); 
            } else {
                currentLicense = currentLicense.License.Key;
            };
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow(`* License: ${currentLicense}`));
            console.log(chalk.yellow('=='));
            userChoice = await inquirer.prompt(this.licenseMenu);
            switch (userChoice.options) {
                case 'Replace License':
                    licenseData = {
                        License: {}
                    };
                    fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`, JSON.stringify(licenseData, null, 4));
                    await this.auth();
                case 'Go Back':
                    console.clear();
                    await this.init();
                case 'Exit':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Exiting now...'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    process.exit();
            };
        } catch(err) {
            throw 'Error: License settings';
        }
    };

    // Email settings
    async emailSettings() {
        try {
            let userPath;
            let fileName;
            let userCatch;
            let userChoice;
            let catchArr = [];
            let customArr = [];
            let userEmails = [];
            let catchEmails = [];
            let catchData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`));
            let emailData = fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            if (catchData.length == 0) {
                catchArr = chalk.red('Not found');
            } else {
                for (const i of catchData) {
                    catchArr.push(i);
                };
            };
            if (emailData.length == 0) {
                customArr = chalk.red('Not found');
            } else {
                emailData.forEach(file => {
                    customArr.push(file.split('.')[0]);
                });
            };
            console.clear();
            console.log(chalk.yellow(logo));
            if (customArr == chalk.red('Not found')) console.log(chalk.yellow(`* Custom Emails: ${chalk.green(customArr)}`));
            if (customArr != chalk.red('Not found')) console.log(chalk.yellow(`* Custom Emails: ${chalk.green(customArr.join(', '))}`)); 
            if (catchArr == chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr)}`));
            if (catchArr != chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr.join(', '))}`));
            console.log(chalk.yellow('=='));
            userChoice = await inquirer.prompt(this.emailMenu);
            switch(userChoice.option) {
                case 'Catchall Settings':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    if (catchArr != chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr.join(', '))}`));
                    if (catchArr == chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr)}`));
                    console.log(chalk.yellow('=='));
                    userChoice = await inquirer.prompt(this.catchMenu);
                    switch (userChoice.option) {
                        case 'Load Catchall':
                            console.clear();
                            console.log(chalk.yellow(logo));
                            if (catchArr != chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr.join(', '))}`));
                            if (catchArr == chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr)}`));
                            console.log(chalk.yellow('=='));
                            userCatch = await inquirer.prompt({ name: 'domain', type: 'input', message: chalk.yellow(`Please enter your catchall domain (${chalk.green('@email.com')}) :`) });
                            if (!userCatch.domain.startsWith('@') || userCatch.domain == '' || userCatch.domain == ' ') {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* Invalid catchall domain!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            } else {
                                catchEmails.push(userCatch.domain.trim());
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(catchEmails, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green('* Catchall domain has been saved!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            };
                        case 'Remove Catchall':
                            if (catchData == chalk.red('Not found')) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* No catchalls to remove!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            } else {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                if (catchArr != chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr.join(', '))}`));
                                if (catchArr == chalk.red('Not found')) console.log(chalk.yellow(`* Catchall Domains: ${chalk.green(catchArr)}`));
                                console.log(chalk.yellow('=='));
                                userCatch = await inquirer.prompt({ name: 'domain', type: 'list', message: chalk.yellow('Please choose a catchall domain to remove:'), choices: catchArr });
                                let newArr = [];
                                catchData.forEach(domain => {
                                    if (!domain == userCatch.domain) {
                                        newArr.push(domain);
                                    };
                                });
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`, JSON.stringify(newArr, null, 4));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green('* Catchall domain has been remnoved!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            };
                        case 'Go Back':
                            console.clear();
                            await this.emailSettings();
                        case 'Exit':
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.yellow('* Exiting now...'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            process.exit();
                    };
                case 'Other Email Settings':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    if (customArr != chalk.red('Not found')) console.log(chalk.yellow(`* Custom Emails: ${chalk.green(customArr.join(', '))}`));
                    if (customArr == chalk.red('Not found')) console.log(chalk.yellow(`* Custom Emails: ${chalk.green(customArr)}`));
                    console.log(chalk.yellow('=='));
                    userChoice = await inquirer.prompt(this.customEmailMenu);
                    switch (userChoice.option) {
                        case 'Load Emails':
                            userChoice = await inquirer.prompt({ name: 'path', type: 'input', message: chalk.yellow('Please enter the path to your emails:') });
                            if (userChoice.path.startsWith('"')) { 
                                userPath = userChoice.path.split('"')[1];
                            } else {
                                userPath = userChoice.path;
                            };
                            if (!fs.existsSync(userPath)) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* Path does not exist!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            } else {
                                userChoice = await inquirer.prompt({ name: 'fileName', type: 'input', message: chalk.yellow('Please enter a name for your emails:') });
                                if (customArr.includes(userChoice.fileName)) {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* File name already exists!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.emailSettings();
                                };
                                fs.readFileSync(userPath).toString().split('\n').forEach(line => {
                                    if (line.trim() != undefined) {
                                        userEmails.push(line);
                                    };
                                });
                                fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails\\${userChoice.fileName}.txt`, userEmails.join('\n'));
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.green('* Emails loaded!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            };
                        case 'Remove Emails':
                            if (customArr == chalk.red('Not found')) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* There is no email file to remove!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.emailSettings();
                            };
                            userChoice = await inquirer.prompt({ name: 'fileName', type: 'list', message: chalk.yellow('Please enter a pick a file to remove:'), choices: customArr });
                            fs.unlinkSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails\\${userChoice.fileName}.txt`);
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* File has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.emailSettings();
                        case 'Go Back':
                            console.clear();
                            await this.emailSettings();
                        case 'Exit':
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.yellow('* Exiting now...'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            process.exit();
                    };
                case 'Go Back':
                    console.clear();
                    await this.init();
                case 'Exit':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Exiting now...'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    process.exit();
            };
        } catch(err) {
            console.log(err);
            await delay(9999);
            throw 'Error: Email settings';
        };
    };

    // Proxy Settings
    async proxySettings() {
        try {
            let userPath;
            let userFile;
            let userChoice;
            let newArr = [];
            let originalArr = [];
            let originalLower = [];
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`).forEach(file => {
                originalArr.push(file.split('.')[0]);
                originalLower.push(file.split('.')[0].toLowerCase());
            });
            if (originalArr.length == 0) {
                originalArr = chalk.red('Not found');
            };
            console.clear();
            console.log(chalk.yellow(logo));
            if (originalArr != chalk.red('Not found')) console.log(chalk.yellow(`* Proxies: ${originalArr.join(', ')}`));
            if (originalArr == chalk.red('Not found')) console.log(chalk.yellow(`* Proxies: ${originalArr}`));
            console.log(chalk.yellow('=='));
            userChoice = await inquirer.prompt(this.proxyMenu);
            switch (userChoice.option) {
                case 'Load Proxies':
                    userChoice = await inquirer.prompt({ name: 'fileName', type: 'input', message: chalk.yellow('Please enter a name for your proxy group:') });
                    if (originalLower.includes(userChoice.fileName.toLowerCase())) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* A proxy group with this name already exists!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.proxySettings();
                    } else {
                        userFile = userChoice.fileName;
                    }
                    userChoice = await inquirer.prompt({ name: 'path', type: 'input', message: chalk.yellow('Please enter your proxy file path:') });
                    if (userChoice.path.startsWith('"')) {
                        userPath = userChoice.path.split('"')[1];
                    } else {
                        userPath = userChoice.path;
                    };
                    if (!fs.existsSync(userPath)) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* Invalid path!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.proxySettings();
                    } else {
                        fs.readFileSync(userPath).toString().split('\n').forEach(line => {
                            if (line.trim() != undefined) {
                                newArr.push(line);
                            };
                        });
                        fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies\\${userFile}.txt`, newArr.join(', '));
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.green('* Proxies have been loaded!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.proxySettings();
                    };
                case 'Remove Proxies':
                    if (originalArr == 'Not found') {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There are no proxy groups to remove!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.proxySettings();
                    };
                    userChoice = await inquirer.prompt({ name: 'file', type: 'list', message: chalk.yellow('Please choose a proxy group to remove:'), choices: originalArr });
                    fs.unlinkSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies\\${userChoice.file}.txt`);
                    console.clear();
                    await console.log(chalk.yellow(logo));
                    console.log(chalk.green('* Proxy group has been removed!'));
                    console.log(chalk.yellow('=='));
                    await this.delay(2500);
                    await this.proxySettings();
                case 'Go Back':
                    console.clear();
                    await this.init();
                case 'Exit':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Exiting now...'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    process.exit();
            };
        } catch(err) {
            throw 'Error: Proxy settings';
        };
    };

    // Webhook Settings
    async webhookSettings() {
        try {
            let webData;
            let webFail;
            let userUrl;
            let webSuccess;
            let userChoice;
            webData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`));
            if (JSON.stringify(webData.Webhook.Success) == '{}') {
                webSuccess = chalk.red('Not found');
            }; 
            if (JSON.stringify(webData.Webhook.Failed) == '{}') {
                webFail = chalk.red('Not found');
            };
            if (JSON.stringify(webData.Webhook.Success) != '{}') {
                webSuccess = webData.Webhook.Success;
            };
            if (JSON.stringify(webData.Webhook.Failed) != '{}') {
                webFail = webData.Webhook.Failed;
            };
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow(`* Success Webhook: ${chalk.green(webSuccess)}`));
            console.log(chalk.yellow(`* Failed Webhook: ${chalk.green(webFail)}`));
            console.log(chalk.yellow('=='));
            userChoice = await inquirer.prompt(this.webChoices);
            switch (userChoice.option) {
                case 'Load Success Webhook':
                    if (webSuccess == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow(`* Success Webhook: ${webSuccess}`));
                        console.log(chalk.yellow('=='));
                        userChoice = await inquirer.prompt({ name: 'url', type: 'input', message: chalk.yellow('Please input your success webhook:') });
                        if (webFail == chalk.red('Not found')) {
                            webData = {
                                Webhook: {
                                    Success: userChoice.url.trim(),
                                    Failed: {}
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null , 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Success webhook loaded!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        } else {
                            webData = {
                                Webhook: {
                                    Success: userChoice.url.trim(),
                                    Failed: webData.Webhook.Failed
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null , 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Success webhook loaded!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        };
                    } else {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* You already have a success webhook uploaded!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    };
                case 'Load Failed Webhook':
                    if (webFail == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow(`* Failed Webhook: ${webFail}`));
                        console.log(chalk.yellow('=='));
                        userChoice = await inquirer.prompt({ name: 'url', type: 'input', message: chalk.yellow('Please input youe failed webhook:') });
                        if (webSuccess == chalk.red('Not found')) {
                            webData = {
                                Webhook: {
                                    Success: {},
                                    Failed: userChoice.url.trim()
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null , 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Failed webhook loaded!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        } else {
                            webData = {
                                Webhook: {
                                    Success: webData.Webhook.Success,
                                    Failed: userChoice.url.trim()
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null , 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Failed webhook loaded!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        };
                    } else {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* You already have a failed webhook uploaded!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    };
                case 'Remove Success Webhook':
                    if (webSuccess == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There is no success webhook to remove!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    } else {
                        if (webFail == chalk.red('Not found')) {
                            webData = {
                                Webhook: {
                                    Success: {},
                                    Failed: {}
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Success webhook has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        } else {
                            webData = {
                                Webhook: {
                                    Success: {},
                                    Failed: webData.Webhook.Failed
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Success webhook has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        };
                    };
                case 'Remove Failed Webhook':
                    if (webFail == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There is no failed webhook to remove!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    } else {
                        if (webSuccess == chalk.red('Not found')) {
                            webData = {
                                Webhook: {
                                    Success: {},
                                    Failed: {}
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Failed webhook has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        } else {
                            webData = {
                                Webhook: {
                                    Success: webData.Webhook.Success,
                                    Failed: {}
                                }
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`, JSON.stringify(webData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Failed webhook has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.webhookSettings();
                        };
                    };
                case 'Test Success Webhook':
                    if (webSuccess == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There is no success webook to test!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    } else {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* Testing success webhook...'));
                        console.log(chalk.yellow('=='));
                        let testSuccess = new Webhook(webSuccess.trim());
                        let embed = new MessageBuilder()
                            .setAuthor(`????Venom Gen Test????`)
                            .addField(`Status:`, 'Success!', false)
                            .setFooter(`Venom Gen`)
                            .setThumbnail(this.image)
                            .setTimestamp();
                        embed.setColor(`#fbff00`)
                        testSuccess.send(embed);
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.green('* Success webhook has been sent!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    };
                case 'Test Failed Webhook':
                    if (webFail == chalk.red('Not found')) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There is no failed webook to test!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    } else {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* Testing failed webhook...'));
                        console.log(chalk.yellow('=='));
                        let testSuccess = new Webhook(webSuccess.trim());
                        let embed = new MessageBuilder()
                            .setAuthor(`????Venom Gen Test????`)
                            .addField(`Status:`, 'Failed!', false)
                            .setFooter(`Venom Gen`)
                            .setThumbnail(this.image)
                            .setTimestamp();
                        embed.setColor(`#fbff00`)
                        testSuccess.send(embed);
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.green('* Failed webhook has been sent!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.webhookSettings();
                    };
                case 'Go Back':
                    console.clear();
                    await this.init();
                case 'Exit':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Exiting now...'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    process.exit();
            };
        } catch(err) {
            throw 'Error: Webhook settings';
        }
    };

    // Task Settings
    async taskSettings() {
        try {

            // Task variables
            let taskApi;
            let userTask;
            let taskName;
            let taskEmail;
            let emailType; // true = catchall, false = custom
            let taskProxy;
            let taskCatch = false;
            let taskCount;
            let sortedArr;
            let taskCountry;
            let tempArr = [];
            let taskArr = [];
            let proxyArr = [];
            let emailArr = [];
            let catchArr = [];
            let taskLower = [];
            let userChoice;
            let catchData;
            let smsKey;
            let fiveKey;
            let chromePath
    
            // Gather tasks 
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`).forEach((file) => {
                taskArr.push(file.split('.')[0]);
                taskLower.push(file.split('.')[0].toLowerCase());
            });
            if (taskArr.length == 0) {
                taskArr = false;
            };
    
            // Gather proxies
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`).forEach((file) => {
                proxyArr.push(file.split('.')[0]);
            });
            proxyArr.push('Local');
    
            // Gather custom emails
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`).forEach((file) => {
                emailArr.push(file.split('.')[0]);
            });
            if (emailArr.length == 0) {
                emailArr = false;
            };
    
            // Gather catch all emails
            catchData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`);
            JSON.parse(catchData).forEach(catchall => {
                catchArr.push(catchall)
            });
            if (catchArr = 'Not found') {
                catchArr = false;
            };

            // Intro screen
            console.clear();
            console.log(chalk.yellow(logo));
            if (taskArr == false) console.log(chalk.yellow(`* Tasks: ${chalk.red('Not found')}`));
            if (taskArr != false) console.log(chalk.yellow(`* Tasks: ${chalk.green(taskArr.join(', '))}`));
            console.log(chalk.yellow('=='));
            userChoice = await inquirer.prompt(this.taskMenu);
            switch (userChoice.option) {
                case 'Start Tasks':

                    // Check that user has tasks loaded
                    if (taskArr == false) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* There are no tasks to start!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.taskSettings();
                    };

                    // Check if webhooks are present if so assign them values
                    let webSuccess;
                    let webFailed;
                    let webData =  JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\webhook.json`));
                    if (JSON.stringify(webData.Webhook.Success) == '{}' || JSON.stringify(webData.Webhook.Failed) == '{}') {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* You need to have a success and failure webhook in order to run tasks!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.taskSettings();
                    } else {
                        webSuccess = webData.Webhook.Success;
                        webFailed = webData.Webhook.Failed;
                    };

                    // Check if chromePath exists and assign it
                    let chromeData =  JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Path\\chrome.json`));
                    if (JSON.stringify(chromeData.Path) == '{}') {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red('* You must have a chrome path loaded in order to run tasks!'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.taskSettings();
                    } else {
                        chromePath = chromeData.Path.File;
                    }

                    // Prompt user
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow(`* Tasks: ${chalk.green(taskArr.join(', '))}`));
                    console.log(chalk.yellow('=='));
                    userChoice = await inquirer.prompt({ name: 'task', type: 'list', message: chalk.yellow('Please choose a task to start:'), choices: taskArr });
                    userTask = userChoice.task;
                    let taskData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks\\${userTask}.json`));

                    // Ask user to pick a country based on api type
                    if (taskData.apiService == '5sim') {
                        let apiData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`));
                        fiveKey = apiData.Api['5sim'];
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* 5sim Country Selection'));
                        console.log(chalk.yellow('=='));
                        sortedArr = await this.fiveApi.getPricesStock();
                        if (sortedArr == 'Error: Get prices and stock') {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log( chalk.red('* There was an error while fetching prices and stock!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
                        sortedArr.forEach(element => {
                            tempArr.push(element.message);
                        });
                        userChoice = await inquirer.prompt({ name: 'region', type: 'list', message: chalk.yellow('Please choose a country for your numbers:'), choices: tempArr });
                        sortedArr.forEach(item => { 
                            if (item.message == userChoice.region) {
                                taskCountry = item.country;  
                            }; 
                        });
                    } else {
                        let apiData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\api.json`));
                        smsKey = apiData.Api.Sms;
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* Sms Activate Country Selection'));
                        console.log(chalk.yellow('=='));
                        sortedArr = await this.smsApi.getPricesStock(smsKey);
                        if (sortedArr == 'BAD_KEY') {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Invalid api key provided!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        } else if (sortedArr == 'ERROR_SQL') {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log( chalk.red('* There was an error while fetching prices and stock!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
                        sortedArr.forEach(element => {
                            tempArr.push(element.message);
                        });
                        userChoice = await inquirer.prompt({ name: 'country', type: 'list', message: chalk.yellow('Please choose a country for your numbers:'), choices: tempArr });
                        sortedArr.forEach(item => {
                            if (userChoice.country == item.message) {
                                taskCountry = item.id;
                            }
                        });

                    };
                    taskApi = taskData.apiService;

                    // Based on email type extract data
                    if (taskData.emailType == true) {
                        taskCatch = taskData.taskCatch;
                    } else {
                        let emailData = fs.readFileSync(taskData.emailFile);
                        emailData.toString().split('\n').forEach(email => {
                            if (email != undefined) {
                                emailArr.push(email);
                            };
                        });
                        if (emailArr.length == 0) {
                            console.clear();
                            console.log(chalk.yellow(logo))
                            console.log(chalk.red('* No emails seem to be loaded!'))
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
                    };

                    // Load proxies if any
                    if (taskData.taskProxy != 'Local') {
                        let proxyData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies\\${taskData.taskProxy}`);
                        proxydata.toString().split('\n').forEach(proxy => {
                            if (proxy != undefined) {
                                proxyArr.push(proxy);
                            };
                        });
                    } else {
                        proxyArr = 'Local';
                    };

                    // Determine if task count is even or odd
                    let isEven = false;
                    if (taskData.taskCount % 2 == 0) {
                        isEven = true;
                    };

                    // Handle task groups
                    taskCount = taskData.taskCount; 

                    // Empty temp arr
                    tempArr = [];

                    // Starting tasks message
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Starting tasks'));
                    console.log(chalk.yellow('=='));

                    // Set max listeners
                    await process.setMaxListeners(0);

                    // CATCH-ALL
                    if (taskData.emailType == true) {

                        // EVEN NUMBERS
                        if (isEven) {
                            let rounds = taskCount / 2;
                            for (let r = 0; r < rounds; r++) {
                                for (let i = 0; i < 2; i++) {
                                    if (taskData.apiservice == '5sim') {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(false, fiveKey, i, true, taskCatch, false, taskApi, taskCountry, webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    } else {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(false, smsKey, i, true, taskCatch, false, taskApi, taskCountry, webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    };
                                };
                                
                                // Execute promises
                                await Promise.all(tempArr);
                            };
                            await this.init();

                        // ODD NUMBERS
                        } else {
                            if (taskCount == 1) {
                                if (taskData.apiservice == '5sim') {
                                    tempArr.push(new Promise((resolve, reject) => {
                                        resolve(startTasks(false, fiveKey, 0, true, taskCatch, false, taskApi, taskCountry, webSuccess, webFailed, chromePath, proxyArr));
                                    }));
                                } else {
                                    tempArr.push(new Promise((resolve, reject) => {
                                        resolve(startTasks(false, smsKey, 0, true, taskCatch, false, taskApi, taskCountry, webSuccess, webFailed, chromePath, proxyArr));
                                    }));
                                };

                                // Execute promises
                                await Promise.all(tempArr);
                                await this.init();
                            };
                            let rounds = taskCount -= 1 / 2;
                            for (let r = 0; r < rounds; r ++) {
                                for (let i = 0; i < 2; i++) {
                                    if (taskData.apiservice == '5sim') {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(false, fiveKey, i, taskCatch, false, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    } else {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(false, smsKey, i, taskCatch, false, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    }; 
                                    if (r == rounds - 1) {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(false, smsKey, i, taskCatch, false, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    };
                                };

                                // Execute promises
                                await Promise.all(tempArr);
                            };
                            await this.init();
                        };

                    // CUSTOM EMAILS
                    } else {

                        // EVEN NUMBERS
                        if (isEven) {
                            let rounds = taskCount / 2;
                            for (let r = 0; r < rounds; r++) {
                                for (let i = 0; i < 2; i++) {
                                    if (taskData.apiservice == '5sim') {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(emailArr[i], fiveKey, i, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    } else {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(emailArr[i], smsKey, i, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    };
                                };

                                // Execute promises
                                await Promise.all(tempArr);
                            };
                            await this.init();

                        // ODD NUMBERS
                        } else {
                            if (taskCount == 1) {
                                tempArr.push(new Promise((resolve, reject) => { resolve(startTasks(emailArr[i], smsKey, 0, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr)); }));

                                // Execute promises
                                await Promise.all(tempArr);
                                await this.init();
                            };
                            let rounds = taskCount -= 1 / 2;
                            for (let r = 0; r < rounds; r ++) {
                                for (let i = 0; i < 2; i++) {
                                    if (taskData.apiservice == '5sim') {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(emailArr[i], fiveKey, i, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    } else {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(emailArr[i], smsKey, i, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    }; 
                                    if (r == rounds - 1) {
                                        tempArr.push(new Promise((resolve, reject) => {
                                            resolve(startTasks(emailArr[i], smsKey, i, false, taskData.emailFile, taskApi, taskCountry. webSuccess, webFailed, chromePath, proxyArr));
                                        }));
                                    };
                                };

                                // Execute promises
                                await Promise.all(tempArr);
                            };
                            await this.init();
                        };
                    };
                case 'Load Tasks':
                    try {
                        // Gather all tasks/proxies/email files (if any)
                        let proxyArr = [];
                        let emailArr = [];
                        let catchArr = [];
                        let hasCatch;
                        let hasEmail;
                        let hasSms;
                        let has5sim;
        
                        // Gather Proxy Count
                        fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`).forEach((file) => {
                            proxyArr.push(file.split('.')[0]);
                        });
                        proxyArr.push('Local');
        
                        // Gather email related data
                        await fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`).forEach(async file => {
                            emailArr.push(file.split('.')[0]);
                        });
                        if (emailArr.length != 0) {
                            hasEmail = true;
                        } else {
                            hasEmail = false;
                        };
                        let catchData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`);
                        if (JSON.parse(catchData).length != 0) {
                            hasCatch = true;
                            JSON.parse(catchData).forEach(domain => {
                                catchArr.push(domain);
                            });
                        } else {
                            hasCatch = false;
                        };
                        if (hasCatch == false && hasEmail == false) {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* No emails or catchalls can be found!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
        
                        // Check for api keys
                        let apiData = fs.readFileSync(`${process.env.APPDATA}\\VenoMGen\\Data\\Other\\api.json`);
                        let smsData = JSON.parse(apiData).Api.Sms;
                        let fiveData = JSON.parse(apiData).Api['5sim'];
                        if (JSON.stringify(fiveData) == '{}' && JSON.stringify(smsData) == '{}') {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* No api key can be found!'));
                            await delay(2500);
                            await this.taskSettings();
                        } else if (JSON.stringify(fiveData.Key) == '{}' && JSON.stringify(smsData.Key) == '{}') {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* No api key can be found!'));
                            await delay(2500);
                            await this.taskSettings();
                        };
                        if (JSON.stringify(smsData.Key) == '{}' || JSON.stringify(smsData) == '{}') {
                            hasSms = false;
                        };
                        if (JSON.stringify(fiveData.Key) == '{}' || JSON.stringify(fiveData) == '{}') {
                            has5sim = false;
                        };
        
        
                        // Intro page
                        if (taskArr != false) {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.yellow(`* Tasks: ${chalk.green(taskArr.join(', '))}`));
                            console.log(chalk.yellow('=='));
                        } else {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.yellow(`* Tasks: ${chalk.red('Not found')}`));
                            console.log(chalk.yellow('=='));
                        };
        
                        // Get task info
    
                        taskApi = await inquirer.prompt({ name: 'api', type: 'list', message: chalk.yellow('Please choose an api service:'), choices: [ '5sim', 'Sms Activate' ] });                    // Make sure user has the api key for chosen service
    
                        if (taskApi.api == '5sim') {
                            if (has5sim == false) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* You do not have a 5sim key loaded!'))
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.taskSettings();
                            };
                        } else {
                            if (hasSms == false) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* You do not have a Sms Activate key loaded!'))
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.taskSettings();
                            };
                        };

                        // Continue on
                        taskApi = taskApi.api;
                        taskName = await inquirer.prompt({ name: 'name', type: 'input', message: chalk.yellow('Please enter a name for this task:') });
                        if (taskLower.includes(taskName.name.toLowerCase())) {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* A task with this name already exists!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        } else {
                            taskName = taskName.name;
                        };
                        taskProxy = await inquirer.prompt({ name: 'proxy', type: 'list', message: chalk.yellow('Please choose a proxy group for your task:'), choices: proxyArr });
                        if (taskProxy.proxy != 'Local') {
                            taskProxy = taskProxy.proxy + '.txt';
                        };
                        emailType = await inquirer.prompt({ name: 'type', type: 'list', message: chalk.yellow('Please choose which email type you are using:'), choices: [ 'Catchall', 'Custom' ] });
                        if (emailType.type == 'Catchall') {
                            if (hasCatch != true) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* You have no catchalls loaded!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.taskSettings();
                            } else {  
                                emailType = true;
                                taskCatch = await inquirer.prompt({ name: 'domain', type: 'list', message: chalk.yellow('Please choose a catchall domain to use:'), choices: catchArr });
                                taskCatch = taskCatch.domain;
                                taskCount = await inquirer.prompt({ name: 'count', type: 'input', message: chalk.yellow(`Enter the amount of tasks you'd like:`),  });
                                taskCount = taskCount.count;
                            };
                        } else {
                            emailType = false;
                            if (hasEmail != true) {
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.red('* You have no emails loaded!'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                await this.taskSettings();
                            } else {
                                let limit = 0;
                                taskEmail = await inquirer.prompt({ name: 'email', type: 'list', message: chalk.yellow('Please choose an email group to use:'), choices: emailArr });
                                taskEmail = taskEmail + '.txt';
                                fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails\\${taskEmail}`).toString().split('\n').forEach(line => {
                                    if (line.trim() != undefined) {
                                        limit += 1;
                                    };
                                });
                                if (limit == 0) {
                                    console.clear();
                                    console.log(chalk.yellow(logo));
                                    console.log(chalk.red('* The file appears to be empty!'));
                                    console.log(chalk.yellow('=='));
                                    await delay(2500);
                                    await this.taskSettings();
                                } else {
                                    taskCount = await inquirer.prompt({ name: 'count', type: 'input', message: chalk.yellow(`Enter the amount of tasks you'd like (MAX TASKS: ${chalk.green(limit)}):`),  });
                                    if (taskCount.count > limit) {
                                        console.clear();
                                        console.log(chalk.yellow(logo));
                                        console.log(chalk.red(`* Task count cannot exceed ${chalk.green(limit)}!`));
                                        console.log(chalk.yellow('=='));
                                        await delay(2500);
                                        await this.taskSettings();
                                    } else {
                                        taskCount = taskCount.count;
                                    };
                                };
                            };
                        };
        
                        // Load task info
                        let taskData;
                        if (emailType != true) {
                            taskData = {
                                emailType: emailType,
                                emailFile: taskEmail,
                                taskCatch: false,
                                taskCount: taskCount,
                                taskProxy: taskProxy.proxy,
                                apiService: taskApi
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks\\${taskName}.json`, JSON.stringify(taskData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Tasks loaded successfully!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        } else {
                            taskData = {
                                emailType: emailType,
                                emailFile: false,
                                taskCatch: taskCatch,
                                taskCount: taskCount,
                                taskProxy: taskProxy.proxy,
                                apiService: taskApi
                            };
                            fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks\\${taskName}.json`, JSON.stringify(taskData, null, 4));
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Tasks loaded successfully!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
                    } catch(err) {
                        console.log(err);
                        await delay(9999);
                    };
                case 'Remove Tasks':
                    if (taskArr == false) {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.red(`* No tasks available to be removed!`));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        await this.taskSettings();
                    } else {
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow(`* Tasks: ${chalk.green(taskArr)}`));
                        console.log(chalk.yellow('=='));
                        userChoice = await inquirer.prompt({ name: 'task', type: 'list', message: chalk.yellow('Please choose a task to remove:'), choices: taskArr });
                        if (fs.existsSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks\\${userChoice.task}.json`)) {
                            fs.unlinkSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks\\${userChoice.task}.json`);
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.green('* Task has been removed!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        } else {
                            console.clear();
                            console.log(chalk.yellow(logo));
                            console.log(chalk.red('* Task cannot be found!'));
                            console.log(chalk.yellow('=='));
                            await delay(2500);
                            await this.taskSettings();
                        };
                    };
                case 'Go Back':
                    console.clear();
                    await this.init();
                case 'Exit':
                    console.clear();
                    console.log(chalk.yellow(logo));
                    console.log(chalk.yellow('* Exiting now...'));
                    console.log(chalk.yellow('=='));
                    await delay(2500);
                    process.exit();
            };
        } catch(err) {
            console.log(err)
            await delay(9999)
            throw 'Error: Task settings';
        };
    };

    // Init Cli
    async init() {
        try {

            // Start presence up
            this.discordPresence();
    
            // Setting up message
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow('* Please standby while venom gen is being set-up...'));
            console.log(chalk.yellow('=='));
    
            // Check if version is matching up
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow('* Checking for updates...'));
            console.log(chalk.yellow('=='));
            await this.versionControl();
            
            // Create all files
            await this.initFiles();
            
            // Auth user
            console.clear();
            await this.auth();

            // Gather stats
            console.clear();
            console.log(chalk.yellow(logo));
            console.log(chalk.yellow('* Loading stats...'));
            console.log(chalk.yellow('=='));

            // Gather user's statistics
            let taskCount = 0;
            let proxyCount = 0;
            let catchCount = 0;
            let emailCount = 0;
            let failedCount = 0;
            let accountCount = 0;
            
            // Gather Tasks 
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Tasks`).forEach((file) => {
                taskCount +=1
            });
            
            // Gather Proxy Count
            fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Proxies`).forEach((file) => {
                proxyCount +=1
            });

            // Gather other emails
            let emailData = await fs.readdirSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\Emails`);
            emailData.forEach(_ => {
                emailCount += 1;
            });

            // Gather Accounts Made
            let accountsMade = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`));
            accountsMade.Accounts.forEach(_ => {
                accountCount += 1;
            });
            
            // Gather non verified accounts
            let accountsFailed = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`));
            accountsFailed.Accounts.forEach(_ => {
                failedCount += 1;
            });

            // Gather catchalls
            let catchData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\catchall.json`);
            catchData = catchData.length;

            // Set title
            await setTitle(`Venom Gen v0.0.3 | Tasks: ${taskCount} | Proxies: ${proxyCount} | Emails: ${emailCount} | Catchalls: ${catchCount} | Accounts Created: ${accountCount} | Non-Verified: ${failedCount}`)

            // Let user choose
            let mainChoice;
            let moduleChoice;
            while (true) {
                console.clear();
                await this.greet();
                moduleChoice = await inquirer.prompt(this.moduleMenu);
                switch(moduleChoice.option) {
                    case 'Nike Generator':
                        console.clear();
                        await this.greet();
                        mainChoice = await inquirer.prompt(this.mainMenu);
                        switch (mainChoice.option) {
                            case 'Api Settings':
                                console.clear();
                                await this.apiSettings();
                            case 'Task Settings':
                                console.clear();
                                await this.taskSettings();
                                break;
                            case 'Chrome Settings':
                                console.clear();
                                await this.chromeSettings();
                            case 'License Settings':
                                console.clear();
                                await this.licenseSettings();
                            case 'Email Settings':
                                console.clear();
                                await this.emailSettings();
                            case 'Proxy Settings':
                                console.clear();
                                await this.proxySettings();
                            case 'Webhook Settings':
                                console.clear();
                                await this.webhookSettings();
                            case 'Exit':
                                console.clear();
                                console.log(chalk.yellow(logo));
                                console.log(chalk.yellow('* Exiting now...'));
                                console.log(chalk.yellow('=='));
                                await delay(2500);
                                process.exit();
                        };
                    case 'Exit':
                        console.clear();
                        console.log(chalk.yellow(logo));
                        console.log(chalk.yellow('* Exiting now...'));
                        console.log(chalk.yellow('=='));
                        await delay(2500);
                        process.exit();
                    default:
                        await this.init();
                };
            };

        } catch(err) {
            console.log(err);
        };

    };

};

// Init Cli
let cli = new CommandLineInterface();
cli.init();