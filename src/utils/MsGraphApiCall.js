import { loginRequest, graphConfig } from "../authConfig";
import { msalInstance } from "../index";

export async function fetchMails() {
    const account = msalInstance.getActiveAccount();
    if (!account) {
        throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }

    const response = await msalInstance.acquireTokenSilent({
        ...loginRequest,
        account: account
    });

    const headers = new Headers();
    const bearer = `Bearer ${response.accessToken}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    return fetch("https://graph.microsoft.com/v1.0/me/messages", options)
        .then(response => response.json())
        .catch(error => console.log(error));
}

export function fetchMail(id){
    return async ()=> {
        const account = msalInstance.getActiveAccount();
        if (!account) {
            throw Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
        }

        const response = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: account
        });

        const headers = new Headers();
        const bearer = `Bearer ${response.accessToken}`;

        headers.append("Authorization", bearer);

        const options = {
            method: "GET",
            headers: headers
        };

        return fetch("https://graph.microsoft.com/v1.0/me/messages" + "/" + id, options)
            .then(response => response.json())
            .catch(error => console.log(error));
    }
}