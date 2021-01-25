import i18nTranslate_zh from './zh';

const i18nMap: any = {
  zh: i18nTranslate_zh,
};

export default function getI18nTranslate(
  i18n: string,
): (template: string, replacements: { [index: string]: string }) => any {
  const i18nTranslate: any = i18nMap[i18n];
  return function customTranslate(template, replacements) {
    replacements = replacements || {};

    // Translate
    template = i18nTranslate[template] || template;

    // Replace
    return template.replace(/{([^}]+)}/g, function (_: string, key: string) {
      return replacements[key] || '{' + key + '}';
    });
  };
}
