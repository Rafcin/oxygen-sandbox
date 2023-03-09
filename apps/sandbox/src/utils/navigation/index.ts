import { ParsedUrlQuery, ParsedUrlQueryInput, stringify } from "querystring";
import { parse } from "url";

export function avoid(pathname: string, list: Array<string>): boolean {
  for (const path of list) {
    if (pathname.startsWith(path)) {
      return true;
    }
  }
  return false;
}

export const avoidpaths: Array<string> = ["/video"];

export function addQueryParamsToUrl(
  url: string,
  params: ParsedUrlQueryInput
): string {
  const queryString = stringify(params);

  // check if the original URL already has query parameters
  const separator = url.includes("?") ? "&" : "?";

  // combine the original URL and the new query string
  return `${url}${separator}${queryString}`;
}

export function hasQueryParam(url: string, paramName: string): boolean {
  const { query } = parse(url, true) as { query: ParsedUrlQuery };
  return Object.keys(query).includes(paramName);
}

export function getQueryParamByName(
  asPath: string,
  name: string
): string | null {
  const { query }: { query: ParsedUrlQuery } = parse(asPath, true);
  return query[name] ? String(query[name]) : null;
}
