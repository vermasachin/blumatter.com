## Blumatter App Architecture

Blumatter app has 2 major components - 

* Database - Postgresql 9.4 or higher
* Server - Node.js 6.1.0 or higher

Database is defined in the sql file under */project/core/models/create.sql. The Node.js app has these major components - 

* Models - under */project/core/models/*
* API - under */project/api/*
* Public front-end files - under */project/public/*
    + HTML Files
    + JS
    + CSS
* Tests - under */project/tests/*
* Configuration - Managed in */project/config.json*
