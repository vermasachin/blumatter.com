/**
 * Author:  shani
 * Created: 28 Jul, 2018
 */

CREATE TABLE session (
    s           varchar(100),
    sess        json
);

CREATE TABLE client (
    name            varchar(50),
    email           varchar(50),
    phone           varchar(50)
);

CREATE TABLE expert (
    name            varchar(50),
    email           varchar(50),
    phone           varchar(50),
    location        varchar(50),
    cvfile          varchar(255),
    description     varchar(255),
    industry        varchar(50),
    skills          json,
    cvtext          text
    
);

CREATE TABLE project (
    name        varchar(100),
    brief       text,
    industry    varchar(50),
    skills      json
);

CREATE VIEW users as 
    SELECT name, email, 'client' as role from client
    UNION
    SELECT name, email, 'expert' as role from expert;