const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  hi: () => import("./dictionaries/hi.json").then((module) => module.default),
  mr: () => import("./dictionaries/mr.json").then((module) => module.default),
};

export const getDictionary = async (locale) =>
  dictionaries[locale]();
