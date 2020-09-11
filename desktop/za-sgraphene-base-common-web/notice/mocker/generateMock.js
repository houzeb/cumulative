var faker = require('faker');
var fs = require('fs');

// faker.locale = 'en_US';

let extraServiceItemCounts = faker.random.number({ min: 2, max: 5 });
let extraServiceItemArr = [];
for (let i = 1; i <= extraServiceItemCounts; i++) {
    extraServiceItemArr.push({ code: i, value: faker.commerce.productName() });
}

let getTicketTypeCounts = faker.random.number({ min: 2, max: 5 });
let getTicketTypeArr = [];
for (let i = 1; i <= getTicketTypeCounts; i++) {
    getTicketTypeArr.push({ code: i, value: `${faker.commerce.productName()}-Ticket` });
}

let getProductNameCounts = faker.random.number({ min: 2, max: 5 });
let getProductNameArr = [];
for (let i = 1; i <= getProductNameCounts; i++) {
    getProductNameArr.push({ code: i, value: `${faker.commerce.productName()}-Ticket` });
}

let getClaimRegisteredByCounts = faker.random.number({ min: 2, max: 5 });
let getClaimRegisteredByArr = [];
for (let i = 1; i <= getClaimRegisteredByCounts; i++) {
    getClaimRegisteredByArr.push({ code: i, value: `${faker.commerce.productName()}-Ticket` });
}

let getWeatherCounts = faker.random.number({ min: 1, max: 9 });
let getWeatherCountsArr = [];
for (let i = 0; i <= getWeatherCounts; i++) {
    getWeatherCountsArr.push({
        time: `${10 + i}.00.00-${10 + i + 1}.00.00`,
        rainfall: faker.random.number({ min: 0, max: 1, precision: .2 }),
        temperature: `${faker.random.number({ min: 27, max: 33 })}.0`
    });
}

let getClaimCounts = faker.random.number({ min: 20, max: 100 });
var getClaimCountsArr = [];
for (var i = 0; i < getClaimCounts; i++) {
    let productNameRandom = faker.random.number({ min: 0, max: getProductNameCounts - 1 });
    let getClaimRegisteredByRandom = faker.random.number({ min: 0, max: getClaimRegisteredByCounts - 1 });
    getClaimCountsArr.push({
        claimNo: faker.random.number({ min: 100000000000, max: 200000000000 }),
        policyNo: faker.random.number({ min: 200000000000, max: 300000000000 }),
        productCode: getProductNameArr[productNameRandom].code,
        productName: getProductNameArr[productNameRandom].value,
        policyHolder: faker.name.findName(),
        email: faker.internet.email(),
        mobile: faker.phone.phoneNumber(),
        registeredBy: getClaimRegisteredByArr[getClaimRegisteredByRandom].code,
        registeredDesc: getClaimRegisteredByArr[getClaimRegisteredByRandom].value,
        registrationDate: new Date(faker.date.past()).getTime()
    });
}

let getPolicyRegistrationPageCounts = faker.random.number({ min: 20, max: 100 });
let getPolicyRegistrationPageArr = [];
for (var i = 0; i < getPolicyRegistrationPageCounts; i++) {
    const statsuArr = [{ code: 1, value: 'Effective' }, { code: 2, value: 'terminated' }];
    let random = faker.random.number({ min: 0, max: 1 });
    let productNameRandom = faker.random.number({ min: 0, max: getProductNameCounts - 1 });
    let getClaimRegisteredByRandom = faker.random.number({ min: 0, max: getClaimRegisteredByCounts - 1 });
    getPolicyRegistrationPageArr.push({
        policyNo: faker.random.number({ min: 200000000000, max: 300000000000 }),
        productCode: getProductNameArr[productNameRandom].code,
        productName: getProductNameArr[productNameRandom].value,
        policyHolder: faker.name.findName(),
        email: faker.internet.email(),
        mobile: faker.phone.phoneNumber(),
        registeredBy: getClaimRegisteredByArr[getClaimRegisteredByRandom].code,
        registeredDesc: getClaimRegisteredByArr[getClaimRegisteredByRandom].value,
        registrationDate: new Date(faker.date.past()).getTime(),
        "forcedDate": new Date(faker.date.past()).getTime(),
        "statusDesc": statsuArr[random].value,
        "status": statsuArr[random].code
    });
}

let obj = {
    "getPolicyRegistrationPage": getPolicyRegistrationPageArr,
    "getWeather": getWeatherCountsArr,
    "extraServiceItem": extraServiceItemArr,
    "getTicketType": getTicketTypeArr,
    "getProductName": getProductNameArr,
    "getClaimRegisteredBy": getClaimRegisteredByArr,
    "getClaim": getClaimCountsArr
}

fs.writeFileSync(`${__dirname}/mockData.json`, JSON.stringify(obj, null, 4));