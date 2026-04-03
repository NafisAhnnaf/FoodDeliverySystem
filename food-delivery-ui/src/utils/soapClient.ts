import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const objToXml = (obj: any): string => {
    if (Array.isArray(obj)) {
        // For arrays, we don't wrap them in a parent tag here because 
        // JAX-WS expects repeated tags for List parameters.
        return obj.map(item => objToXml(item)).join('');
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj)
            .map(([key, val]) => `<${key}>${objToXml(val)}</${key}>`)
            .join('');
    }

    return String(obj);
};
const parser = new XMLParser({
    ignoreAttributes: true,
    parseTagValue: false,
    trimValues: true,
    // Forces these keys to always be arrays to avoid .map() errors in React
    isArray: (name) => ["return", "menu", "menus", "searchMatches", "menuItem", "menuItems", "items", "order", "reviews"].includes(name)
});

// Create a dedicated axios instance for SOAP
const soapApi = axios.create({
    headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': '""'
    }
});

// --- THE INTERCEPTOR ---
// This runs before every single request sent by soapApi
soapApi.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export interface SoapParams {
    [key: string]: any;
}

/**
 * Generic SOAP Client for JAX-WS with automatic Token Injection
 */
export const callSoapAction = async <T = any>(
    url: string,
    action: string,
    params: SoapParams = {}
): Promise<T | null> => {

    const paramXml = Object.entries(params)
        .map(([key, val]) => {
            if (Array.isArray(val)) {
                return val.map(item => `<${key}>${objToXml(item)}</${key}>`).join('');
            }
            return `<${key}>${objToXml(val)}</${key}>`;
        })
        .join('');

    const envelope = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:com="http://controllers.swe4302.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <com:${action}>${paramXml}</com:${action}>
       </soapenv:Body>
    </soapenv:Envelope>`;

    try {
        // We use the 'soapApi' instance here, so the interceptor is applied automatically
        const response = await soapApi.post(url, envelope);
        const jsonObj = parser.parse(response.data);

        const body = jsonObj['S:Envelope']?.['S:Body'] || jsonObj['soapenv:Envelope']?.['soapenv:Body'];
        const responseWrapper = body?.[`ns2:${action}Response`] || body?.[`${action}Response`];
        const result = responseWrapper?.return;

        // Clean up: If it's a single-item array containing a primitive, return the primitive
        if (Array.isArray(result) && result.length === 1 && typeof result[0] !== 'object') {
            return result[0] as T;
        }

        return result as T;
    } catch (error: any) {
        const fault = error.response ? parser.parse(error.response.data) : null;
        const faultString = fault?.['S:Envelope']?.['S:Body']?.['S:Fault']?.faultstring;

        throw new Error(faultString || error.message);
    }
};