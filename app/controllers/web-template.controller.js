const fs = require('fs');
const url = require('url');
const statusCode = require('../config/status-codes');
const { templates, replaceDefaultRoute, replaceTemplate } = require('../services/template');

const dataObj = JSON.parse(fs.readFileSync(`${__dirname}/../db/db.json`));

const webTemplateController = {

    listUsers: (req, res) => {
        const homeTableHtml = dataObj.map(el => replaceTemplate(templates.home.table, el)).join('');
        const tempDefaultRoute = templates.home.index
            .replace(/{%USER_DETAILS%}/g, templates.home.userDetails)
            .replace(/{%HOME_TABLE%}/g, homeTableHtml);

        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'List of Users'), tempDefaultRoute);

        res.status(statusCode.ok).end(updatedIndex);
    },

    getUserDetails: (req, res) => {
        const { query } = url.parse(req.url, true);
        try {
            const userDetailsObj = dataObj[query.id - 1];
            const tempDefaultRoute = replaceTemplate(templates.userDetails, userDetailsObj);

            const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'User Details'), tempDefaultRoute);

            res.status(statusCode.ok).end(updatedIndex);
        } catch {
            res.status(statusCode.notFound).end('<h3>Invalid ID</h3>');
        }
    },

    loginPage: (req, res) => {
        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, 'Login & Register'), templates.loginAndRegister);
        res.status(statusCode.ok).end(updatedIndex);
    },

    home: (req, res) => {
        res.redirect('/web/list');
    },

    getJsonDb: (req, res) => {
        res.status(statusCode.ok).json(dataObj);
    },

    notFound: (req, res) => {
        const updatedIndex = replaceDefaultRoute(templates.index.replace(/{%TITLE%}/g, '404 Not Found'), templates.notFound);
        res.status(statusCode.notFound).end(updatedIndex);
    }
};

module.exports = webTemplateController;
