# sg-app. Тезисы

## Данные
+ immutable
+ mutable

## Механизм подписки
+ Postgres: (Notification + message) при подписке на всю коллекцию.
changes() = Notification + (filter thru query) + message.
onAppend → message
message, for subscribtions -> filter(shema, message)
  get old_value
  get new_value
  compare new_value, old_value if changed => update message

+ RethinkDB: .changes()
+ Полная синхронизация моделей (для маллых данных)
+ Реализация на курсорах

## Подписка на часть данных
+ Имеет смысл при большом количестве данных
+ Сложность при изменяемых данных


## Синхронизация JS Model ←→ Server model
+ PouchDB + CouchDB (Нет возможности синхронизировать часть данных)
+ Модели в памяти и маппинг в базу
+ RethinkDB + changes() позволяет синхронизировать часть данных в напрвлении sever → client
+ Swarm. Пока нет маппинга в базу, долгое время был мёртв
+ ShareJS. Слабо развивается

## Текстовые поиск по всем моделям (нужен только когда данных много)
+ Postgresql — tsvector, fuzzy strmatch, trigramm index
+ Elasticserach. Дублирование данных
+ RethinkDB + Elasticserach river. Лишняя сущность

## Сборка без gulp
Использовать чистый npm

## ES6
es6to5 || babel

## Стили
LESS. Sega2. Линтеры + CSSComb

## Компонентный подход
AngularJS components — текущий подход || React

## Транспорт
SocketIO || Native Websockets

## Сервер
Express || Koa - проблемы с обёртками

## Одни и те же данные на сервере и клиенте
NodeJS

## API
+ JsonRPC2 + token
+ Описание API. JSON Schema || Swagger || Raml 
+ Генерация кода (серверный + клиентский API)

## Rights checker + model
Restricted access to models

## Выделенный модуль аутентификации
