const fs = require('fs');
const url = require('url');
const { statusCode } = require('../config/config');
const { templates, replaceDefaultRoute, replaceTemplate } = require('../services/template');

const dataObj = JSON.parse(fs.readFileSync(`${__dirname}/../db/db.json`));

const webTemplateController = {

    listOfUsersPage: (req, res) => {
        const userTableHtml = dataObj.map(el => replaceTemplate(templates.home.table, el)).join('');
        const userDetailsRoute = templates.home.index
            .replace(/{%USER_DETAILS%}/g, templates.home.userDetails)
            .replace(/{%HOME_TABLE%}/g, userTableHtml);

        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'List of Users'), userDetailsRoute);

        res.status(statusCode.ok).end(updatedIndex);
    },

    getUserDetailsPage: (req, res) => {
        const { query } = url.parse(req.url, true);
        try {
            const userDetailsObj = dataObj[query.id - 1];
            const userDetailsRoute = replaceTemplate(templates.userDetails, userDetailsObj);

            const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'User Details'), userDetailsRoute);

            res.status(statusCode.ok).end(updatedIndex);
        } catch {
            res.status(statusCode.notFound).end('<h3>User not found!</h3>');
        }
    },

    loginPage: (req, res) => {
        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'Login & Register'), templates.loginAndRegister);
        res.status(statusCode.ok).end(updatedIndex);
    },

    redirectToHomePage: (req, res) => {
        res.redirect('/web/list');
    },

    getJsonDb: (req, res) => {
        res.status(statusCode.ok).json(dataObj);
    },

    notFoundPage: (req, res) => {
        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, '404 Not Found'), templates.notFound);
        res.status(statusCode.notFound).end(updatedIndex);
    }
};

module.exports = webTemplateController;
