
// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { fetchMails } from "../utils/MsGraphApiCall";
import {Cache, useCache} from "../hooks/useCache";

const fetchMailID = async (id) =>{
    return {};
}
const Mail = ({id}) =>{
    const {instance, inProgress} = useMsal();
    const [mail] = useCache(["mails", id], fetchMailID, {
        enable: inProgress === InteractionStatus.None,
        initialData: ()=>{
            const mails = Cache.get(["mails"]);
            return mails[id];
        },
        onSuccess: (mail)=>{
            const entry = Cache.get(["mails"]);
            entry.data[mail.id] = mail;
        }
    });
    return (<div style={{
        margin: "1rem",
        padding: "1rem",
        background: "gray"
    }}>
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{marginRight: "1rem"}}>Subject:</div>
            <div style={{fontWeight: "bold", color: "black"}}>{mail?.subject}</div>
        </div>
        <div>
            {mail?.body?.content || mail?.bodyPreview}
        </div>

    </div>);
}

//can be accessed from outside not attached to React
function useFetch(cacheKey, fetcher) {
    const {instance, inProgress} = useMsal();
    const [graphData] = useCache(cacheKey, fetcher, {
        enable:inProgress === InteractionStatus.None,
        onError: (error)=>{
            if (error instanceof InteractionRequiredAuthError) {
                instance.acquireTokenRedirect({
                    ...loginRequest,
                    account: instance.getActiveAccount()
                });
            }
        }
    });

    // 1. cache slices being observed
    // 2. still tied to rendering
    return [graphData];
}

const MailList = () => {
    const [graphData] = useFetch(["mails"], fetchMails);

    return (
        <div style={{display: "flex", flexBasis: "100%"}}>
            { graphData ? <div style={{
                display: "flex",
                flexDirection: "column",
                background: "black",
                color: 'white'
            }}>
                {graphData?.value.map((mail)=>{
                    return <Mail key={mail.id} mail={mail}/>
                })}
            </div> : null }
        </div>
    );
};

export function Outlook() {
    const authRequest = {
        ...loginRequest
    };

    return (
        <MsalAuthenticationTemplate 
            interactionType={InteractionType.Popup} 
            authenticationRequest={authRequest} 
            errorComponent={ErrorComponent} 
            loadingComponent={Loading}
        >
            <MailList />
        </MsalAuthenticationTemplate>
      )
};