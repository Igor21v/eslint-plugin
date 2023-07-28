# eslint-plugin-eslint-plugin

Плагин для Eslint предназначенный для строгого контроля главных архитектурных принципов [Feature sliced design](https://feature-sliced.design/docs/get-started/tutorial)
Содержит 3 правила:

1. path-checker - запрещает использовать абсолютные импорты в рамках одного модуля
2. layer-imports - проверяет корректность использования слоев с точки зрения FSD (например widgets нельзя использовать в features и entitites)
3. public-api-imports - разрешает импорт из других модулей только из public api. Имеет auto fix
