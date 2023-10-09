const fs = require('fs');

const templates = {
    index: fs.readFileSync(`${__dirname}/../index.html`, 'utf-8'),
    notFound: fs.readFileSync(`${__dirname}/../views/shared/not-found.html`, 'utf-8'),
    accessDenied: fs.readFileSync(`${__dirname}/../views/shared/access-denied.html`, 'utf-8'),
    users: {
        index: fs.readFileSync(`${__dirname}/../views/users/list/html/index.html`, 'utf-8'),
        table: fs.readFileSync(`${__dirname}/../views/users/list/html/table.html`, 'utf-8'),
        userDetails: fs.readFileSync(`${__dirname}/../views/users/list/html/user-details.html`, 'utf-8'),
    },
    userDetails: fs.readFileSync(`${__dirname}/../views/users/details/index.html`, 'utf-8'),
    auth: fs.readFileSync(`${__dirname}/../views/auth/html/index.html`, 'utf-8')
};

const replaceTemplate = (tempHtml, element) => {
    const replacements = {
        "{%ID%}": element.id,
        "{%FIRST_NAME%}": element.firstName,
        "{%LAST_NAME%}": element.lastName,
        "{%GENDER%}": element.gender,
        "{%BIRTH_DATE%}": element.birthDate,
        "{%EMAIL%}": element.email,
        "{%USER_NAME%}": element.username,
        "{%IP%}": element.ip
    };

    let output = tempHtml;
    for (const [key, value] of Object.entries(replacements)) {
        output = output.replace(new RegExp(key, "g"), value);
    }

    return output;
};

const replaceDefaultRoute = (template, defaultRoute) => {
    return template.replace(/{%DEFAULT_ROUTE%}/g, defaultRoute);
};

module.exports = {
    templates,
    replaceTemplate,
    replaceDefaultRoute
};