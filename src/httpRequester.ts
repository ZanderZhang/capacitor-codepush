import { Http } from "code-push/script/acquisition-sdk";
import { Callback } from "./callbackUtil";


/**
 * XMLHttpRequest-based implementation of Http.Requester.
 */
export class HttpRequester implements Http.Requester {
    // TODO: use @capacitor-community/http

    private contentType: string | undefined;

    constructor(contentType?: string | undefined) {
        this.contentType = contentType;
    }

    public request(verb: Http.Verb, url: string, callbackOrRequestBody: Callback<Http.Response> | string, callback?: Callback<Http.Response>): void {
        var requestBody: string;
        var requestCallback: Callback<Http.Response> = callback!;

        if (!requestCallback && typeof callbackOrRequestBody === "function") {
            requestCallback = <Callback<Http.Response>>callbackOrRequestBody;
        }

        if (typeof callbackOrRequestBody === "string") {
            requestBody = <string>callbackOrRequestBody;
        }

        var xhr = new XMLHttpRequest();
        var methodName = this.getHttpMethodName(verb);
        if (methodName === null) return;

        xhr.onreadystatechange = function(): void {
            if (xhr.readyState === 4) {
                var response: Http.Response = { statusCode: xhr.status, body: xhr.responseText };
                requestCallback && requestCallback(null, response);
            }
        };
        xhr.open(methodName, url, true);
        if (this.contentType) {
            xhr.setRequestHeader("Content-Type", this.contentType);
        }

        xhr.setRequestHeader("X-CodePush-Plugin-Name", "capacitor-plugin-code-push");
        xhr.setRequestHeader("X-CodePush-Plugin-Version", "1.11.13");
        xhr.setRequestHeader("X-CodePush-SDK-Version", "2.0.6");
        xhr.send(requestBody);
    }

    /**
     * Gets the HTTP method name as a string.
     * The reason for which this is needed is because the Http.Verb enum corresponds to integer values from native runtime.
     */
    private getHttpMethodName(verb: Http.Verb): string | null {
        switch (verb) {
            case Http.Verb.GET:
                return "GET";
            case Http.Verb.DELETE:
                return "DELETE";
            case Http.Verb.HEAD:
                return "HEAD";
            case Http.Verb.PATCH:
                return "PATCH";
            case Http.Verb.POST:
                return "POST";
            case Http.Verb.PUT:
                return "PUT";
            case Http.Verb.TRACE:
            case Http.Verb.OPTIONS:
            case Http.Verb.CONNECT:
            default:
                return null;
        }
    }
}