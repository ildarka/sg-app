# sg-app

TODO: Описание …
Принципы

## TODO Client
+ Заменить в sega2 fontawesome на materialdesignicons
+ Рефакторинг клиентского скрипта api, для поддержки реконнектов
+ Добавить проверку перед отправкой (невалидный JSON)

+ Добивить таску с вотчером за папками build-tasks и config. Действие — ребилд и рестарт приложения

+ Проверить адекватность remove

+ Добавить token inject 

+ Механизм подписки: Subscribe, event + notification

+ Хранимка для register и login



## API first
+ Описание API ./config/api/*.yaml
+ Генерация кода (серверный + клиентский API) ./build-tasks/codegen-templates
+ Live API testing http://localhost:3000/dev

## Транспорт
JSONRPC2 over Websockets.
npm jsonrpc-ws

## Данные
Данные храняться в PostgreSQL в виде jsonb (PostgreSQL v. > 9.4).
Для работы с базой используется библиотека Рона Коннери massive.js

## Сборка без gulp
Использовать чистый npm

## Стили
LESS. Sega2. Линтеры + CSSComb

## Компонентный подход
AngularJS components — текущий подход

