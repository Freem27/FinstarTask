import { notification } from "antd";

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
		if (result.success === true) {
			return result.data as T;
		} else if (result.success === false) {
			notification.error({message: uri, description: result.message ?? 'Ошибка выполнения запроса', duration: 3})
		} else {
			throw result;
		}
	} catch (err) {
		if (err as BadModelError) {
			const badModelError = err as BadModelError;
			notification.error({message: uri, description: badModelError.title, duration: 3})	
			return;
		}
		notification.error({message: uri, description: 'Ошибка выполнения запроса', duration: 3})
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

interface BadModelError {
	title: string;
	errors: unknown[];
}

interface ApiResultModel {
	success: boolean,
	message?: string,
	data?: object,
}
