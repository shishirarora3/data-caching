import { useEffect, useState } from "react";
import ReactJson from 'react-json-view'
// Msal imports
import { MsalAuthenticationTemplate, useMsal } from "@azure/msal-react";
import { InteractionStatus, InteractionType, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "../authConfig";

import { Loading } from "../ui-components/Loading";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { fetchMails } from "../utils/MsGraphApiCall";


const Mail = ({mail}) =>{
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
            {mail?.bodyPreview}
        </div>

    </div>);
}

const Cache = {

};
//can be accessed from outside not attached to React
function useFetch(cacheKey, fetcher) {
    const {instance, inProgress} = useMsal();
    const [graphData, setGraphData] = useState(null);
    Cache[cacheKey] = [
        graphData,
        fetcher
    ];
    useEffect(() => {
        if (!graphData && inProgress === InteractionStatus.None) {
            fetcher().then(response => {
                Cache[cacheKey] = [response, fetcher];
                setGraphData(response);
            }).catch((e) => {
                if (e instanceof InteractionRequiredAuthError) {
                    instance.acquireTokenRedirect({
                        ...loginRequest,
                        account: instance.getActiveAccount()
                    });
                }
            });
        }
    }, [inProgress, graphData, instance, fetcher, cacheKey]);
    // 1. cache slices being observed
    // 2. still tied to rendering
    return [Cache[cacheKey], setGraphData];
}

const MailList = () => {
    const [graphData, setGraphData] = useFetch(["mails"], fetchMails);

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