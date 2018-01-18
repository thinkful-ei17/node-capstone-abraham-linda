'use strict';

require('dotenv/config');
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/sharing-is-caring';
exports.DATABASE_URL_TEST = process.env.DATABASE_URL_TEST || 'mongodb://localhost/sharing-is-caring-test';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY;