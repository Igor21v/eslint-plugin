# Eslint plugin для FSD

### Плагин для Eslint предназначенный для строгого контроля главных архитектурных принципов [Feature sliced design](https://feature-sliced.design/docs/get-started/tutorial)

### Содержит 3 правила:

## _1. path-checker - запрещает использовать абсолютные импорты в рамках одного модуля_

Возможна конфигурация в .eslintrc.js элиаса используемого в проекте перед указанием абсолютного пути:

```
'igor21v/path-checker': ['error', { alias: '@' }],
```

Имеет автофикс

## _2. layer-imports - проверяет корректность использования слоев с точки зрения FSD (например widgets нельзя использовать в features и entitites)_

Возможна конфигурация в .eslintrc.js элиаса используемого в проекте перед указанием абсолютного пути а также добавление исключения из правила:

```
        'igor21v/layer-imports': [
            'error',
            {
                alias: '@',
                ignoreImportPatterns: ['**/StoreProvider', '**/testing'],
            },
        ],
```

## _3. public-api-imports - разрешает импорт из других модулей только из public api._

Возможна конфигурация в .eslintrc.js элиаса используемого в проекте перед указанием абсолютного пути а также добавление исключения из правила:

```
'igor21v/public-api-imports': [
            'error',
            {
                alias: '@',
                testFilesPatterns: [
                    '**/*.test.*',
                    '**/*.story.*',
                    '**/StoreDecorator.tsx',
                    '**/tests.ts',
                ],
            },
        ],
```

Имеет автофикс
