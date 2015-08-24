# sg-app. Тезисы

## Данные
+ immutable
+ mutable

## Механизм подписки
+ Postgres: Notification + message
+ RethinkDB: .changes()

## Подписка на часть данных
+ Имеет смысл при большом количестве данных
+ Реализация на курсорах
+ Сложность при изменяемых данных

## Синхронизация JS Model ←→ Server model
+ PouchDB + CouchDB (Нет возможности синхронизировать часть данных)
+ Модели в памяти и маппинг в базу
+ RethinkDB + changes() позволяет синхронизировать часть данных в напрвлении sever → client
+ Swarm. Пока нет маппинга в базу, долгое время был мёртв
+ ShareJS. Слабо развивается

## Текстовые поиск по всем моделям
+ Postgresql — tsvector, fuzzy strmatch, trigramm index
+ Elasticserach. Дублирование данных
+ RethinkDB + Elasticserach river. Лишняя сущность

## Сборка без gulp
Использовать чистый npm

## ES6
es6to5 || babel

## Стили
LESS. Линтеры

## Компонентный подход
AngularJS components — текущий подход || React

## Транспорт
SocketIO || Native Websockets

## Одни и те же данные на сервере и клиенте
NodeJS

## API
+ JsonRPC2 + token
+ Описание API JSON Schema, Yaml. 
+ Генерация кода 

## Rights checker + model
Restricted access to models

## Выделенный модуль аутентификации

