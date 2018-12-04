'use strict';

const { APIClient } = require('@envage/hapi-pg-rest-api');

const rp = require('request-promise-native').defaults({
  proxy: null,
  strictSSL: false
});

// Create API client
const client = new APIClient(rp, {
  endpoint: `${process.env.CRM_URI}/entity/{entity_id}/roles`,
  headers: {
    Authorization: process.env.JWT_TOKEN
  }
});

module.exports = client;
