const express = require("express");
const router = express.Router();
const async = require("async");
const axios = require("axios");

router.get("/", (req, res) => {
  const addresses = !Array.isArray(req.query.address)
    ? [req.query.address]
    : req.query.address;
  async.map(
    addresses,
    async address => {
      parseAddress = !/^(?:f|ht)tps?\:\/\//.test(address)
        ? "http://" + address
        : address;
      try {
        const response = await axios.get(parseAddress);
        const matches = response.data.match(/<title>(.*?)<\/title>/);
        return `${address} - ${matches[1]}`;
      } catch (e) {
        return `${address} - NO RESPONSE`;
      }
    },
    (err, results) => {
      if (err) throw err;
      res.render("title", { titles: results });
    }
  );
});

module.exports = router;
