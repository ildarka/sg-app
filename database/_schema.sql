CREATE DATABASE sgapp;

CREATE SCHEMA users;

CREATE TABLE users(
id serial,
body jsonb not null,
password text not null,  
created_at timestamptz default now(),
PRIMARY KEY (id)
);

CREATE INDEX "idx_search_users" gin on users (search);
CREATE INDEX "idx_users" gin jsonb_path_ops on users (body);

