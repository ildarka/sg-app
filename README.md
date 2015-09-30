# sg-app

TODO: Описание …
Принципы

## TODO Client
+ Рефакторинг клиентского скрипта api, для поддержки реконнектов


## API first
+ Описание API ./config/api/*.yaml
+ Генерация кода (серверный + клиентский API) ./build-tasks/codegen-templates
+ Live API testing http://localhost:3000/dev

## Транспорт
JSONRPC2 over Websockets.
npm jsonrpc-ws

## Данные
Данные храняться в PostgreSQL в виде jsonb (PostgreSQL v. > 9.5).
Для работы с базой используется библиотека Рона Коннери massive.js

## Сборка без gulp
Использовать чистый npm

## Стили
LESS. Sega2. Линтеры + CSSComb

## Компонентный подход
AngularJS components — текущий подход

