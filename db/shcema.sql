create database sgapp;

create table auth (
  id serial primary key,
  data jsonb
);

create table users (
  id serial primary key,
  data jsonb
);

create table agg (
  id serial primary key,
  data jsonb
);

