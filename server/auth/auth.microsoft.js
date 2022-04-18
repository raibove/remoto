import msal from '@azure/msal-node'
//MSAL configuration
const msalConfig = {
    auth: {
        clientId: 'db29c5ec-6b88-4ce8-b1a4-0c1a6dc4ed05',
        // comment out if you use a multi-tenant AAD app
        authority: 'https://login.microsoftonline.com/common',
        redirectUri: 'http://localhost:8080'
    }
};
const msalRequest = { scopes: [] };
function ensureScope (scope) {
    if (!msalRequest.scopes.some((s) => s.toLowerCase() === scope.toLowerCase())) {
        msalRequest.scopes.push(scope);
    }
}
//Initialize MSAL client
const msalClient = new msal.PublicClientApplication(msalConfig);

// Log the user in
export async function signIn() {
    //const authResult = await msalClient.loginPopup(msalRequest);
    msalClient.loginPopup(msalRequest)
    .then(function (loginResponse) {
        accountId = loginResponse.account.homeAccountId;
        // Display signed-in user content, call API, etc.
    }).catch(function (error) {
        //login failure
        console.log(error);
    });
    sessionStorage.setItem('msalAccount', authResult.account.username);
}
//Get token from Graph
export async function getToken() {
    let account = sessionStorage.getItem('msalAccount');
    if (!account) {
        throw new Error(
            'User info cleared from session. Please sign out and sign in again.');
    }
    try {
        // First, attempt to get the token silently
        const silentRequest = {
            scopes: msalRequest.scopes,
            account: msalClient.getAccountByUsername(account)
        };

        const silentResult = await msalClient.acquireTokenSilent(silentRequest);
        return silentResult.accessToken;
    } catch (silentError) {
        // If silent requests fails with InteractionRequiredAuthError,
        // attempt to get the token interactively
        if (silentError instanceof msal.InteractionRequiredAuthError) {
            const interactiveResult = await msalClient.acquireTokenPopup(msalRequest);
            return interactiveResult.accessToken;
        } else {
            throw silentError;
        }
    }
}
