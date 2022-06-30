const chalk = require('chalk');
const delay = require('delay');
const fetch = require('node-fetch');

class SmsApi {

    constructor() {
        this.errorArr = ['BAD_KEY', 'ERROR_SQL', 'NO_BALANCE', 'BAD_SERVICE', 'NO_BALANCE_FORWARD', 'NOT_AVAILABLE', 'NO_NUMBERS'];
        this.service = 'ew';
        this.countries = {
            "0":{
                "id":0,
                "rus":"Россия",
                "eng":"Russia",
            },
            "1":{
                "id":1,
                "rus":"Украина",
                "eng":"Ukraine",
            },
            "2":{
                "id":2,
                "rus":"Казахстан",
                "eng":"Kazakhstan",
            },
            "3":{
                "id":3,
                "rus":"Китай",
                "eng":"China",
            },
            "4":{
                "id":4,
                "rus":"Филиппины",
                "eng":"Philippines",
            },
            "5":{
                "id":5,
                "rus":"Мьянма",
                "eng":"Myanmar",
            },
            "6":{
                "id":6,
                "rus":"Индонезия",
                "eng":"Indonesia",
            },
            "7":{
                "id":7,
                "rus":"Малайзия",
                "eng":"Malaysia",
            },
            "8":{
                "id":8,
                "rus":"Кения",
                "eng":"Kenya",
            },
            "9":{
                "id":9,
                "rus":"Танзания",
                "eng":"Tanzania",
            },
            "10":{
                "id":10,
                "rus":"Вьетнам",
                "eng":"Vietnam",
            },
            "11":{
                "id":11,
                "rus":"Кыргызстан",
                "eng":"Kyrgyzstan",
            },
            "12":{
                "id":12,
                "rus":"США (виртуальные)",
                "eng":"USA (virtual)",
            },
            "13":{
                "id":13,
                "rus":"Израиль",
                "eng":"Israel",
            },
            "14":{
                "id":14,
                "rus":"Гонконг",
                "eng":"HongKong",
            },
            "15":{
                "id":15,
                "rus":"Польша",
                "eng":"Poland",
            },
            "16":{
                "id":16,
                "rus":"Англия",
                "eng":"England",
            },
            "17":{
                "id":17,
                "rus":"Мадагаскар",
                "eng":"Madagascar",
            },
            "18":{
                "id":18,
                "rus":"Дем. Конго",
                "eng":"DCongo",
            },
            "19":{
                "id":19,
                "rus":"Нигерия",
                "eng":"Nigeria",
            },
            "20":{
                "id":20,
                "rus":"Макао",
                "eng":"Macao",
            },
            "21":{
                "id":21,
                "rus":"Египет",
                "eng":"Egypt",
            },
            "22":{
                "id":22,
                "rus":"Индия",
                "eng":"India",
            },
            "23":{
                "id":23,
                "rus":"Ирландия",
                "eng":"Ireland",
            },
            "24":{
                "id":24,
                "rus":"Камбоджа",
                "eng":"Cambodia",
            },
            "25":{
                "id":25,
                "rus":"Лаос",
                "eng":"Laos",
            },
            "26":{
                "id":26,
                "rus":"Гаити",
                "eng":"Haiti",
            },
            "27":{
                "id":27,
                "rus":"Кот д'Ивуар",
                "eng":"Ivory",
            },
            "28":{
                "id":28,
                "rus":"Гамбия",
                "eng":"Gambia",
            },
            "29":{
                "id":29,
                "rus":"Сербия",
                "eng":"Serbia",
            },
            "30":{
                "id":30,
                "rus":"Йемен",
                "eng":"Yemen",
            },
            "31":{
                "id":31,
                "rus":"ЮАР",
                "eng":"Southafrica",
            },
            "32":{
                "id":32,
                "rus":"Румыния",
                "eng":"Romania",
            },
            "33":{
                "id":33,
                "rus":"Колумбия",
                "eng":"Colombia",
            },
            "34":{
                "id":34,
                "rus":"Эстония",
                "eng":"Estonia",
            },
            "35":{
                "id":35,
                "rus":"Азербайджан",
                "eng":"Azerbaijan",
            },
            "36":{
                "id":36,
                "rus":"Канада",
                "eng":"Canada",
            },
            "37":{
                "id":37,
                "rus":"Марокко",
                "eng":"Morocco",
            },
            "38":{
                "id":38,
                "rus":"Гана",
                "eng":"Ghana",
            },
            "39":{
                "id":39,
                "rus":"Аргентина",
                "eng":"Argentina",
            },
            "40":{
                "id":40,
                "rus":"Узбекистан",
                "eng":"Uzbekistan",
            },
            "41":{
                "id":41,
                "rus":"Камерун",
                "eng":"Cameroon",
            },
            "42":{
                "id":42,
                "rus":"Чад",
                "eng":"Chad",
            },
            "43":{
                "id":43,
                "rus":"Германия",
                "eng":"Germany",
            },
            "44":{
                "id":44,
                "rus":"Литва",
                "eng":"Lithuania",
            },
            "45":{
                "id":45,
                "rus":"Хорватия",
                "eng":"Croatia",
            },
            "46":{
                "id":46,
                "rus":"Швеция",
                "eng":"Sweden",
            },
            "47":{
                "id":47,
                "rus":"Ирак",
                "eng":"Iraq",
            },
            "48":{
                "id":48,
                "rus":"Нидерланды",
                "eng":"Netherlands",
            },
            "49":{
                "id":49,
                "rus":"Латвия",
                "eng":"Latvia",
            },
            "50":{
                "id":50,
                "rus":"Австрия",
                "eng":"Austria",
            },
            "51":{
                "id":51,
                "rus":"Беларусь",
                "eng":"Belarus",
            },
            "52":{
                "id":52,
                "rus":"Таиланд",
                "eng":"Thailand",
            },
            "53":{
                "id":53,
                "rus":"Сауд. Аравия",
                "eng":"Saudiarabia",
            },
            "54":{
                "id":54,
                "rus":"Мексика",
                "eng":"Mexico",
            },
            "55":{
                "id":55,
                "rus":"Тайвань",
                "eng":"Taiwan",
            },
            "56":{
                "id":56,
                "rus":"Испания",
                "eng":"Spain",
            },
            "57":{
                "id":57,
                "rus":"Иран",
                "eng":"Iran",
            },
            "58":{
                "id":58,
                "rus":"Алжир",
                "eng":"Algeria",
            },
            "59":{
                "id":59,
                "rus":"Словения",
                "eng":"Slovenia",
            },
            "60":{
                "id":60,
                "rus":"Бангладеш",
                "eng":"Bangladesh",
            },
            "61":{
                "id":61,
                "rus":"Сенегал",
                "eng":"Senegal",
            },
            "62":{
                "id":62,
                "rus":"Турция",
                "eng":"Turkey",
            },
            "63":{
                "id":63,
                "rus":"Чехия",
                "eng":"Czech",
            },
            "64":{
                "id":64,
                "rus":"Шри-Ланка",
                "eng":"Srilanka",
            },
            "65":{
                "id":65,
                "rus":"Перу",
                "eng":"Peru",
            },
            "66":{
                "id":66,
                "rus":"Пакистан",
                "eng":"Pakistan",
            },
            "67":{
                "id":67,
                "rus":"Новая Зеландия",
                "eng":"Newzealand",
            },
            "68":{
                "id":68,
                "rus":"Гвинея",
                "eng":"Guinea",
            },
            "69":{
                "id":69,
                "rus":"Мали",
                "eng":"Mali",
            },
            "70":{
                "id":70,
                "rus":"Венесуэла",
                "eng":"Venezuela",
            },
            "71":{
                "id":71,
                "rus":"Эфиопия",
                "eng":"Ethiopia",
            },
            "72":{
                "id":72,
                "rus":"Монголия",
                "eng":"Mongolia",
            },
            "73":{
                "id":73,
                "rus":"Бразилия",
                "eng":"Brazil",
            },
            "74":{
                "id":74,
                "rus":"Афганистан",
                "eng":"Afghanistan",
            },
            "75":{
                "id":75,
                "rus":"Уганда",
                "eng":"Uganda",
            },
            "76":{
                "id":76,
                "rus":"Ангола",
                "eng":"Angola",
            },
            "77":{
                "id":77,
                "rus":"Кипр",
                "eng":"Cyprus",
            },
            "78":{
                "id":78,
                "rus":"Франция",
                "eng":"France",
            },
            "79":{
                "id":79,
                "rus":"Папуа-Новая Гвинея",
                "eng":"Papua",
            },
            "80":{
                "id":80,
                "rus":"Мозамбик",
                "eng":"Mozambique",
            },
            "81":{
                "id":81,
                "rus":"Непал",
                "eng":"Nepal",
            },
            "82":{
                "id":82,
                "rus":"Бельгия",
                "eng":"Belgium",
            },
            "83":{
                "id":83,
                "rus":"Болгария",
                "eng":"Bulgaria",
            },
            "84":{
                "id":84,
                "rus":"Венгрия",
                "eng":"Hungary",
            },
            "85":{
                "id":85,
                "rus":"Молдова",
                "eng":"Moldova",
            },
            "86":{
                "id":86,
                "rus":"Италия",
                "eng":"Italy",
            },
            "87":{
                "id":87,
                "rus":"Парагвай",
                "eng":"Paraguay",
            },
            "88":{
                "id":88,
                "rus":"Гондурас",
                "eng":"Honduras",
            },
            "89":{
                "id":89,
                "rus":"Тунис",
                "eng":"Tunisia",
            },
            "90":{
                "id":90,
                "rus":"Никарагуа",
                "eng":"Nicaragua",
            },
            "91":{
                "id":91,
                "rus":"Тимор-Лесте",
                "eng":"Timorleste",
            },
            "92":{
                "id":92,
                "rus":"Боливия",
                "eng":"Bolivia",
            },
            "93":{
                "id":93,
                "rus":"Коста Рика",
                "eng":"Costarica",
            },
            "94":{
                "id":94,
                "rus":"Гватемала",
                "eng":"Guatemala",
            },
            "95":{
                "id":95,
                "rus":"ОАЭ",
                "eng":"Uae",
            },
            "96":{
                "id":96,
                "rus":"Зимбабве",
                "eng":"Zimbabwe",
            },
            "97":{
                "id":97,
                "rus":"Пуэрто-Рико",
                "eng":"Puertorico",
            },
            "98":{
                "id":98,
                "rus":"Судан",
                "eng":"Sudan",
            },
            "99":{
                "id":99,
                "rus":"Того",
                "eng":"Togo",
            },
            "100":{
                "id":100,
                "rus":"Кувейт",
                "eng":"Kuwait",
            },
            "101":{
                "id":101,
                "rus":"Сальвадор",
                "eng":"Salvador",
            },
            "102":{
                "id":102,
                "rus":"Ливия",
                "eng":"Libyan",
            },
            "103":{
                "id":103,
                "rus":"Ямайка",
                "eng":"Jamaica",
            },
            "104":{
                "id":104,
                "rus":"Тринидад и Тобаго",
                "eng":"Trinidad",
            },
            "105":{
                "id":105,
                "rus":"Эквадор",
                "eng":"Ecuador",
            },
            "106":{
                "id":106,
                "rus":"Свазиленд",
                "eng":"Swaziland",
            },
            "107":{
                "id":107,
                "rus":"Оман",
                "eng":"Oman",
            },
            "108":{
                "id":108,
                "rus":"Босния и Герцеговина",
                "eng":"Bosnia",
            },
            "109":{
                "id":109,
                "rus":"Доминиканская Республика",
                "eng":"Dominican",
            },
            "110":{
                "id":110,
                "rus":"Сирия",
                "eng":"Syrian",
            },
            "111":{
                "id":111,
                "rus":"Катар",
                "eng":"Qatar",
            },
            "112":{
                "id":112,
                "rus":"Панама",
                "eng":"Panama",
            },
            "113":{
                "id":113,
                "rus":"Куба",
                "eng":"Cuba",
            },
            "114":{
                "id":114,
                "rus":"Мавритания",
                "eng":"Mauritania",
            },
            "115":{
                "id":115,
                "rus":"Сьерра-Леоне",
                "eng":"Sierraleone",
            },
            "116":{
                "id":116,
                "rus":"Иордания",
                "eng":"Jordan",
            },
            "117":{
                "id":117,
                "rus":"Португалия",
                "eng":"Portugal",
            },
            "118":{
                "id":118,
                "rus":"Барбадос",
                "eng":"Barbados",
            },
            "119":{
                "id":119,
                "rus":"Бурунди",
                "eng":"Burundi",
            },
            "120":{
                "id":120,
                "rus":"Бенин",
                "eng":"Benin",
            },
            "121":{
                "id":121,
                "rus":"Бруней",
                "eng":"Brunei",
            },
            "122":{
                "id":122,
                "rus":"Багамы",
                "eng":"Bahamas",
            },
            "123":{
                "id":123,
                "rus":"Ботсвана",
                "eng":"Botswana",
            },
            "124":{
                "id":124,
                "rus":"Белиз",
                "eng":"Belize",
            },
            "125":{
                "id":125,
                "rus":"ЦАР",
                "eng":"Caf",
            },
            "126":{
                "id":126,
                "rus":"Доминика",
                "eng":"Dominica",
            },
            "127":{
                "id":127,
                "rus":"Гренада",
                "eng":"Grenada",
            },
            "128":{
                "id":128,
                "rus":"Грузия",
                "eng":"Georgia",
            },
            "129":{
                "id":129,
                "rus":"Греция",
                "eng":"Greece",
            },
            "130":{
                "id":130,
                "rus":"Гвинея-Бисау",
                "eng":"Guineabissau",
            },
            "131":{
                "id":131,
                "rus":"Гайана",
                "eng":"Guyana",
            },
            "132":{
                "id":132,
                "rus":"Исландия",
                "eng":"Iceland",
            },
            "133":{
                "id":133,
                "rus":"Коморы",
                "eng":"Comoros",
            },
            "134":{
                "id":134,
                "rus":"Сент-Китс и Невис",
                "eng":"Saintkitts",
            },
            "135":{
                "id":135,
                "rus":"Либерия",
                "eng":"Liberia",
            },
            "136":{
                "id":136,
                "rus":"Лесото",
                "eng":"Lesotho",
            },
            "137":{
                "id":137,
                "rus":"Малави",
                "eng":"Malawi",
            },
            "138":{
                "id":138,
                "rus":"Намибия",
                "eng":"Namibia",
            },
            "139":{
                "id":139,
                "rus":"Нигер",
                "eng":"Niger",
            },
            "140":{
                "id":140,
                "rus":"Руанда",
                "eng":"Rwanda",
            },
            "141":{
                "id":141,
                "rus":"Словакия",
                "eng":"Slovakia",
            },
            "142":{
                "id":142,
                "rus":"Суринам",
                "eng":"Suriname",
            },
            "143":{
                "id":143,
                "rus":"Таджикистан",
                "eng":"Tajikistan",
            },
            "144":{
                "id":144,
                "rus":"Монако",
                "eng":"Monaco",
            },
            "145":{
                "id":145,
                "rus":"Бахрейн",
                "eng":"Bahrain",
            },
            "146":{
                "id":146,
                "rus":"Реюньон",
                "eng":"Reunion",
            },
            "147":{
                "id":147,
                "rus":"Замбия",
                "eng":"Zambia",
            },
            "148":{
                "id":148,
                "rus":"Армения",
                "eng":"Armenia",
            },
            "149":{
                "id":149,
                "rus":"Сомали",
                "eng":"Somalia",
            },
            "150":{
                "id":150,
                "rus":"Конго",
                "eng":"Congo",
            },
            "151":{
                "id":151,
                "rus":"Чили",
                "eng":"Chile",
            },
            "152":{
                "id":152,
                "rus":"Буркина-Фасо",
                "eng":"Furkinafaso",
            },
            "153":{
                "id":153,
                "rus":"Ливан",
                "eng":"Lebanon",
            },
            "154":{
                "id":154,
                "rus":"Габон",
                "eng":"Gabon",
            },
            "155":{
                "id":155,
                "rus":"Албания",
                "eng":"Albania",
            },
            "156":{
                "id":156,
                "rus":"Уругвай",
                "eng":"Uruguay",
            },
            "157":{
                "id":157,
                "rus":"Маврикий",
                "eng":"Mauritius",
            },
            "158":{
                "id":158,
                "rus":"Бутан",
                "eng":"Bhutan",
            },
            "159":{
                "id":159,
                "rus":"Мальдивы",
                "eng":"Maldives",
            },
            "160":{
                "id":160,
                "rus":"Гваделупа",
                "eng":"Guadeloupe",
            },
            "161":{
                "id":161,
                "rus":"Туркменистан",
                "eng":"Turkmenistan",
            },
            "162":{
                "id":162,
                "rus":"Французская Гвиана",
                "eng":"Frenchguiana",
            },
            "163":{
                "id":163,
                "rus":"Финляндия",
                "eng":"Finland",
            },
            "164":{
                "id":164,
                "rus":"Сент-Люсия",
                "eng":"Saintlucia",
            },
            "165":{
                "id":165,
                "rus":"Люксембург",
                "eng":"Luxembourg",
            },
            "166":{
                "id":166,
                "rus":"Сент-Винсент и Гренадин",
                "eng":"Saintvincentgrenadines",
            },
            "167":{
                "id":167,
                "rus":"Экваториальная Гвинея",
                "eng":"Equatorialguinea",
            },
            "168":{
                "id":168,
                "rus":"Джибути",
                "eng":"Djibouti",
            },
            "169":{
                "id":169,
                "rus":"Антигуа и Барбуда",
                "eng":"Antiguabarbuda",
            },
            "170":{
                "id":170,
                "rus":"Острова Кайман",
                "eng":"Caymanislands",
            },
            "171":{
                "id":171,
                "rus":"Черногория",
                "eng":"Montenegro",
            },
            "172":{
                "id":172,
                "rus":"Дания",
                "eng":"Denmark",
            },
            "173":{
                "id":173,
                "rus":"Швейцария",
                "eng":"Switzerland",
            },
            "174":{
                "id":174,
                "rus":"Норвегия",
                "eng":"Norway",
            },
            "175":{
                "id":175,
                "rus":"Австралия",
                "eng":"Australia",
            },
            "176":{
                "id":176,
                "rus":"Эритрея",
                "eng":"Eritrea",
            },
            "177":{
                "id":177,
                "rus":"Южный Судан",
                "eng":"Southsudan",
            },
            "178":{
                "id":178,
                "rus":"Сан-Томе и Принсипи",
                "eng":"Saotomeandprincipe",
            },
            "179":{
                "id":179,
                "rus":"Аруба",
                "eng":"Aruba",
            },
            "180":{
                "id":180,
                "rus":"Монтсеррат",
                "eng":"Montserrat",
            },
            "181":{
                "id":181,
                "rus":"Ангилья",
                "eng":"Anguilla",
            },
            "182":{
                "id":182,
                "rus":"Япония",
                "eng":"Japan",
            },
            "183":{
                "id":183,
                "rus":"Северная Македония",
                "eng":"Northmacedonia",
            },
            "184":{
                "id":184,
                "rus":"Республика Сейшелы",
                "eng":"Seychelles",
            },
            "185":{
                "id":185,
                "rus":"Новая Каледония",
                "eng":"Newcaledonia",
            },
            "186":{
                "id":186,
                "rus":"Кабо-Верде",
                "eng":"Capeverde",
            },
            "187":{
                "id":187,
                "rus":"США",
                "eng":"USA",
            },
            "188":{
                "id":188,
                "rus":"Палестина",
                "eng":"Palestine",
            },
            "189":{
                "id":189,
                "rus":"Фиджи",
                "eng":"Fiji",
            },
            "190":{
                "id":190,
                "rus":"Южная Корея",
                "eng":"Southkorea",
            },
            "191":{
                "id":191,
                "rus":"Северная Корея",
                "eng":"Northkorea",
            },
            "192":{
                "id":192,
                "rus":"Западная Сахара",
                "eng":"Westernsahara",
            },
            "193":{
                "id":193,
                "rus":"Соломоновы острова",
                "eng":"Solomonislands",
            },
            "194":{
                "id":194,
                "rus":"Джерси",
                "eng":"Jersey",
            },
            "195":{
                "id":195,
                "rus":"Бермуды",
                "eng":"Bermuda",
            },
            "196":{
                "id":196,
                "rus":"Сингапур",
                "eng":"Singapore",
            },
            "197":{
                "id":197,
                "rus":"Тонга",
                "eng":"Tonga",
            },
            "198":{
                "id":198,
                "rus":"Самоа",
                "eng":"Samoa",
            },
            "199":{
                "id":199,
                "rus":"Мальта",
                "eng":"Malta",
            }
        };
        this.nikeCountries = [
            'United Arab Emirates',        
            'Austria',        
            'Australia',        
            'Belgium',        
            'Bulgaria',        
            'Canada',        
            'Switzerland',        
            'Chile',        
            'Czech Republic',        
            'Germany',        
            'Denmark',        
            'Egypt',        
            'Spain',     
            'Finland',        
            'France',        
            'United Kingdom',        
            'Greece',        
            'Croatia',        
            'Hungary',        
            'Indonesia',        
            'Ireland',        
            'Israel',        
            'India',        
            'Italy',        
            'Japan',        
            'Luxembourg',        
            'Morocco',        
            'Mexico',        
            'Malaysia',        
            'Netherlands',        
            'Norway',        
            'New Zealand',      
            'Philippines',        
            'Poland',        
            'Puerto Rico',        
            'Portugal',        
            'Romania',        
            'Russia',        
            'Saudi Arabia',        
            'Sweden',        
            'Singapore',        
            'Slovenia',        
            'Slovakia',        
            'Thailand',        
            'Turkey',        
            'Taiwan',        
            'United States',        
            'Vietnam',
            'South Africa'
        ];
    };

    async checkBalance(apiKey) {
        let resp = await fetch(`https://sms-activate.ru/stubs/handler_api.php?api_key=${apiKey}&action=getBalance`)
        let data = await resp.text();
        switch (data) {
            // BAD_KEY
            case this.errorArr[0]:
                return this.errorArr[0]
            // ERROR_SQL
            case this.errorArr[1]:
                return this.errorArr[1];
            // Create array and return
            default:
                return data.toString().split(':')[1];
        };
    };

    async orderNumber(apiKey, country) {
        let endpoint = `https://sms-activate.ru/stubs/handler_api.php?api_key=${apiKey}&action=getNumber&service=${this.service}&country=${country}`;
        let resp = await fetch(endpoint);
        let data = await resp.text();
        switch (data) {
            // BAD_KEY
            case this.errorArr[0]:
                return this.errorArr[0]
            // ERROR_SQL
            case this.errorArr[1]:
                return this.errorArr[1];
            // NO_BALANCE
            case this.errorArr[2]:
                return this.errorArr[2];
            // BAD_SERVICE
            case this.errorArr[3]:
                return this.errorArr[3];
            // NO_BALANCE_FORWARD
            case this.errorArr[4]:
                return this.errorArr[4];
            // NOT_AVAILABLE (Aka Sold Out)
            case this.errorArr[5]:
                return this.errorArr[5]
            case this.errorArr[6]:
                return this.errorArr[6]
            // Return data with no spaces
            default:
                return data.trim();
        };
    };

    async getPricesStock(apiKey) {
        let jsonData;
        let sortedArr = [];
        let getStock = `https://sms-activate.ru/stubs/handler_api.php?api_key=${apiKey}&action=getPrices&service=${this.service}`;
        let resp = await fetch(getStock);
        let data = await resp.text();
        switch (data) {
            // BAD_KEY
            case this.errorArr[0]:
                return this.errorArr[0]
            // ERROR_SQL
            case this.errorArr[1]:
                return this.errorArr[1];
            // Create array and return
            default:
                jsonData = JSON.parse(data);
                Object.keys(jsonData).forEach(id => {
                    if (JSON.stringify(jsonData[id]) != '{}') {
                        if (jsonData[id].ew.count != 0) {
                            sortedArr.push({
                                id: id,
                                message: chalk.yellow(`Country: ${chalk.green(this.countries[id].eng)} Price: ${chalk.green(jsonData[id].ew.cost)} Stock: ${chalk.green(jsonData[id].ew.count)}`)
                            });
                        };
                    };
                });
                return sortedArr;
        };
    };

    async waitForText(apiKey, act) {
        let getText = `https://sms-activate.ru/stubs/handler_api.php?api_key=${apiKey}&action=getFullSms&id=${act}`;
        let resp = await fetch(getText);
        let msg = await resp.text();
        return msg;
    };

};

module.exports = SmsApi;