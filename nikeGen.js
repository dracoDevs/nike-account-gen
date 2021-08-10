const fs = require(`fs`);
const aes = require('aes-js');
const chalk = require(`chalk`);
const delay = require(`delay`);
const Crypto = require(`crypto`);
const fiveApi = require('./5sim');
const smsApi = require('./smsActivate');
const ghost = require(`ghost-cursor`);
const UserAgent = require('user-agents');
const puppeteerVanilla = require('puppeteer');
const { addExtra } = require('puppeteer-extra');
const { Webhook, MessageBuilder } = require(`discord-webhook-node`);
const SourceUrl = require('puppeteer-extra-plugin-stealth/evasions/sourceurl');

class NikeGen {

    constructor(email, apiKey, taskNum, emailType, catchAll, emailFile, apiService, taskCountry, userHookSuccess, userHookFailed, chromePath, proxyArr) {
        this.email = email;
        this.apiKey = apiKey;
        this.taskNum = taskNum;
        this.catchAll = catchAll;
        this.proxyArr = proxyArr;
        this.emailType = emailType;
        this.emailFile = emailFile;
        this.apiService = apiService;
        this.chromePath = chromePath;
        this.taskCountry = taskCountry;
        this.countNames = {
            0: 'Russia',
            1: 'Ukraine',
            2: 'Kazakhstan',
            3: 'China',
            4: 'Philippines',
            5: 'Myanmar',
            6: 'Indonesia',
            7: 'Malaysia',
            8: 'Kenya',
            9: 'Tanzania',
            10: 'Vietnam',
            11: 'Kyrgyzstan',
            12: 'USA (virtual)',
            13: 'Israel',
            14: 'HongKong',
            15: 'Poland',
            16: 'England',
            18: 'DCongo',
            19: 'Nigeria',
            20: 'Macao',
            21: 'Egypt',
            22: 'India',
            23: 'Ireland',
            24: 'Cambodia',
            25: 'Laos',
            26: 'Haiti',
            27: 'Ivory',
            28: 'Gambia',
            29: 'Serbia',
            30: 'Yemen',
            31: 'Southafrica',
            32: 'Romania',
            33: 'Colombia',
            34: 'Estonia',
            36: 'Canada',
            37: 'Morocco',
            38: 'Ghana',
            39: 'Argentina',
            40: 'Uzbekistan',
            41: 'Cameroon',
            42: 'Chad',
            43: 'Germany',
            44: 'Lithuania',
            45: 'Croatia',
            46: 'Sweden',
            47: 'Iraq',
            48: 'Netherlands',
            49: 'Latvia',
            50: 'Austria',
            51: 'Belarus',
            52: 'Thailand',
            53: 'Saudiarabia',
            54: 'Mexico',
            55: 'Taiwan',
            56: 'Spain',
            58: 'Algeria',
            59: 'Slovenia',
            60: 'Bangladesh',
            61: 'Senegal',
            62: 'Turkey',
            63: 'Czech',
            64: 'Srilanka',
            65: 'Peru',
            66: 'Pakistan',
            67: 'Newzealand',
            68: 'Guinea',
            69: 'Mali',
            70: 'Venezuela',
            71: 'Ethiopia',
            72: 'Mongolia',
            73: 'Brazil',
            74: 'Afghanistan',
            75: 'Uganda',
            76: 'Angola',
            77: 'Cyprus',
            78: 'France',
            79: 'Papua',
            80: 'Mozambique',
            81: 'Nepal',
            82: 'Belgium',
            83: 'Bulgaria',
            84: 'Hungary',
            85: 'Moldova',
            86: 'Italy',
            87: 'Paraguay',
            88: 'Honduras',
            89: 'Tunisia',
            90: 'Nicaragua',
            91: 'Timorleste',
            92: 'Bolivia',
            93: 'Costarica',
            94: 'Guatemala',
            95: 'Uae',
            96: 'Zimbabwe',
            97: 'Puertorico',
            99: 'Togo',
            100: 'Kuwait',
            101: 'Salvador',
            102: 'Libyan',
            103: 'Jamaica',
            104: 'Trinidad',
            105: 'Ecuador',
            106: 'Swaziland',
            107: 'Oman',
            108: 'Bosnia',
            109: 'Dominican',
            111: 'Qatar',
            112: 'Panama',
            114: 'Mauritania',
            115: 'Sierraleone',
            116: 'Jordan',
            117: 'Portugal',
            118: 'Barbados',
            119: 'Burundi',
            120: 'Benin',
            121: 'Brunei',
            122: 'Bahamas',
            123: 'Botswana',
            124: 'Belize',
            125: 'Caf',
            126: 'Dominica',
            127: 'Grenada',
            128: 'Georgia',
            129: 'Greece',
            130: 'Guineabissau',
            131: 'Guyana',
            132: 'Iceland',
            133: 'Comoros',
            134: 'Saintkitts',
            135: 'Liberia',
            136: 'Lesotho',
            137: 'Malawi',
            138: 'Namibia',
            139: 'Niger',
            140: 'Rwanda',
            141: 'Slovakia',
            142: 'Suriname',
            143: 'Tajikistan',
            144: 'Monaco',
            145: 'Bahrain',
            146: 'Reunion',
            147: 'Zambia',
            148: 'Armenia',
            149: 'Somalia',
            150: 'Congo',
            151: 'Chile',
            152: 'Furkinafaso',
            153: 'Lebanon',
            154: 'Gabon',
            155: 'Albania',
            156: 'Uruguay',
            157: 'Mauritius',
            158: 'Bhutan',
            159: 'Maldives',
            160: 'Guadeloupe',
            161: 'Turkmenistan',
            162: 'Frenchguiana',
            163: 'Finland',
            164: 'Saintlucia',
            165: 'Luxembourg',
            166: 'Saintvincentgrenadines',
            167: 'Equatorialguinea',
            168: 'Djibouti',
            169: 'Antiguabarbuda',
            170: 'Caymanislands',
            171: 'Montenegro',
            173: 'Switzerland',
            174: 'Norway',
            175: 'Australia',
            176: 'Eritrea',
            177: 'Southsudan',
            178: 'Saotomeandprincipe',
            179: 'Aruba',
            180: 'Montserrat',
            181: 'Anguilla',
            183: 'Northmacedonia',
            184: 'Seychelles',
            185: 'Newcaledonia',
            186: 'Capeverde',
            187: 'USA',
            190: 'Southkorea'
        }
        this.nikeCountries = {
            'value="AE"|United Arab Emirates': 971,        
            'value="AT"|Austria': 43,        
            'value="AU"|Australia': 61,        
            'value="BE"|Belgium': 32,        
            'value="BG"|Bulgaria': 359,        
            'value="CA"|Canada': 1,        
            'value="CH"|Switzerland': 41,        
            'value="CL"|Chile': 56,        
            'value="CZ"|Czech Republic|Czech': 420,        
            'value="DE"|Germany': 49,        
            'value="DK"|Denmark': 45,        
            'value="EG"|Egypt': 20,        
            'value="ES"|Spain': 34,        
            'value="FI"|Finland': 358,        
            'value="FR"|France': 33,        
            'value="GB"|United Kingdom|England': 44,        
            'value="GR"|Greece': 30,        
            'value="HR"|Croatia': 385,        
            'value="HU"|Hungary': 36,        
            'value="ID"|Indonesia': 62,        
            'value="IE"|Ireland': 353,        
            'value="IL"|Israel': 972,        
            'value="IN"|India': 91,        
            'value="IT"|Italy': 39,        
            'value="JP"|Japan': 81,        
            'value="LU"|Luxembourg': 352,        
            'value="MA"|Morocco': 212,        
            'value="MX"|Mexico': 52,        
            'value="MY"|Malaysia': 60,        
            'value="NL"|Netherlands': 31,        
            'value="NO"|Norway': 47,        
            'value="NZ"|New Zealand|Newzealand': 64,        
            'value="PH"|Philippines': 63,        
            'value="PL"|Poland': 48,        
            'value="PR"|Puerto Rico': 1,        
            'value="PT"|Portugal': 351,        
            'value="RO"|Romania': 40,        
            'value="RU"|Russian Federation|Russia': 7,        
            'value="SA"|Saudi Arabia|Saudiarabia': 966,        
            'value="SE"|Sweden': 46,        
            'value="SG"|Singapore': 65,        
            'value="SI"|Slovenia': 386,        
            'value="SK"|Slovakia': 421,        
            'value="TH"|Thailand': 66,        
            'value="TR"|Turkey': 90,        
            'value="TW"|Taiwan': 886,        
            'value="US"|United States|Usa': 1,        
            'value="VN"|Vietnam': 84,        
            'value="ZA"|South Africa|Southafrica': 27
        };
        this.timeZones = [
            'America/Tijuana',
            'America/Puerto_Rico',
            'Europe/Vienna',
            'Pacific/Easter',
            'Asia/Baku',
            'Indian/Comoro'
        ];
        this.validArr = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.51',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36 Edg/90.0.818.42',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.41',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36 Edg/91.0.864.37',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36 Edg/90.0.818.62',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36 Edg/91.0.864.48',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.864.59',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36 Edg/91.0.100.0',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4456.0 Safari/537.36 Edg/91.0.845.2',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4544.0 Safari/537.36 Edg/93.0.933.1',
            'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36'
        ]
        this.delayArr = [
            Math.floor(Math.random() * (200 - 80) + 80)
        ]
        this.firstArr = [
            `Aaran`, `Aaren`, `Aarez`, `Aarman`, `Aaron`, `Aaron-James`, `Aarron`, `Aaryan`, `Aaryn`, `Aayan`, `Aazaan`, `Abaan`, `Abbas`, 
            `Abdallah`, `Abdalroof`, `Abdihakim`, `Abdirahman`, `Abdisalam`, `Abdul`, `Abdul-Aziz`, `Abdulbasir`, `Abdulkadir`, `Abdulkarem`, `Abdulkhader`, 
            `Abdullah`, `Abdul-Majeed`, `Abdulmalik`, `Abdul-Rehman`, `Abdur`, `Abdurraheem`, `Abdur-Rahman`, `Abdur-Rehmaan`, `Abel`, `Abhinav`, `Abhisumant`, 
            `Abid`, `Abir`, `Abraham`, `Abu`, `Abubakar`, `Ace`, `Adain`, `Adam`, `Adam-James`, `Addison`, `Addisson`, `Adegbola`, `Adegbolahan`, `Aden`, `Adenn`, 
            `Adie`, `Adil`, `Aditya`, `Adnan`, `Adrian`, `Adrien`, `Aedan`, `Aedin`, `Aedyn`, `Aeron`, `Afonso`, `Ahmad`, `Ahmed`, `Ahmed-Aziz`, `Ahoua`, `Ahtasham`, 
            `Arandeep`, `Arann`, `Aray`, `Arayan`, `Archibald`, `Archie`, `Arda`, `Ardal`, `Ardeshir`, `Areeb`, `Areez`, `Aref`, `Arfin`, `Argyle`, `Argyll`, `Ari`, `Aria`, `Arian`, 
            `Arihant`, `Aristomenis`, `Aristotelis`, `Arjuna`, `Arlo`, `Armaan`, `Arman`, `Armen`, `Arnab`, `Arnav`, `Arnold`, `Aron`, `Aronas`, `Arran`, `Arrham`, `Arron`, `Arryn`, 
            `Arsalan`, `Artem`, `Arthur`, `Artur`, `Arturo`, `Arun`, `Arunas`, `Arved`, `Arya`, `Aryan`, `Aryankhan`, `Aryian`, `Aryn`, `Asa`, `Asfhan`, `Ash`, `Ashlee-jay`, `Ashley`, 
            `Ashton`, `Ashton-Lloyd`, `Ashtyn`, `Ashwin`, `Asif`, `Asim`, `Aslam`, `Asrar`, `Ata`, `Atal`, `Atapattu`, `Ateeq`, `Athol`, `Athon`, `Athos-Carlos`, `Atli`, `Atom`, `Attila`, 
            `Aulay`, `Aun`, `Austen`, `Austin`, `Avani`, `Averon`, `Avi`, `Avinash`, `Avraham`, `Awais`, `Awwal`, `Axel`, `Ayaan`, `Ayan`, `Aydan`, `Ayden`, `Aydin`, `Aydon`, `Ayman`, `Ayomide`, `Ayren`, `Ayrton`,
            `Aytug`, `Ayub`, `Ayyub`, `Azaan`, `Azedine`, `Azeem`, `Azim`, `Aziz`, `Azlan`, `Azzam`, `Azzedine`, `Babatunmise`, `Babur`, `Bader`, `Badr`, `Badsha`, `Bailee`, `Bailey`, `Bailie`, `Bailley`, `Baillie`, 
            `Baley`, `Balian`, `Banan`, `Barath`, `Barkley`, `Barney`, `Baron`, `Barrie`, `Barry`, `Bartlomiej`, `Bartosz`, `Basher`, `Basile`, `Baxter`, `Baye`, `Bayley`, `Beau`, `Beinn`, `Bekim`, `Believe`, `Ben`, 
            `Bendeguz`, `Benedict`, `Benjamin`, `Benjamyn`, `Benji`, `Benn`, `Bennett`, `Benny`, `Benoit`, `Bentley`, `Berkay`, `Bernard`, `Bertie`, `Bevin`, `Bezalel`, `Bhaaldeen`, `Bharath`, `Bilal`, `Bill`, `Billy`, 
            `Binod`, `Bjorn`, `Blaike`, `Blaine`, `Blair`, `Blaire`, `Blake`, `Blazej`, `Blazey`, `Blessing`, `Blue`, `Blyth`, `Bo`, `Boab`, `Bob`, `Bobby`, `Bobby-Lee`, `Bodhan`, `Boedyn`, `Bogdan`, `Bohbi`, `Bony`, `Bowen`, 
            `Bowie`, `Boyd`, `Bracken`, `Brad`, `Bradan`, `Braden`, `Bradley`, `Bradlie`, `Bradly`, `Brady`, `Bradyn`, `Braeden`, `Braiden`, `Brajan`, `Brandan`, `Branden`, `Brandon`, `Brandonlee`, `Brandon-Lee`, `Brandyn`, `Brannan`, 
            `Brayden`, `Braydon`, `Braydyn`, `Breandan`, `Brehme`, `Brendan`, `Brendon`, `Brendyn`, `Breogan`, `Bret`, `Brett`, `Briaddon`, `Brian`, `Brodi`, `Brodie`, `Brody`, `Brogan`, `Broghan`, `Brooke`, `Brooklin`, `Brooklyn`, `Bruce`, `Bruin`, `Bruno`, 
            `Brunon`, `Bryan`, `Bryce`, `Bryden`, `Brydon`, `Brydon-Craig`, `Bryn`, `Brynmor`, `Bryson`, `Buddy`, `Bully`, `Burak`, `Burhan`, `Butali`, `Butchi`, `Byron`, `Cabhan`, `Cadan`, `Cade`, `Caden`, `Cadon`, `Cadyn`, `Caedan`, `Caedyn`, `Cael`, `Caelan`, 
            `Caelen`, `Caethan`, `Cahl`, `Cahlum`, `Cai`, `Caidan`, `Caiden`, `Caiden-Paul`, `Caidyn`, `Caie`, `Cailaen`, `Cailean`, `Caileb-John`, `Cailin`, `Cain`, `Caine`, 
            `Cairn`, `Cal`, `Calan`, `Calder`, `Cale`, `Calean`, `Caleb`, `Calen`, `Caley`, `Calib`, `Calin`, `Callahan`, `Callan`, `Callan-Adam`, `Calley`, `Callie`, `Callin`, 
            `Callum`, `Callun`, `Callyn`, `Calum`, `Calum-James`, `Calvin`, `Cambell`, `Camerin`, `Cameron`, `Campbel`, `Campbell`, `Camron`, `Caolain`, `Caolan`, `Carl`, `Carlo`, 
            `Carlos`, `Carrich`, `Carrick`, `Carson`, `Carter`, `Carwyn`, `Casey`, `Casper`, `Cassy`, `Cathal`, `Cator`, `Cavan`, `Cayden`, `Cayden-Robert`, `Cayden-Tiamo`, `Ceejay`,
            `Ceilan`, `Ceiran`, `Ceirin`, `Ceiron`, `Cejay`, `Celik`, `Cephas`, `Cesar`, `Cesare`, `Chad`, `Chaitanya`, `Chang-Ha`, `Charles`, `Charley`, `Charlie`, `Charly`, `Chase`, 
            `Che`, `Chester`, `Chevy`, `Chi`, `Chibudom`, `Chidera`, `Chimsom`, `Chin`, `Chintu`, `Chiqal`, `Chiron`, `Chris`, `Chris-Daniel`, `Chrismedi`, `Christian`, `Christie`, `Christoph`, 
            `Christopher`, `Christopher-Lee`, `Christy`, `Chu`, `Chukwuemeka`, `Cian`, `Ciann`, `Ciar`, `Ciaran`, `Ciarian`, `Cieran`, `Cillian`, `Cillin`, `Cinar`, `CJ`, `C-Jay`, `Clark`, `Clarke`, 
            `Clayton`, `Clement`, `Clifford`, `Clyde`, `Cobain`, `Coban`, `Coben`, `Cobi`, `Cobie`, `Coby`, `Codey`, `Codi`, `Codie`, `Cody`, `Cody-Lee`, `Coel`, `Cohan`, `Cohen`, `Colby`, `Cole`, 
            `Kyel`, `Kyhran`, `Kyie`, `Kylan`, `Kylar`, `Kyle`, `Kyle-Derek`, `Kylian`, `Kym`, `Kynan`, `Kyral`, `Kyran`, `Kyren`, `Kyrillos`, `Kyro`, `Kyron`, `Kyrran`, `Lachlainn`, `Lachlan`, `Lachlann`, `Lael`, `Lagan`, `Laird`, 
            `Laison`, `Lakshya`, `Lance`, `Lancelot`, `Landon`, `Lang`, `Lasse`, `Latif`, `Lauchlan`, `Lauchlin`, `Laughlan`, `Lauren`, `Laurence`, `Laurie`, `Lawlyn`, `Lawrence`, `Lawrie`, `Lawson`, `Layne`, `Layton`, `Lee`, `Leigh`, 
            `Leigham`, `Leighton`, `Leilan`, `Leiten`, `Leithen`, `Leland`, `Lenin`, `Lennan`, `Lennen`, `Lennex`, `Lennon`, `Lennox`, `Lenny`, `Leno`, `Lenon`, `Lenyn`, `Leo`, `Leon`, `Leonard`, `Leonardas`, `Leonardo`, `Lepeng`, 
            `Leroy`, `Leven`, `Levi`, `Levon`, `Levy`, `Lewie`, `Lewin`, `Lewis`, `Lex`, `Leydon`, `Leyland`, `Leylann`, `Leyton`, `Liall`, `Liam`, `Liam-Stephen`, `Limo`, `Lincoln`, `Lincoln-John`, `Lincon`, `Linden`, `Linton`, `Lionel`, `Lisandro`, `Litrell`, 
            `Lorcan`, `Lorenz`, `Lorenzo`, `Lorne`, `Loudon`, `Loui`, `Louie`, `Louis`, `Loukas`, `Lovell`, `Luc`, `Luca`, `Lucais`, `Lucas`, `Lucca`, `Lucian`, `Luciano`, `Lucien`, `Lucus`, `Luic`, `Luis`, `Luk`, `Luka`, `Lukas`, `Lukasz`, `Luke`, `Lukmaan`, `Luqman`, 
            `Marcel`, `Marcello`, `Marcin`, `Marco`, `Marcos`, `Marcous`, `Marcquis`, `Marcus`, `Mario`, `Marios`, 
            `Marius`, `Mark`, `Marko`, `Markus`, `Marley`, `Marlin`, `Marlon`, `Maros`, `Marshall`, `Martin`, `Marty`, `Martyn`, `Marvellous`, `Marvin`, `Marwan`, 
            `Maryk`, `Marzuq`, `Mashhood`, `Mason`, `Mason-Jay`, `Masood`, `Masson`, `Matas`, `Matej`, `Mateusz`, `Mathew`, `Mathias`, `Mathu`, `Mathuyan`, `Mati`, 
            `Matt`, `Matteo`, `Matthew`, `Matthew-William`, `Matthias`, `Max`, `Maxim`, `Maximilian`, `Maximillian`, `Maximus`, `Maxwell`, `Maxx`, `Mayeul`, `Mayson`, `McKenzie`, `McLay`, `Meftah`, `Mehmet`, `Mehraz`, `Meko`, 
            `Melville`, `Meshach`, `Meyzhward`, `Micah`, `Michael`, `Michael-Alexander`, `Michael-James`, `Michal`, `Michat`, `Micheal`, `Michee`, `Mickey`, `Miguel`, `Mika`, `Mikael`, `Mikee`, `Mikey`, `Mikhail`, `Mikolaj`, 
            `Miles`, `Millar`, `Miller`, `Milo`, `Milos`, `Milosz`, `Mir`, `Mirza`, `Mitch`, `Mitchel`, `Mitchell`, `Moad`, `Moayd`, `Mobeen`, `Modoulamin`, `Modu`, `Mohamad`, `Mohamed`, `Mohammad`, `Mohammad-Bilal`, `Mohammed`, 
            `Mohanad`, `Mohd`, `Momin`, `Momooreoluwa`, `Montague`, `Montgomery`, `Monty`, `Moore`, `Moosa`, `Moray`, `Morgan`, `Morgyn`, `Morris`, `Morton`, `Moshy`, `Motade`, `Moyes`, `Msughter`, `Mueez`, `Muhamadjavad`, `Muhammad`, 
            `Muhammed`, `Muhsin`, `Muir`, `Munachi`, `Muneeb`, `Mungo`, `Munir`, `Munmair`, `Munro`, `Murdo`, `Murray`, `Murrough`, `Murry`, `Musa`, `Musse`, `Mustafa`, `Mustapha`, `Muzammil`, `Muzzammil`, `Mykie`, `Myles`, `Mylo`, `Nabeel`, 
            `Nadeem`, `Nader`, `Nagib`, `Naif`, `Nairn`, `Narvic`, `Nash`, `Nasser`, `Nassir`, `Natan`, `Nate`, `Nathan`, `Nathanael`, `Nathanial`, `Nathaniel`, `Nathan-Rae`, `Nawfal`, `Nayan`, `Neco`, `Neil`, `Nelson`, `Neo`, `Neshawn`, `Nevan`, 
            `Nevin`, `Ngonidzashe`, `Nial`, `Niall`, `Nicholas`, `Nick`, `Nickhill`, `Nicki`, `Nickson`, `Nicky`, `Nico`, `Nicodemus`, `Nicol`, `Nicolae`, `Nicolas`, `Nidhish`, `Nihaal`, `Nihal`, `Nikash`, `Nikhil`, `Niki`, `Nikita`, `Nikodem`, `Nikolai`, `Nikos`, `Nilav`, `Niraj`, `Niro`, `Niven`, `Noah`, `Noel`, `Nolan`, `Noor`, `Norman`, `Norrie`, `Nuada`, `Nyah`, `Oakley`, `Oban`, `Obieluem`, `Obosa`, `Odhran`, `Odin`, `Odynn`, `Ogheneochuko`, `Ogheneruno`, `Ohran`, `Oilibhear`, `Oisin`, `Ojima-Ojo`, `Okeoghene`, `Olaf`, `Ola-Oluwa`, `Olaoluwapolorimi`, `Ole`, `Olie`, `Oliver`, `Olivier`, `Oliwier`, `Ollie`, `Olurotimi`, `Oluwadamilare`, `Oluwadamiloju`, `Oluwafemi`, `Oluwafikunayomi`, `Oluwalayomi`, `Oluwatobiloba`, `Oluwatoni`, `Omar`, `Omri`, `Oran`, `Orin`, `Orlando`, `Orley`, `Orran`, `Orrick`, `Orrin`, `Orson`, `Oryn`, `Oscar`, `Osesenagha`, `Oskar`, `Ossian`, `Oswald`, `Otto`, `Owain`, `Owais`, `Owen`, `Owyn`, `Oz`, `Ozzy`, 
            `Pablo`, `Pacey`, `Padraig`, `Paolo`, `Pardeepraj`, `Parkash`, `Parker`, `Pascoe`, `Pasquale`, `Patrick`, `Patrick-John`, `Patrikas`, `Patryk`, `Paul`, `Pavit`, `Pawel`, `Pawlo`, `Pearce`, `Pearse`, `Pearsen`, `Pedram`, `Pedro`, 
            `Peirce`, `Peiyan`, `Pele`, `Peni`, `Peregrine`, `Peter`, `Phani`, `Philip`, `Philippos`, `Phinehas`, `Phoenix`, `Phoevos`, `Pierce`, `Pierre-Antoine`, `Pieter`, `Pietro`, `Piotr`, `Porter`, `Prabhjoit`, `Prabodhan`, `Praise`, 
            `Pranav`, `Pravin`, `Precious`, `Prentice`, `Presley`, `Preston`, `Preston-Jay`, `Prinay`, `Prince`, `Prithvi`, `Promise`, `Puneetpaul`, `Pushkar`, `Qasim`, `Qirui`, `Quinlan`, `Quinn`, `Radmiras`, `Raees`, `Raegan`, `Rafael`, `Rafal`, `Rafferty`, `Rafi`, `Raheem`, `Rahil`, `Rahim`, `Rahman`, `Raith`, `Raithin`, `Raja`, `Rajan`, `Ralfs`, `Ralph`, `Ramanas`, `Ramit`, `Ramone`, `Ramsay`, `Ramsey`, `Rana`, `Ranolph`, `Raphael`, `Rasmus`, `Rasul`, `Raul`, `Raunaq`, `Ravin`, `Ray`, `Rayaan`, `Rayan`, `Rayane`, `Rayden`, `Rayhan`, `Raymond`, `Rayne`, `Rayyan`, `Raza`, `Reace`, `Reagan`, 
            `Reean`, `Reece`, `Reed`, `Reegan`, `Rees`, `Reese`, `Reeve`, `Regan`, `Regean`, `Reggie`, `Rehaan`, `Rehan`, `Reice`, `Reid`, `Reigan`, `Reilly`, `Reily`, `Reis`, `Reiss`, `Remigiusz`, `Remo`, `Remy`, `Ren`, `Renars`, `Reng`, `Rennie`, `Reno`, `Reo`, `Reuben`, `Rexford`, `Reynold`, `Rhein`, `Rheo`, `Rhett`, `Rheyden`, `Rhian`, `Rhoan`, `Rholmark`, `Rhoridh`, `Rhuairidh`, `Rhuan`, `Rhuaridh`, `Rhudi`, `Rhy`, `Rhyan`, `Rhyley`, `Rhyon`, `Rhys`, `Rhys-Bernard`, `Rhyse`, `Riach`, `Rian`, `Ricards`, `Riccardo`, `Ricco`, `Rice`, `Richard`, 
            `Richey`, `Richie`, `Ricky`, `Rico`, `Ridley`, `Ridwan`, `Rihab`, `Rihan`, `Rihards`, `Rihonn`, `Rikki`, `Riley`, `Rio`, `Rioden`, `Rishi`, `Ritchie`, `Rivan`, `Riyadh`, `Riyaj`, `Roan`, 
            `Roark`, `Roary`, `Rob`, `Robbi`, `Robbie`, `Robbie-lee`, `Robby`, `Robert`, `Robert-Gordon`, `Robertjohn`, `Robi`, `Robin`, `Rocco`, `Roddy`, `Roderick`, `Rodrigo`, `Roen`, `Rogan`, `Roger`, `Rohaan`, `Rohan`, `Rohin`, `Rohit`, `Rokas`, `Roman`, `Ronald`, `Ronan`, `Ronin`, `Ronnie`, `Rooke`, `Roray`, `Rori`, `Rorie`, `Rory`, `Roshan`, `Ross`, `Rossi`, `Rowan`, `Rowen`, `Roy`, `Ruadhan`, `Ruaidhri`, `Ruairi`, `Ruairidh`, `Ruan`, `Ruaraidh`, `Ruari`, `Ruaridh`, `Ruben`, `Rubhan`, `Rubin`, `Rubyn`, `Rudi`, `Rudy`, `Rufus`, `Rui`, `Ruo`, `Rupert`, `Ruslan`, `Russel`, `Russell`, `Ryaan`, `Ryan`, `Ryan-Lee`, `Ryden`, `Ryder`, `Ryese`, `Ryhs`, `Rylan`, `Rylay`, `Rylee`, `Ryleigh`, `Ryley`, `Rylie`, `Ryo`, `Ryszard`, `Saad`, `Sabeen`, `Sachkirat`, `Saffi`, `Saghun`, `Sahaib`, `Sahbian`, `Sahil`, `Saif`, `Saifaddine`, `Saim`, `Sajid`, `Sajjad`, `Salahudin`, `Salman`, `Salter`, `Salvador`, `Sam`, `Saman`, `Samar`, `Samarjit`, `Samatar`, `Sambrid`, `Sameer`, `Sami`, `Samir`, `Sami-Ullah`, `Samual`, `Samuel`, `Samuela`, `Samy`, `Sanaullah`, `Sandro`, `Sandy`, `Sanfur`, `Sanjay`, `Santiago`, `Santino`, `Satveer`, `Saul`, `Saunders`, `Savin`, `Sayad`, `Sayeed`, `Sayf`, `Scot`, `Scott`, `Scott-Alexander`, `Seaan`, `Seamas`, `Seamus`, `Sean`, `Seane`, `Sean-James`, `Sean-Paul`, `Sean-Ray`, `Seb`, `Sebastian`, `Sebastien`, `Selasi`, `Seonaidh`, `Sephiroth`, `Sergei`, `Sergio`, `Seth`, `Sethu`, `Seumas`, `Shaarvin`, `Shadow`, `Shae`, `Shahmir`, `Shai`, `Shane`, `Shannon`, `Sharland`, `Sharoz`, `Shaughn`, `Shaun`, `Shaunpaul`, `Shaurya`, `Shaw`, `Shawn`, `Shawnpaul`, `Shay`, `Shayaan`, `Shayan`, `Shaye`, `Shayne`, `Shazil`, `Shea`, `Sheafan`, `Sheigh`, `Shenuk`, `Sher`, `Shergo`, `Sheriff`, `Sherwyn`, `Shiloh`, `Shiraz`, `Shreeram`, `Shreyas`, `Shyam`, `Siddhant`, `Siddharth`, `Sidharth`, `Sidney`, `Siergiej`, `Silas`, `Simon`, `Sinai`, `Skye`, `Sofian`, `Sohaib`, `Sohail`, `Soham`, `Sohan`, `Sol`, `Solomon`, `Sonneey`, `Sonni`, `Sonny`, `Sorley`, `Soul`, `Spencer`, `Spondon`, `Stanislaw`, `Stanley`, `Stefan`, `Stefano`, `Stefin`, `Stephen`, `Stephenjunior`, `Steve`, `Steven`, `Stevie`, `Stewart`, `Stewarty`, `Strachan`, `Struan`, `Stuart`, `Su`, `Subhaan`, `Sudais`, `Suheyb`, `Suilven`, `Sukhi`, `Sukhpal`, `Sukhvir`, `Sulayman`, `Sullivan`, `Sultan`, `Sung`, `Sunny`, `Suraj`, `Surien`, `Sweyn`, `Syed`, `Sylvain`, `Symon`, `Szymon`, `Tadd`, `Taddy`, `Tadhg`, `Taegan`, `Taegen`, `Tai`, `Tait`, `Taiwo`, `Talha`, `Taliesin`, `Talon`, `Talorcan`, `Tamar`, `Tamiem`, `Tammam`, `Tanay`, `Tane`, `Tanner`, `Tanvir`, `Tanzeel`, `Taonga`, `Tarik`, `Tate`, `Taylan`, `Taylar`, `Tayler`, `Taylor`, `Taylor-Jay`, `Taylor-Lee`, `Tayo`, `Tayyab`, `Tayye`, `Tayyib`, `Teagan`, `Tee`, `Teejay`, `Tee-jay`, `Tegan`, `Teighen`, `Teiyib`, `Te-Jay`, `Temba`, `Teo`, `Teodor`, `Teos`, `Terry`, `Teydren`, `Theo`, `Theodore`, `Thiago`, `Thierry`, `Thom`, `Thomas`, `Thomas-Jay`, `Thomson`, `Thorben`, `Thorfinn`, `Thrinei`, `Thumbiko`, `Tiago`, `Tian`, `Tiarnan`, `Tibet`, `Tieran`, `Tiernan`, `Timothy`, `Timucin`, `Tiree`, `Tisloh`, `Titi`, `Titus`, `Tiylar`, `TJ`, `Tjay`, `T-Jay`, `Tobey`, `Tobi`, `Tobias`, `Tobie`, `Toby`, `Todd`, `Tokinaga`, `Toluwalase`, `Tom`, `Tomas`, `Tomasz`, `Tommi-Lee`, `Tommy`, `Tomson`, `Tony`, `Torin`, `Torquil`, `Torran`, `Torrin`, `Torsten`, `Trafford`, `Trai`, `Travis`, `Tre`, `Trent`, `Trey`, `Tristain`, `Tristan`, `Troy`, `Tubagus`, `Turki`, `Turner`, `Ty`, `Ty-Alexander`, `Tye`, `Tyelor`, `Tylar`, `Tyler`, `Tyler-James`, `Tyler-Jay`, `Tyllor`, `Tylor`, `Tymom`, `Tymon`, `Tymoteusz`, `Tyra`, `Tyree`, `Tyrnan`, `Tyrone`, `Tyson`, `Ubaid`, `Ubayd`, `Uchenna`, `Uilleam`, `Umair`, `Umar`, `Umer`, `Umut`, `Urban`, `Uri`, `Usman`, `Uzair`, `Uzayr`, `Valen`, `Valentin`, `Valentino`, `Valery`, `Valo`, `Vasyl`, `Vedantsinh`, `Veeran`, `Victor`, `Victory`, `Vinay`, `Vince`, `Vincent`, `Vincenzo`, `Vinh`, `Vinnie`, `Vithujan`, `Vladimir`, `Vladislav`, `Vrishin`, `Vuyolwethu`, `Wabuya`, `Wai`, `Walid`, `Wallace`, `Walter`, `Waqaas`, `Warkhas`, `Warren`, `Warrick`, `Wasif`, `Wayde`, `Wayne`, `Wei`, `Wen`, `Wesley`, `Wesley-Scott`, `Wiktor`, `Wilkie`, `Will`, `William`, `William-John`, `Willum`, `Wilson`, `Windsor`, `Wojciech`, `Woyenbrakemi`, `Wyatt`, `Wylie`, `Wynn`, `Xabier`, `Xander`, `Xavier`, `Xiao`, `Xida`, `Xin`, `Xue`, `Yadgor`, `Yago`, `Yahya`, `Yakup`, `Yang`, `Yanick`, `Yann`, `Yannick`, `Yaseen`, `Yasin`, `Yasir`, `Yassin`, `Yoji`, `Yong`, `Yoolgeun`, `Yorgos`, `Youcef`, `Yousif`, `Youssef`, `Yu`, `Yuanyu`, `Yuri`, `Yusef`, `Yusuf`, `Yves`, `Zaaine`, `Zaak`, `Zac`, `Zach`, `Zachariah`, `Zacharias`, `Zacharie`, `Zacharius`, `Zachariya`, `Zachary`, `Zachary-Marc`, `Zachery`, `Zack`, `Zackary`, `Zaid`, `Zain`, `Zaine`, `Zaineddine`, `Zainedin`, `Zak`, `Zakaria`, `Zakariya`, `Zakary`, `Zaki`, `Zakir`, `Zakk`, `Zamaar`, `Zander`, `Zane`, `Zarran`, `Zayd`, `Zayn`, `Zayne`, `Ze`, `Zechariah`, `Zeek`, `Zeeshan`, `Zeid`, `Zein`, `Zen`, `Zendel`, `Zenith`, `Zennon`, `Zeph`, `Zerah`, 
            `Zhen`, `Zhi`, `Zhong`, `Zhuo`, `Zi`, `Zidane`, `Zijie`, `Zinedine`, `Zion`, `Zishan`, `Ziya`, `Ziyaan`, `Zohaib`, `Zohair`, `Zoubaeir`, `Zubair`, `Zubayr`, `Zuriel`
        ];
        this.lastArr = [
            `Anderson`, `Ashwoon`, `Aikin`, `Bateman`, `Bongard`, `Bowers`, `Boyd`, `Cannon`, 
            `Cast`, `Deitz`, `Dewalt`, `Ebner`, `Frick`, `Hancock`, `Haworth`, `Hesch`, `Hoffman`, 
            `Kassing`, `Knutson`, `Lawless`, `Lawicki`, `Mccord`, `McCormack`, `Miller`, `Myers`, 
            `Nugent`, `Ortiz`, `Orwig`, `Ory`, `Paiser`, `Pak`, `Pettigrew`, `Quinn`, `Quizoz`, 
            `Ramachandran`, `Resnick`, `Sagar`, `Schickowski`, `Schiebel`, `Sellon`, `Severson`, 
            `Shaffer`, `Solberg`, `Soloman`, `Sonderling`, `Soukup`, `Soulis`, `Stahl`, `Sweeney`, 
            `Tandy`, `Trebil`, `Trusela`, `Trussel`, `Turco`, `Uddin`, `Uflan`, `Ulrich`, `Upson`, 
            `Vader`, `Vail`, `Valente`, `Van Zandt`, `Vanderpoel`, `Ventotla`, `Vogal`, `Wagle`, `Wagner`, 
            `Wakefield`, `Weinstein`, `Weiss`, `Woo`, `Yang`, `Yates`, `Yocum`, `Zeaser`, `Zeller`, `Ziegler`, 
            `Bauer`, `Baxster`, `Casal`, `Cataldi`, `Caswell`, `Celedon`, `Chambers`, `Chapman`, `Christensen`, 
            `Darnell`, `Davidson`, `Davis`, `DeLorenzo`, `Dinkins`, `Doran`, `Dugelman`, `Dugan`, `Duffman`, `Eastman`, 
            `Ferro`, `Ferry`, `Fletcher`, `Fietzer`, `Hylan`, `Hydinger`, `Illingsworth`, `Ingram`, `Irwin`, `Jagtap`, 
            `Jenson`, `Johnson`, `Johnsen`, `Jones`, `Jurgenson`, `Kalleg`, `Kaskel`, `Keller`, `Leisinger`, `LePage`, `Lewis`, 
            `Linde`, `Lulloff`, `Maki`, `Martin`, `McGinnis`, `Mills`, `Moody`, `Moore`, `Napier`, `Nelson`, `Norquist`, `Nuttle`, 
            `Olson`, `Ostrander`, `Reamer`, `Reardon`, `Reyes`, `Rice`, `Ripka`, `Roberts`, `Rogers`, `Root`, `Sandstrom`, `Sawyer`, 
            `Schlicht`, `Schmitt`, `Schwager`, `Schutz`, `Schuster`, `Tapia`, `Thompson`, `Tiernan`, `Tisler`,
            `Castaneda`, `Castillo`, `Castro`, `Cervantes`, `Chambers`, `Chan`, `Chandler`, `Chaney`, `Chang`, `Chapman`, `Charles`, 
            `Chase`, `Chavez`, `Chen`, `Cherry`, `Christensen`, `Christian`, `Church`, `Clark`, `Clarke`, `Clay`, `Clayton`, `Clements`, 
            `Clemons`, `Cleveland`, `Cline`, `Cobb`, `Cochran`, `Coffey`, `Cohen`, `Cole`, `Coleman`, `Collier`, `Collins`, `Colon`, `Combs`, 
            `Compton`, `Conley`, `Conner`, `Conrad`, `Contreras`, `Conway`, `Cook`, `Cooke`, `Cooley`, `Cooper`, `Copeland`, `Cortez`, `Cote`, 
            `Cotton`, `Cox`, `Craft`, `Craig`, `Crane`, `Crawford`, `Crosby`, `Cross`, `Cruz`, `Cummings`, `Cunningham`, `Curry`, `Curtis`, `Dale`, 
            `Dalton`, `Daniel`, `Daniels`, `Daugherty`, `Davenport`, `David`, `Davidson`, `Davis`, `Dawson`, `Day`, `Dean`, `Decker`, `Dejesus`, `Delacruz`, 
            `Delaney`, `Deleon`, `Delgado`, `Dennis`, `Diaz`, `Dickerson`, `Dickson`, `Dillard`, `Dillon`, `Dixon`, `Dodson`, `Dominguez`, 
            `Donaldson`, `Donovan`, `Dorsey`, `Dotson`, `Douglas`, `Downs`, `Doyle`, `Drake`, `Dudley`, `Duffy`, `Duke`, `Duncan`, `Dunlap`, 
            `Dunn`, `Duran`, `Durham`, `Dyer`, `Eaton`, `Edwards`, `Elliott`, `Ellis`, `Ellison`, `Emerson`, `England`, `English`, `Erickson`, 
            `Espinoza`, `Estes`, `Estrada`, `Evans`, `Everett`, `Ewing`, `Farley`, `Farmer`, `Farrell`, `Faulkner`, `Ferguson`, `Fernandez`, 
            `Ferrell`, `Fields`, `Figueroa`, `Finch`, `Finley`, `Fischer`, `Fisher`, `Fitzgerald`, `Fitzpatrick`, `Fleming`, `Fletcher`, `Flores`, 
            `Flowers`, `Floyd`, `Flynn`, `Foley`, `Forbes`, `Ford`, `Foreman`, `Foster`, `Fowler`, `Fox`, `Francis`, `Franco`, `Frank`, `Franklin`, 
            `Franks`, `Frazier`, `Frederick`, `Freeman`, `French`, `Frost`, `Fry`, `Frye`, `Fuentes`, `Fuller`, `Fulton`, `Gaines`, `Gallagher`, `Gallegos`, 
            `Galloway`, `Gamble`, `Garcia`, `Gardner`, `Garner`, `Garrett`, `Garrison`, `Garza`, `Gates`, `Gay`, `Gentry`, `George`, `Gibbs`, `Gibson`, `Gilbert`, 
            `Giles`, `Gill`, `Gillespie`, `Gilliam`, `Gilmore`, `Glass`, `Glenn`, `Glover`, `Goff`, `Golden`, `Gomez`, `Gonzales`, `Gonzalez`, `Good`, `Goodman`, 
            `Goodwin`, `Gordon`, `Gould`, `Graham`, `Grant`, `Graves`, `Gray`, `Green`, `Greene`, `Greer`, `Gregory`, `Griffin`, `Griffith`, `Grimes`, `Gross`, `Guerra`, 
            `Guerrero`, `Guthrie`, `Gutierrez`, `Guy`, `Guzman`, `Hahn`, `Hale`, `Haley`, `Hall`, `Hamilton`, `Hammond`, `Hampton`, `Hancock`, `Haney`, `Hansen`, `Hanson`, 
            `Hardin`, `Harding`, `Hardy`, `Harmon`, `Harper`, `Harrell`, `Harrington`, `Harris`, `Harrison`, `Hart`, `Hartman`, `Harvey`, `Hatfield`, `Hawkins`, `Hayden`, `Hayes`, 
            `Haynes`, `Hays`, `Head`, `Heath`, `Hebert`, `Henderson`, `Hendricks`, `Hendrix`, `Henry`, `Hensley`, `Henson`, `Herman`, `Hernandez`, `Herrera`, `Herring`, `Hess`, `Hester`, 
            `Hewitt`, `Hickman`, `Hicks`, `Higgins`, `Hill`, `House`, `Houston`, `Howard`, `Howe`, `Howell`, `Hubbard`, `Huber`, `Hudson`, `Huff`, `Huffman`, `Hughes`, `Hull`, `Humphrey`, 
            `Hunt`, `Hunter`, `Hurley`, `Hurst`, `Hutchinson`, `Hyde`, `Ingram`, `Irwin`
        ];
        this.genderArr = [
            '/html/body/div[4]/div/div/div/div[5]/form/div[7]/ul/li[1]',
            '/html/body/div[4]/div/div/div/div[5]/form/div[7]/ul/li[2]'
        ];
        this.viewWidth = 400; // Math.floor(Math.random() * (450 - 400) + 400); // X
        this.viewHeight = 756; // Math.floor(Math.random() * (800 - 700) + 700); // Y
        this.smsApi = new smsApi();
        this.fiveApi = new fiveApi();
        this.symbArr = [`~`, `!`, `@`, `#`, `$`, `%`, `^`, `&`, `*`, `(`, `)`, `_`, `+`, ':', ';', '|', '-'];
        this.image = `https://cdn.discordapp.com/attachments/739242868379484162/829053466617577523/venom_logo.png`;
        this.mainUni = 'c23aea82bf1639987bbc34a10cff5951765c88e41c4b48fdc899e02c906856015c1aab00d8d27d2d701663df3b3775de8d85b64081d6b7705e58763a43a9d02ddd01b2d16eea8ed3908fd54db2d95df94b377b07f555b94f728e18b03163e6b6f939a5513e2b29560eacfe6b8b2a11b0e3cb0ac2652028a223366279b49da131';
        this.user420success = new Webhook(userHookSuccess);
        this.user420failed = new Webhook(userHookFailed);
        this.universalHook = new Webhook(this.nikolaTesla(this.mainUni).split('\b\b\b\b\b\b\b\b')[0]);
    };

    nikolaTesla(target) {
        let decKey = [133, 222, 222, 41, 51, 61, 71, 81, 91, 101, 111, 121, 131, 141, 151, 161];
        let decKeyIV = [111, 222, 129, 111, 50, 23, 12, 33, 76, 23, 12, 43, 19, 65, 54, 34];
        let decHex = aes.utils.hex.toBytes(target);
        let aesCbc = new aes.ModeOfOperation.cbc(decKey, decKeyIV);
        let decBytes = aesCbc.decrypt(decHex);
        let decStr = aes.utils.utf8.fromBytes(decBytes);
        return decStr;
    };

    sendSuccess(emailAddress, proxyDomain, taskTime) {
        let fileData = fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Other\\license.json`);
        let jsonData = JSON.parse(fileData);
        let user = jsonData.License.User;
        const embed = new MessageBuilder()
            .setAuthor(`🐍Venom Gen🐍`)
            .addField(`Email:`, emailAddress, false)
            .addField(`Proxy:`, `||${proxyDomain}||`, false)
            .addField(`Task Time:`, `${taskTime.toString()}s`, false)
            .addField(`Phone Region:`, `${this.taskCountry}`, false)
            .setFooter(`Venom Gen`)
            .setThumbnail(this.image)
            .setTimestamp();
            embed.setTitle(`🎉Successful Nike Account Created🎉`);
            embed.setColor(`#00fa00`)
        const universal = new MessageBuilder()
            .setAuthor(`🐍Venom Gen🐍`)
            .addField(`Phone Region:`, `${this.countName}`, false)
            .addField(`Task Time:`, `${taskTime.toString()}s`, false)
            .setFooter(`Venom Gen • Account Created By ${user}`)
            .setThumbnail(this.image)
            .setTimestamp();
        universal.setTitle(`🎉Successful Nike Account Created🎉`);
        universal.setColor(`#00fa00`)
        this.user420success.send(embed);
        this.universalHook.send(universal);
    };

    sendFailed(emailAddress, taskTime, proxyDomain, reason) {
        const embed = new MessageBuilder()
            .setAuthor(`🐍Venom Gen🐍`)
            .addField(`Email:`, emailAddress, false)
            .addField(`Proxy:`, `||${proxyDomain}||`, false)
            .addField(`Reason:`, reason, false)
            .addField(`Task Time:`, `${taskTime.toString()}s`, false)
            .setFooter(`Venom Accounts`)
            .setThumbnail(this.image)
            .setTimestamp();
        embed.setTitle(`❌Failed To Create A Nike Account❌`);
        embed.setColor(`#ad0000`)
        this.user420failed.send(embed);
    };

    async genMact(page) {

        // Event Declaration
        let halfFrom;
        let basisEvents= [];
        let startEventsPt1 = [];
        let startEventsPt2 = [];
        let endEvents = [];
        let finalEvents = [];

        // Random delay
        let delayNum = Math.floor(Math.random() * (15 - 8) - 8); 

        // Generate from/to points
        let from = { 
            x: Math.random() * (this.viewWidth - 0) + 0,
            y: Math.random() * (this.viewHeight - 0) + 0
        };
        let to = {
            x: Math.random() * (this.viewWidth - 0) + 0,
            y: Math.random() * (this.viewHeight - 0) + 0
        };

        // Gen basis points and half starting point
        basisEvents = ghost.path(from, to);
        halfFrom = basisEvents[Math.floor((basisEvents.length - 1) / 2)];
        startEventsPt1 = ghost.path(from, halfFrom);
        startEventsPt2 = ghost.path(halfFrom, from);
        endEvents = ghost.path(from, to);
        finalEvents = ghost.path(to, from);

        // Execute starting points pt1
        for (let i = 0; i < startEventsPt1.length; i++) {
            await delay(delayNum);
            await page.mouse.move(startEventsPt1[i].x, startEventsPt1[i].y);
        };
        
        // Execute starting points pt2
        for (let i = 0; i < startEventsPt2.length; i++) {
            await delay(delayNum);
            await page.mouse.move(startEventsPt2[i].x, startEventsPt2[i].y);
        };
        
        // Execute basis points
        for (let i = 0; i< basisEvents.length; i++) {
            await delay(delayNum);
            await page.mouse.move(basisEvents[i].x, basisEvents[i].y);
        };

        // Execute ending points
        for (let i = 0; i< endEvents.length; i++) {
            await delay(delayNum);
            await page.mouse.move(endEvents[i].x, endEvents[i].y);
        };

        // Execute ending points
        for (let i = 0; i< finalEvents.length; i++) {
            await delay(delayNum);
            await page.mouse.move(finalEvents[i].x, finalEvents[i].y);
        };

        // Return last point
        return { x: finalEvents[finalEvents.length - 1].x, y: finalEvents[finalEvents.length - 1].y };

    };

    async humanClick(page, element, currentPosition) {
        let toPos = {};
        let lastPos;
        let xpath = false;
        let elementHandle;
        let mouseEvents = [];
        let fromPos = { x: currentPosition.x, y: currentPosition.y };
        if (element.split('/').includes('html')) xpath = true;
        if (xpath) {
            elementHandle = await page.$x(element);
            elementHandle = elementHandle[0];
        } else {
            elementHandle = await page.$(element);
        };
        let elementBox = await elementHandle.boxModel();
        let middle = { x: elementBox.content[0].x + (elementBox.content[2].x - elementBox.content[0].x) / 2 + Math.random() * (50 - 0), y: elementBox.content[0].y + (elementBox.content[2].y - elementBox.content[0].y) / 2 + Math.random() * (10 - 0) };
        if (element == '/html/body/div[3]/div/div[3]/div[2]/div/div/form/div[2]/div[4]/div/div/div/div[2]/button') middle.x -= 15;
        if (element == '/html/body/div[2]/div/div[7]/div/div/div/div/div[2]/a[1]') if (middle.y != 557) middle.y = 557;
        if (element == '/html/body/div[4]/div/div/div/div[5]/form/div[5]/input') middle.y -= 10;
        if (this.genderArr.includes(element) && this.emailType == true) middle.y;
        toPos.x = middle.x;
        toPos.y = middle.y;
        mouseEvents = ghost.path(fromPos, toPos);
        for ( let i = 0; i < mouseEvents.length; i++) {
            if (i == mouseEvents.length - 1) lastPos = { x: mouseEvents[i].x, y: mouseEvents[i].y };
            await delay(10);
            await page.mouse.move(mouseEvents[i].x, mouseEvents[i].y);
        };
        await page.mouse.click(lastPos.x, lastPos.y);
        return lastPos;
    };

    genCredentials() {
        let size = 8;
        let intEnd = Math.floor(Math.random() * (9999 - 1000) - 1000);
        let capLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
        let randCap = capLetters[Math.floor(Math.random() * (capLetters.length - 0) + 0)];
        this.firstNme = this.firstArr[Math.floor(Math.random() * this.firstArr.length)];
        this.lastNme = this.lastArr[Math.floor(Math.random() * this.lastArr.length)];
        if (this.emailType == true) {
            this.emailAddr = this.firstNme.replace('-', '_').replace(' ', '') + intEnd.toString() + this.catchAll;
        } else {
            this.emailAddr = this.email;
        };
        this.passWrd = Crypto.randomBytes(size).toString('base64').slice(0, size) + intEnd.toString() + this.symbArr[Math.floor(Math.random() * (this.symbArr.length - 0) + 0)] + randCap;
        let dobMnth = Math.floor(Math.random() * (12 - 1) + 1);
        if (dobMnth < 10) {
            dobMnth = '0' + dobMnth.toString();
        };
        let dobDay = Math.floor(Math.random() * (25 - 1) + 1);
        if (dobDay < 10) {
            dobDay = '0' + dobDay.toString();
        };
        let dobYear = Math.floor(Math.random() * (2003 - 1970) + 1970);
        this.dateOfBrth = dobMnth + dobDay + dobYear.toString();
    };

    returnCountry(id) {
        id = parseInt(id);
        return this.countNames[id];
    }

    getDilimeter(phoneNumber) {
        this.countryOpt = false;
        this.countryCode = false;
        let markedCountries5sim = [ 'United Kingdom', 'United States', 'Czech Republic', 'New Zealand', 'Saudi Arabia' ];
        let markedCountriesSms = [ 'South Africa', 'United States',  ]
        if (phoneNumber[0] == '+') {
            phoneNumber = phoneNumber.split('+')[1];
        };
        if (this.apiService == '5sim') {
            Object.keys(this.nikeCountries).forEach(key => {
                if (markedCountries5sim.includes(key.split('|')[1])) {
                    if (key.split('|')[2].toLowerCase() == this.taskCountry) {
                        this.countryCode = this.nikeCountries[key];
                        this.countryOpt = key.split('|')[0];
                    };
                } else {
                    if (key.split('|')[1].toLowerCase() == this.taskCountry)  {
                        this.countryCode = this.nikeCountries[key];
                        this.countryOpt = key.split('|')[0];
                    };
                };
            });
        } else {
            let smsCountry = this.returnCountry(this.taskCountry);
            Object.keys(this.nikeCountries).forEach(key => {
                if (markedCountriesSms.includes(key.split('|')[1])) {
                    if (smsCountry.toLowerCase() == key.split('|')[1].toLowerCase()) {
                        this.countryOpt = key.split('|')[0];
                        this.countryCode = this.nikeCountries[key];
                    };
                } else {
                    if (smsCountry.toLowerCase() == key.split('|')[1].toLowerCase()) {
                        this.countryOpt = key.split('|')[0];
                        this.countryCode = this.nikeCountries[key];
                    };
                };
            });

        };
        if (this.countryOpt == false || this.countryCode == false) {
            throw 'Error: Country cannot be found';
        } else {
            phoneNumber = phoneNumber.split(this.countryCode)[1];
            return phoneNumber;
        };
    };

    async smsBuy(apiKey) {
        let balance = await this.smsApi.checkBalance(apiKey);
        switch (balance) {
            case 'BAD_KEY':
                throw 'Error: Invalid key';
            case 'ERROR_SQL':
                throw 'Error: Sql error';
            case 'NO_BALANCE':
                throw 'Error: Insufficient funds';
            default: 
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Your balance is: ${chalk.green(balance)}!`));              
        };
        let number = await this.smsApi.orderNumber(apiKey, this.taskCountry);
        switch (number) {
            case 'BAD_KEY':
                throw 'Error: Invalid key';
            case 'ERROR_SQL':
                throw 'Error: Sql error';
            case 'NO_BALANCE':
                throw 'Error: Insufficient funds';
            case 'NOT_AVAILABLE':
                throw 'Error: Sold out';
            case 'NO_NUMBERS':
                throw 'Error: Sold out';
            default: 
                return { activation: number.split(':')[1], number: number.split(':')[2] };
            };
    };
    
    async fiveBuy(apiKey) {
        let balance = await this.fiveApi.checkBalance(apiKey);
        switch (balance) {
            case 'Error: Ordering number 400':
                throw 'Error: Unknownn 5sim balance query 400';
            case 'Error: Ordering number 401':
                throw 'Error: Unknownn 5sim balance query 401';
            default:
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] Your balance is: ${chalk.green(balance)}!`)); 
        };
        let number = await this.fiveApi.orderNumber(apiKey, this.taskCountry)
        switch (number) {
            case 'Error: Ordering number 400':
                throw 'Error: Unknownn 5sim balance query 400';
            case 'Error: Ordering number 401':
                throw 'Error: Unknownn 5sim balance query 401';
            default:
                return number;
                
        };
    };

    async verifyAccount(page, initPos) {
        let apiObj;
        let activation;
        let phoneNumber;
        let firstPos, secondPos, thirdPos, fourthPos;

        // Navigate top account settings
        await page.goto('https://www.nike.com/member/settings');
        await page.waitForSelector('[class="ncss-cta-primary-dark "]', { timeout: 5000 });
        firstPos = await this.humanClick(page, `[class="ncss-cta-primary-dark "]`, { x: Math.random() * (this.viewWidth - 0) + 0, y: Math.random() * (this.viewHeight - 0) + 0 });
        await page.waitForSelector(`[aria-label="Add Mobile Number"]`, { timeout: 5000 });
        secondPos = await this.humanClick(page, '/html/body/div[3]/div/div[3]/div[2]/div/div/form/div[2]/div[4]/div/div/div/div[2]/button', firstPos);

        // Purchase number
        if (this.apiService == '5sim') {
            console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}] `)} Purchasing a number from ${chalk.green(this.apiService)}...`));
            apiObj = await this.fiveBuy(this.apiKey);
            activation = apiObj.id;
            phoneNumber = apiObj.number;
        } else {
            console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Purchasing a number from ${chalk.green(this.apiService)}...`));
            apiObj = await this.smsBuy(this.apiKey);
            activation = apiObj.activation;
            phoneNumber = apiObj.number;
        };
        console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Your number is: ${chalk.green(phoneNumber)}!`));
        
        // Purchase number
        let status;
        let received = false;
        phoneNumber = this.getDilimeter(phoneNumber);
        
        // Select country
        try {
            await page.waitForSelector(`.country`, { timeout: 5000 });
            await page.select('.country', this.countryOpt.split('"')[1]);
            await eval(`page.evaluate((phoneNumber) => { document.querySelector('[placeholder="Mobile Number"]').value = phoneNumber; }, phoneNumber)`);
            secondPos = await this.humanClick(page, '/html/body/div[1]/div[1]/div/div[1]/div/div[10]/form/div[1]/div[1]/input', initPos);
        } catch(err) {
            console.log(err);
            await delay(99999);
        };
        
        // Wait 40 seconds to verify code
        let start = Date.now();
        let delayed = start += 40000;
        while (received = false && Date.now() < delayed) {
            await delay(2500);
            if (this.apiService == '5sim') {
                status = await this.fiveApi.waitForText(activation);
                switch (status) {
                    case 'Error: Waiting for text 400':
                        throw 'Error: Waiting for text 400';
                    case 'Error: Waiting for text 401':
                        throw 'Error: Waiting for text 401';
                    case 'Waiting':
                        console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Waiting for sms...`));
                    default:
                        received = true;
                        console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Sms received: ${chalk.green(status.trim())}!`));
                        thirdPos = await this.humanClick(page, '/html/body/div[1]/div[1]/div/div[1]/div/div[10]/form/div[1]/div[1]/div[1]/input', secondPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10))
                        fourthPos = await this.humanClick(page, `[class="checkbox"]`, thirdPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10));
                        await this.humanClick(page, `[value="CONTINUE"]`, fourthPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10));
                        console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Account verified!`));
                        await this.curPage.close();   
                };
            } else {
                status = await this.smsApi.waitForText(this.apiKey, activation);
                switch (status) {
                    case 'STATUS_WAIT_CODE':
                        console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Waiting for sms...`));
                    case 'BAD_KEY':
                        throw 'Error: Invalid key';
                    case 'NO_NUMBERS':
                        throw 'Error: Sold out';
                    default:
                        received = true;
                        console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Sms received: ${chalk.green(status.split(`:`)[2].trim())}!`));
                        thirdPos = await this.humanClick(page, '/html/body/div[1]/div[1]/div/div[1]/div/div[10]/form/div[1]/div[1]/div[1]/input', secondPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10))
                        fourthPos = await this.humanClick(page, `[class="checkbox"]`, thirdPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10));
                        await this.humanClick(page, `[value="CONTINUE"]`, fourthPos, Math.floor(Math.random() * (15 - 5) + 10), Math.floor(Math.random() * (20 - 10) + 10));
                        console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Account verified!`));
                        await delay(2500);
                        await this.curPage.close();   
                };
            };
        };
        
        // Handle whether or not account was made or not
        if (received == true) {
            let endTime = Date.now();
            let taskTime = (endTime - this.startTime) / 1000;
            if (this.proxyArr == 'Local') await this.sendSuccess(this.emailAddr, 'Local', taskTime);
            if (this.proxyArr != 'Local') await this.sendSuccess(this.emailAddr, this.proxyDomain, taskTime);
            let jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`));
            jsonData.Accounts.push({
                Email: this.emailAddr,
                Password: this.passWrd
            });
            await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\success.json`, JSON.stringify(jsonData, null, 4));
        } else {
            let endTime = Date.now();
            let taskTime = (endTime - this.startTime) / 1000;
            if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
            if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
            let jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
            jsonData.Accounts.push({
                Email: this.emailAddr,
                Password: this.passWrd
            });
            await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
            await this.curPage.close();
        };

    };

    async genAccounts() {
        try { 

            // Get's rid of source url in sources
            const puppeteer = addExtra(puppeteerVanilla);
            let plugins = [ SourceUrl() ];

            // Determine user agent
            let version = false;
            let gennedUa = null;
            let randVal = Math.floor(Math.random() * (3 - 0) + 0);
            if (randVal == 0) {
                while (version = false) {
                    let userAgent = new UserAgent({ 
                        platform: 'Win32' ,
                        deviceCategory: 'desktop'
                    });
                    try {
                        if (parseInt(userAgent.userAgent.split('Chrome/')[1].substring(0, 2)) > 89) version = true, gennedUa = userAgent.userAgent;
                    } catch(err) {};
                };
            } else if (randVal == 1) {
                gennedUa = this.validArr[Math.floor(Math.random() * (this.validArr.length - 0) + 0)]
            };

            // Mention user agent
            console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Using User-Agent: ${chalk.green(gennedUa)}`));

            // Init browser
            let browser;
            if (this.proxyArr == 'Local') {
                if (gennedUa != null) {
                    browser = await puppeteer.launch({
                        defaultViewport: null, 
                        executablePath: this.chromePath.replace('\\', '/'),
                        headless: false,
                        // ignoreDefaultArgs: ['--enable-automation'],
                        args: [
                            `--user-agent=${gennedUa}`,
                            `--window-size=${this.viewWidth},${this.viewHeight}`,
                            '--disable-blink-features=AutomationControlled'
                        ] 
                    });
                    let page = await browser.pages();
                    this.curPage = page[0];
                } else {
                    browser = await puppeteer.launch({
                        defaultViewport: null, 
                        executablePath: this.chromePath.replace('\\', '/'),
                        headless: false,
                        // ignoreDefaultArgs: ['--enable-automation'],
                        args: [
                            `--window-size=${this.viewWidth},${this.viewHeight}`,
                            '--disable-blink-features=AutomationControlled'
                        ] 
                    });
                    let page = await browser.pages();
                    this.curPage = page[0];
                };
            } else {
                if (gennedUa != null) {
                    let choiceProxy =  this.proxyArr[Math.floor(Math.random() * (this.proxyArr.length - 0) + 0)];
                    if (choiceProxy.endsWith('\r')) choiceProxy = choiceProxy.split('\r')[0];
                    try {
                        this.proxyDomain = choiceProxy.split(`:`)[0].toString() + `:` + choiceProxy.split(`:`)[1].toString();
                    } catch(err) { throw 'Proxy parsing error' }; 
                    this.proxyUser = choiceProxy.split(`:`)[2];
                    this.proxyPass = choiceProxy.split(`:`)[3];
                    browser = await puppeteer.launch({
                        defaultViewport: null, 
                        executablePath: this.chromePath.replace('\\', '/'),
                        headless: false,
                        // ignoreDefaultArgs: ['--enable-automation'],
                        args: [
                            `--user-agent=${gennedUa}`,
                            `--proxy-server=${this.proxyDomain}`,
                            `--window-size=${this.viewWidth},${this.viewHeight}`,
                            '--disable-blink-features=AutomationControlled'
                        ] 
                    });
                    let page = await browser.pages();
                    this.curPage = page[0];
                } else {
                    let choiceProxy =  this.proxyArr[Math.floor(Math.random() * (this.proxyArr.length - 0) + 0)];
                    console.log(choiceProxy);
                    if (choiceProxy.endsWith('\r')) choiceProxy = choiceProxy.split('\r')[0];
                    try {
                        this.proxyDomain = choiceProxy.split(`:`)[0].toString() + `:` + choiceProxy.split(`:`)[1].toString();
                    } catch(err) { throw 'Error: Proxy parsing error' }; 
                    this.proxyUser = choiceProxy.split(`:`)[2];
                    this.proxyPass = choiceProxy.split(`:`)[3];
                    browser = await puppeteer.launch({
                        defaultViewport: null, 
                        executablePath: this.chromePath.replace('\\', '/'),
                        headless: false,
                        // ignoreDefaultArgs: ['--enable-automation'],
                        args: [
                            `--proxy-server=${this.proxyDomain}`,
                            `--window-size=${this.viewWidth},${this.viewHeight}`,
                            '--disable-blink-features=AutomationControlled'
                        ] 
                    });
                    let page = await browser.pages();
                    this.curPage = page[0];
                };
            };

            // Display the proxy in use if not local
            if (this.proxyArr != 'Local') {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Using Proxy Domain: ${chalk.green(this.proxyDomain)}!`));
            } else {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Running on localhost!`));
            };

            // Activate plugins
            for (const plugin of plugins) {
                await plugin.onBrowser(browser);
            };
            for (const plugin of plugins) {
              await plugin.onPageCreated(this.curPage);
            };

            // Gen credentials
            this.genCredentials();

            // Create mouse object
            await this.curPage.evaluateOnNewDocument(() => {
                if (window !== window.parent)
                return;
                window.addEventListener(`DOMContentLoaded`, () => {
                    const box = document.createElement(`puppeteer-mouse-pointer`);
                    const styleElement = document.createElement(`style`);
                    styleElement.innerHTML = `
                    puppeteer-mouse-pointer {
                        pointer-events: none;
                        position: absolute;
                        top: 0;
                        z-index: 10000;
                        left: 0;
                        width: 20px;
                        height: 20px;
                        background: rgba(0,0,0,.4);
                        border: 1px solid white;
                        border-radius: 10px;
                        margin: -10px 0 0 -10px;
                        padding: 0;
                        transition: background .2s, border-radius .2s, border-color .2s;
                    }
                    puppeteer-mouse-pointer.button-1 {
                        transition: none;
                        background: rgba(0,0,0,0.9);
                    }
                    puppeteer-mouse-pointer.button-2 {
                        transition: none;
                        border-color: rgba(0,0,255,0.9);
                    }
                    puppeteer-mouse-pointer.button-3 {
                        transition: none;
                        border-radius: 4px;
                    }
                    puppeteer-mouse-pointer.button-4 {
                        transition: none;
                        border-color: rgba(255,0,0,0.9);
                    }
                    puppeteer-mouse-pointer.button-5 {
                        transition: none;
                        border-color: rgba(0,255,0,0.9);
                    }
                    `;
                    document.head.appendChild(styleElement);
                    document.body.appendChild(box);
                    document.addEventListener(`mousemove`, event => {
                        box.style.left = event.pageX + `px`;
                        box.style.top = event.pageY + `px`;
                        updateButtons(event.buttons);
                    }, true);
                    document.addEventListener(`mousedown`, event => {
                        updateButtons(event.buttons);
                        box.classList.add(`button-` + event.which);
                    }, true);
                    document.addEventListener(`mouseup`, event => {
                        updateButtons(event.buttons);
                        box.classList.remove(`button-` + event.which);
                    }, true);
                    function updateButtons(buttons) {
                        for (let i = 0; i < 5; i++)
                        box.classList.toggle(`button-` + i, buttons & (1 << i));
                    }
                }, false);
            });

            // Emulate timezone
            await this.curPage.emulateTimezone(this.timeZones[Math.floor(Math.random() * (this.timeZones.length - 0) + 0)]);

            // Define mouse positions
            let curPos, firstPos, secondPos, thirdPos, fourthPos; // fifthPos, sixthPos;

            // Navigate to nike register link and gen mact
            this.startTime = Date.now();
            try {
                await this.curPage.goto('https://www.nike.com/register', { timeout: 5000 });
                eval('this.curPage.evaluate(() => { window.scrollBy(0, 320); })');
                await this.genMact(this.curPage);
                curPos = await this.genMact(this.curPage);
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while navigating to homepage!`));
                await this.curPage.close();
            };

            // Attempt to submit email address
            try {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Submitting email address...`));
                await this.curPage.waitForSelector(`[placeholder="Email address"]`, { timeout: 5000 });
                firstPos = await this.humanClick(this.curPage, '/html/body/div[4]/div/div/div/div[5]/form/div[1]/input', curPos);
                await this.curPage.keyboard.type(this.emailAddr, { delay: Math.floor(Math.random() * (20 - 10) + 10) });
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Email has been submitted!`));
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while submitting email address!`));
                await this.curPage.close();
            };

            // Attempt to submit password
            try {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Submitting password...`));
                await this.curPage.waitForSelector('[placeholder="Password"]', { timeout: 5000 });
                await this.curPage.keyboard.press('Tab');
                await this.curPage.keyboard.type(this.passWrd, { delay: Math.floor(Math.random() * (20 - 10) + 10) });
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Password submitted!`));
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while submitting password!`));
                await this.curPage.close();
            };

            // Attempt to submit first name
            try {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Submitting first name...`));
                await this.curPage.waitForSelector(`[placeholder="First Name"]`, { timeout: 5000 });
                await this.curPage.keyboard.press('Tab');
                await this.curPage.keyboard.type(this.firstNme, { delay: Math.floor(Math.random() * (20 - 10) + 10) });
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} First name submitted!`));
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while submitting first name!`));
                await this.curPage.close();
            };

            // Attempt to submit last name
            try {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Submitting last name...`));
                await this.curPage.waitForSelector(`[placeholder="Last Name"]`, { timeout: 5000 });
                await this.curPage.keyboard.press('Tab');
                await this.curPage.keyboard.type(this.lastNme, { delay: Math.floor(Math.random() * (20 - 10) + 10) });
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Last name submitted!`));
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while submitting last name!`));
                await this.curPage.close();
            };

            // Attempt to submit dob
            try {
                console.log(chalk.yellow(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Submitting date of birth...`));
                await this.curPage.waitForXPath('/html/body/div[4]/div/div/div/div[5]/form/div[5]/input', { timeout: 5000 });
                await this.curPage.keyboard.press('Tab');
                secondPos = await this.humanClick(this.curPage, '/html/body/div[4]/div/div/div/div[5]/form/div[5]/input', firstPos);
                await this.curPage.keyboard.type(this.dateOfBrth, { delay: Math.floor(Math.random() * (20 - 10) + 10) });
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Date of birth submitted!`));
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while submitting date of birth!`));
                await this.curPage.close();
            };
            
            // Choose Gender
            try {
                thirdPos = await this.humanClick(this.curPage, this.genderArr[Math.floor(Math.random() * (this.genderArr.length - 0) + 0)], secondPos);
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Failed to choose a gender!`));
                await this.curPage.close();
            };

            // Press join now
            try {
                fourthPos = await this.humanClick(this.curPage, '/html/body/div[4]/div/div/div/div[5]/form/div[9]/input', thirdPos);
            } catch(err) {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Error while creating account!`));
                await this.curPage.close();
            };
            
            // Check if account was made or not
            let endTime;
            let taskTime;
            let jsonData;
            let curUrl;
            let attempts = 0;
            let accountMade = false;
            let prevUrl = 'https://www.nike.com/register';
            while (attempts != 5 && accountMade != true) {
                await delay(2500)
                curUrl = this.curPage.url();
                if (curUrl != prevUrl) {
                    accountMade = true;
                } else {
                    attempts += 1;
                };
            };

            // Handle failed account
            if (attempts == 5) {
                endTime = Date.now();
                taskTime = (endTime - this.startTime) / 1000;
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Failed to create account!`));
                if (this.proxyArr == 'Local') {
                    this.sendFailed(this.emailAddr, taskTime, 'Local', 'Anti-Bot')
                } else {
                    this.sendFailed(this.emailAddr, taskTime, this.proxyDomain, 'Anti-Bot')
                };
                await this.curPage.close();
            };
            
            // Handle init success
            if (accountMade == true) {
                console.log(chalk.green(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Account created!`));
            };

            // Check if using catchall or email
            if (this.emailType != true) {
                try {
                    let newArr = [];
                    let emailData = fs.readFileSync(`${process.env.APPDATA}\\Venom\\Data\\Other\\Emails\\${this.emailFile}.txt`);
                    emailData.toString().split('\n').forEach(line => {
                        if (line.trim() != undefined || line == this.emailAddr) {
                            newArr.push(line);
                        };
                    });
                    fs.unlinkSync(`${process.env.APPDATA}\\Venom\\Data\\Other\\Emails\\${this.emailFile}.txt`);
                    fs.writeFileSync(`${process.env.APPDATA}\\Venom\\Data\\Other\\Emails\\${this.emailFile}.txt`, newArr.join('\n'));
                } catch(err) {
                    throw 'Error: Removing email';
                };
            };

            // Buy number from given provider
            try {
                await this.verifyAccount(this.curPage, fourthPos);
            } catch(err) {
                switch (err) {
                    case 'Error: Invalid key':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] Your api key seems to be invalid!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Sql error':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] An error has opccured with Sms Activate!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Insufficient funds':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] You do not have enough credits to purchase a number at this time!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Sold out':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} The chosen country has ran out of numbers at this time!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Sold out number');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Sold out number');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Country cannot be found':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} The chosen country is no longer supported!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Waiting for text 400':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] There was an error while purchasing your number!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Waiting for text 401':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] There was an error while purchasing your number!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    case 'Error: Selecting country':
                        console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}}`)}] There was an error while selecting country!`));
                        endTime = Date.now();
                        taskTime = (endTime - this.startTime) / 1000;
                        if (this.proxyArr == 'Local') await this.sendFailed(this.emailAddr, 'Local', taskTime, 'Failed to verify');
                        if (this.proxyArr != 'Local') await this.sendFailed(this.emailAddr, this.proxyDomain, taskTime, 'Failed to verify');
                        jsonData = JSON.parse(fs.readFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`));
                        jsonData.Accounts.push({
                            Email: this.emailAddr,
                            Password: this.passWrd
                        });
                        await fs.writeFileSync(`${process.env.APPDATA}\\VenomGen\\Data\\Accounts\\failed.json`, JSON.stringify(jsonData, null, 4));
                        await this.curPage.close();
                    default:
                        throw err;
                };
            };

        } catch(err) {
            if (err == 'Error: Protocol error (Runtime.callFunctionOn): Target closed.') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Browser closed unexpectedly!`));
                await delay(2500);
            } else if (err == 'Error: Protocol error: Connection closed. Most likely the page has been closed.') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Browser closed unexpectedly!`));
                await delay(2500);
            } else if (err == 'Error: Protocol error (Page.navigate): Session closed. Most likely the page has been closed.') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Browser closed unexpectedly!`));
                await delay(2500);
            } else if (err == 'Error: Navigation failed because browser has disconnected!') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} Browser closed unexpectedly!`));
                await delay(2500);
            } else if (err == 'Error: Removing email') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} An error occurred while removing a used email!`));
                await this.curPage.close()
                await delay(2500);
            } else if (err == 'Error: Proxy parsing error') {
                console.log(chalk.red(`* ${chalk.magenta(`[Task ${this.taskNum}]`)} An error occurred while parsing your proxies, please check proxies!`));
                await this.curPage.close()
                await delay(2500);
            } else {
                console.log(err);
                await delay(99999);
            }
        };
    };

};

// Init function
async function startTasks(email, apiKey, taskNum, emailType, catchAll, emailFile, apiService, taskCountry, userHookSuccess, userHookFailed, chromePath, proxyArr) {
    let Nike = new NikeGen(email, apiKey, taskNum, emailType, catchAll, emailFile, apiService, taskCountry, userHookSuccess, userHookFailed, chromePath, proxyArr);
    await Nike.genAccounts();
    return;
};
 
// export for other files
module.exports = startTasks;