module.exports = app => {
    const puppe = require("../App/Scraping/scrap-index");

    var router = require("express").Router();

    router.post('/scrap', puppe.scrap);


    app.use("/gupy", router);
}