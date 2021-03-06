import { Switch, Route, useHistory } from "react-router-dom";

// Material-UI imports
import Grid from "@material-ui/core/Grid";

// MSAL imports
import { MsalProvider } from "@azure/msal-react";
import { CustomNavigationClient } from "./utils/NavigationClient";

// Sample app imports
import { PageLayout } from "./ui-components/PageLayout";
import { Home } from "./pages/Home";
import { Outlook } from "./pages/Outlook";
import { Logout } from "./pages/Logout";

// Class-based equivalents of "Profile" component
import { ProfileWithMsal } from "./pages/ProfileWithMsal";
import { ProfileRawContext } from "./pages/ProfileRawContext";

function App({ pca }) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const history = useHistory();
  const navigationClient = new CustomNavigationClient(history);
  pca.setNavigationClient(navigationClient);

  return (
    <MsalProvider instance={pca}>
      <PageLayout>
          <Pages />
      </PageLayout>
    </MsalProvider>
  );
}

function Pages() {
  return (
    <Switch>
      <Route path="/">
        <Outlook />
      </Route>
    </Switch>
  )
}

export default App;
