export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export function filterProperties(raw: object, unallowed: string[]): object {
  return Object.keys(raw)
    .filter((key) => !unallowed.includes(key))
    .reduce((obj, key) => {
      // @ts-ignore
      obj[key] = raw[key];
      return obj;
    }, {});
}

export const isValidURL = (url: string): boolean => {
  const URLRegExp: RegExp = new RegExp(
    "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,4}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)"
  );

  return URLRegExp.test(url);
};
