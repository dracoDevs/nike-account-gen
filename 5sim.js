const chalk = require('chalk');
const delay = require('delay');
const fetch = require('node-fetch');

class FiveApi {

    constructor() {
        this.countries = [
            'afghanistan', 
            'albania', 
            'algeria', 
            'angola', 
            'antiguaandbarbuda', 
            'argentina', 
            'armenia', 
            'austria', 
            'azerbaijan', 
            'bahrain', 
            'bangladesh', 
            'barbados', 
            'belarus', 
            'belgium', 
            'benin', 
            'bhutane', 
            'bih', 
            'bolivia', 
            'botswana', 
            'brazil', 
            'bulgaria', 
            'burkinafaso', 
            'burundi', 
            'cambodia', 
            'cameroon', 
            'canada', 
            'caymanislands', 
            'chad', 
            'colombia', 
            'congo', 
            'costarica', 
            'croatia', 
            'cyprus', 
            'czech', 
            'djibouti', 
            'dominicana', 
            'easttimor', 
            'ecuador', 
            'egypt', 
            'england', 
            'equatorialguinea', 
            'estonia', 
            'ethiopia', 
            'finland', 
            'france', 
            'frenchguiana', 
            'gabon', 
            'gambia', 
            'georgia', 
            'germany', 
            'ghana', 
            'guadeloupe', 
            'guatemala', 
            'guinea', 
            'guineabissau',
            'guyana', 
            'haiti', 
            'honduras', 
            'hungary', 
            'india', 
            'indonesia', 
            'iran', 
            'iraq', 
            'ireland', 
            'israel', 
            'italy', 
            'ivorycoast', 
            'jamaica', 
            'jordan', 
            'kazakhstan', 
            'kenya', 
            'kuwait', 
            'laos', 
            'latvia', 
            'lesotho', 
            'libya', 
            'lithuania', 
            'luxembourg', 
            'macau', 
            'madagascar', 
            'malawi', 
            'malaysia', 
            'maldives', 
            'mali', 
            'mauritania', 
            'mauritius', 
            'mexico', 
            'moldova', 
            'mongolia', 
            'montenegro', 
            'morocco', 
            'mozambique', 
            'myanmar', 
            'namibia', 
            'nepal', 
            'netherlands', 
            'newzealand', 
            'nicaragua', 
            'nigeria', 
            'oman', 
            'pakistan', 
            'panama', 
            'papuanewguinea', 
            'paraguay', 
            'peru', 
            'philippines', 
            'poland', 
            'portugal', 
            'puertorico', 
            'qatar', 
            'reunion', 
            'romania', 
            'russia', 
            'rwanda', 
            'saintkittsandnevis', 
            'saintlucia', 
            'saintvincentandgrenadines', 
            'salvador', 
            'saudiarabia', 
            'senegal', 
            'serbia', 
            'slovakia', 
            'slovenia', 
            'somalia', 
            'southafrica', 
            'spain', 
            'srilanka', 
            'sudan', 
            'suriname', 
            'swaziland', 
            'sweden', 
            'syria', 
            'taiwan', 
            'tajikistan', 
            'tanzania', 
            'thailand', 
            'tit', 
            'togo', 
            'tunisia', 
            'turkey', 
            'turkmenistan', 
            'uae', 
            'uganda', 
            'uruguay', 
            'usa', 
            'uzbekistan', 
            'venezuela', 
            'vietnam', 
            'yemen', 
            'zambia', 
            'zimbabwe'
        ];
    };

    async checkBalance(apiKey) {
        let resp = await fetch('https://5sim.net/v1/user/profile', { 
            method: 'GET',                
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Accept': 'application/json'
            } 
        });
        switch (resp.status) {
            case 200:
                let metaData = JSON.parse(resp.json());
                return metaData['balance'].trim();
            case 401:
                return 'Invalid api key';
        };
    };

    async getPricesStock() {
        try {
            let sortedArr = [];
            this.countries.forEach(country => {
                let resp = fetch(`https://5sim.net/v1/guest/prices?country=${country}&product=nike`, { method: 'GET', headers: { Accept: 'application/json' } });
                let metaData = jsonParse(resp.text());
                if (metaData['other'][0] != null) {
                    sortedArr.push({
                        country: country,
                        message: chalk.yellow(`Country: ${country} Price: ${metaData['other'][0].cost} Stock: ${metaData['other'][0].count}`)
                    });
                };
            });
            return sortedArr;
        } catch(err) {
            return 'Error: Get prices and stock';
        };
    };

    async orderNumber(apiKey, country) {
        try {
            let url = `https://5sim.net/v1/user/buy/activation/${country}/any/nike`;
            let resp = await fetch(url, { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` } });
            switch (resp.status) {
                case 200:
                    let metaData = JSON.parse(resp.json());
                    return { id: metaData.id, number: metaData.phone }
                case 400:
                    return 'Error: Ordering number 400'
                case 401:
                    return 'Error: Ordering number 401'
            };
        } catch(err) {
            return 'Error: Ordering number';
        };
    };

    async waitForText(id) {
        try {
            let url = `https://5sim.net/v1/user/check/$${id}`;
            let resp = await fetch(url, { method: 'GET', headers: { Accept: 'application/json', Authorization: `Bearer ${apiKey}` } });
            switch(resp.status) {
                case 200:
                    let metaData = JSON.parse(resp.json());
                    if (metaData.status == 'RECEIVED') {
                        return metaData.sms[0].code;
                    } else {
                        return 'Waiting';
                    };
                case 400:
                    return 'Error: Waiting for text 400';
                case 401:
                    return 'Error: Waiting for text 401';
            };
        } catch(err) {
            throw 'Error: Waiting for text';
        };
    };

};

module.exports = FiveApi;