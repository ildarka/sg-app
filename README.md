# sg-app
sg-app — скелет для быстрого постороения простых web-интерфейсов на NodeJS + AngularJS.

## Стек
+ Сервер: NodeJS + Express + jsonrpc-ws (Websockets)
+ База данных: PostgreSQL > 9.5
+ Транспорт: JSONRPC2 + Websockets
+ Клиент: AngularJS, Less, Bower
+ Сборка: gulp

```
/build_tasks — Преобразователь yaml в json, кодегенерация (оформить в виде npm)
/config — Конфигурация проекта, описание API
/database — Хранимки для БД
/server — Серверный код
/server/public — эта папка автогенерится
```

## Тезисы
+ API first! Вся работа начинается с /config/config.yaml
+ Websockets

## Плюшки
+ Первичная генерация кода, например CRUD /build-tasks/codegen-templates
+ Встроенная система пользователей с системой ролей.
+ Живое тестирование API http://localhost:3000/dev

## Данные
Данные храняться в PostgreSQL (> 9.5) в jsonb.
Для работы с базой используется библиотека Рона Коннери massive.js

## Стили
LESS. Sega2. Линтеры + CSSComb

## Компонентный подход на клиенте
AngularJS components — текущий подход

