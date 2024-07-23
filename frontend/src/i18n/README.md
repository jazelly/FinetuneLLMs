# Internationalization (i18n)

This directory contains the internationalization (i18n) files for this project.

## File Structure

```
├── [  24]  README.md
├── [   0]  README_CN.md
├── [ 704]  en-US
│   ├── [2.4K]  app-annotation.ts
│   ├── [5.2K]  app-api.ts
│   ├── [ 16K]  app-debug.ts
│   ├── [2.1K]  app-log.ts
│   ├── [5.3K]  app-overview.ts
│   ├── [1.9K]  app.ts
│   ├── [4.1K]  billing.ts
│   ├── [ 17K]  common.ts
│   ├── [ 859]  custom.ts
│   ├── [5.7K]  dataset-creation.ts
│   ├── [ 10K]  dataset-documents.ts
│   ├── [ 761]  dataset-hit-testing.ts
│   ├── [1.7K]  dataset-settings.ts
│   ├── [2.0K]  dataset.ts
│   ├── [ 941]  explore.ts
│   ├── [  52]  layout.ts
│   ├── [2.3K]  login.ts
│   ├── [  52]  register.ts
│   ├── [2.5K]  share-app.ts
│   └── [2.8K]  tools.ts
├── [1.6K]  i18next-config.ts
├── [ 634]  index.ts
├── [4.4K]  language.ts
```

We use English as the default language. The i18n files are organized by language and then by module. For example, the English translation for the `app` module is in `en-US/app.ts`.

If you want to add a new language or modify an existing translation, you can create a new file for the language or modify the existing file. The file name should be the language code (e.g., `zh-CN` for Chinese) and the file extension should be `.ts`.

For example, if you want to add french translation, you can create a new folder `fr-FR` and add the translation files in it.

By default we will use `LanguagesSupported` to determine which languages are supported. For example, in login page and settings page, we will use `LanguagesSupported` to determine which languages are supported and display them in the language selection dropdown.

## Example

1. Create a new folder for the new language.

```
cp -r en-US fr-FR
```

2. Modify the translation files in the new folder.

3. Add type to new language in the `language.ts` file.

```typescript
export type I18nText = {
  'en-US': string;
  'zh-Hans': string;
};
```

4. Add the new language to the `language.ts` file.

```typescript

export const languages = [
  {
    value: 'en-US',
    name: 'English(United States)',
    example: 'Hello, Dify!',
    supported: true,
  },
  {
    value: 'zh-Hans',
    name: '简体中文',
    example: '你好，Dify！',
    supported: true,
  },
  // Add your language here 👇
  ...
  // Add your language here 👆
]
```

5. Don't forget to mark the supported field as `true` if the language is supported.

6. Sometime you might need to do some changes in the server side. Please change this file as well. 👇
   https://github.com/langgenius/dify/blob/61e4bbabaf2758354db4073cbea09fdd21a5bec1/api/constants/languages.py#L5

That's it! You have successfully added a new language to the project. If you want to remove a language, you can simply delete the folder and remove the language from the `language.ts` file.
