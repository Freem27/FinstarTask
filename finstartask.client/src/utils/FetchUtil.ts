export type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";

export async function Fetch<T>(uri: string, method?: HTTPMethod, data?: object, alwaysQuery: boolean = false) {
	try {
    const encodedURI = encodeURI(uri);
    const useQuery = method === 'GET' || alwaysQuery;
    const fullURI = data && useQuery ? `${encodedURI}?${objectToUrlQuery(data as QueryObject)}` : encodedURI;

    let body: RequestInit['body'];
    if (!useQuery) {
      body = JSON.stringify(data);
    } else {
      body = undefined;
    }
    const response = await fetch(fullURI, {
			method: method || "GET",
			body: body,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
		});
		if (!response) {
			throw Error("response is empty")
		}

		const result = (await response.json()) as ApiResultModel;
		if (result.success) {
			return result.data as T;
		} else {
			throw result.message;
		}
	} catch {
    console.log('fetch error')
  }
}

export function objectToUrlQuery<T extends QueryObject>(obj: T): string {
	const list = Object
		.keys(obj)
		.map(key => obj[key] === undefined || obj[key] === null ? undefined : encode(key, obj[key]))
		.filter(s => s);
	return list.join("&");
}

export interface QueryObject {
	[key: string]: object
}

function encodeKeyValue(key: string, value: object): string {
	return `${encodeURI(key)}=${encodeURIComponent(value.toString())}`;
}

function encode(key: string, value: object): string {
	if (Array.isArray(value)) {
		return value
			.filter(e => e !== null && e !== undefined)
			.map(e => encodeKeyValue(key, e))
			.join('&');
	} else {
		return encodeKeyValue(key, value);
	}
}

interface ApiResultModel {
	success: boolean,
	message?: string,
	data?: object,
}
