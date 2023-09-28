"use client";
import '../styles/semiglobal.module.css';

import React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material";
import { Analytics } from '@vercel/analytics/react';
import { theme } from '../styles/theme';
import ClientOnly from './_clientOnly';

// import {
//   rsnUserIdVar,
//   userLicenseTypesVar,
// } from '../clientOnly/state/userVars';
// import ClientOnly from '../components/ClientOnly';
// import {theme} from '../styles/theme';
// import SupabaseProvider, {useSupabase} from './supabase/SupabaseProvider';
// import {useSupabaseSession} from './supabase/useSupabaseSession';

class RootErrorBoundary extends React.Component {
    state = { hasError: false };
    constructor(props: any) {
        super(props);
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    // componentDidCatch(error, errorInfo) {
    //   // You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
    // }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div
                    style={{
                        height: "100vh",
                        width: "100vw",
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "center",
                        justifyItems: "center",
                    }}
                >
                    <h1>Something went wrong.</h1>
                </div>
            );
        }

        //@ts-expect-error
        return this.props.children;
    }
}

function AppProviderWrapper({ children }: React.PropsWithChildren<{}>) {
    // const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // const { supabase } = useSupabase();

    // if (!sbUrl) throw new Error("No Supabase URL provided");

    // const apolloClient = useAsyncMemo(async () => {
    //     return createReasonoteApolloClient({
    //         uri: `${sbUrl}/graphql/v1`,
    //         async getApiKey() {
    //             return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    //         },
    //         async getToken() {
    //             // TODO: This should be the user's token, if they are logged in.
    //             return (await supabase.auth.getSession()).data.session?.access_token;
    //         },
    //     });
    // }, [sbUrl]);

    // // Create a new supabase browser client on every first render.
    // const [supabaseClient] = useState(() => createBrowserSupabaseClient())

    // Get the authToken
    // return apolloClient ? (
    //     <>
    //     {/* Setup the Apollo Provider */}
    //     {/* <ApolloProvider client={apolloClient}> */}
    //         {/* Sets a good CSS Baseline. */}
    //         <CssBaseline />
    //         {/* Sets up Vercel Analytics */}
    //         <Analytics />
    //         {/* Provides the MUI Theme */}
    //         <ThemeProvider theme={theme}>{children}</ThemeProvider>
    //     {/* </ApolloProvider> */}
    //     </>
    // ) : null;

    return <>
        {/* Setup the Apollo Provider */}
            {/* Sets a good CSS Baseline. */}
            <CssBaseline />
            {/* Sets up Vercel Analytics */}
            <Analytics />
            {/* Provides the MUI Theme */}
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </>
}

export function UserHandling({ children }: any) {
    // const { supabase } = useSupabase();
    // const session = useSupabaseSession();

    // ////////////////////////////////////////////////////////
    // // When the user changes, we must update the subscription var.
    // useAsyncEffect(async () => {
    //     // Get the user's rsn id.
    //     const { data: rsnUserId, error } = await supabase.rpc(
    //         "current_rsn_user_id"
    //     );

    //     console.log("current_rsn_user_id: ", rsnUserId);

    //     const setting = isString(rsnUserId) ? rsnUserId : null;

    //     rsnUserIdVar(setting);

    //     supabase.rpc("cur_user_stripe_customer_id").then(({ data, error }) => {
    //         console.log("cur_user_stripe_customer_id: ", data);
    //     });

    //     supabase
    //         .rpc("get_user_stripe_subs_short", {
    //             // mock: {
    //             //   id: 'hi',
    //             //   product_lookup_key: 'Reasonote-Free',
    //             //   current_period_start: undefined as any,
    //             //   current_period_end: undefined as any
    //             // }
    //         })
    //         .then(({ data, error }) => {
    //             if (error) {
    //                 console.error(error);
    //                 return;
    //             }

    //             const typesRet = z
    //                 .array(z.string())
    //                 .safeParse(data?.map((d: any) => d.stripe_product_lookup_key));

    //             if (!typesRet.success) {
    //                 console.warn("No subscription found for user");
    //                 userLicenseTypesVar([]);
    //             } else {
    //                 console.log("user license types are: ", typesRet.data);

    //                 userLicenseTypesVar(typesRet.data);
    //             }
    //         });
    // }, [session]);

    return <>{children}</>;
}

export function RSNTAppLayout({ children }: any) {
    return <div
        id="RSNT-APP"
        style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: theme.palette.background.default,
        }}
    >
        <RootErrorBoundary>
            {/* We run our app client-only, because it requires such */}
            <ClientOnly>
                {/* We inject our other providers. */}
                {/* <SupabaseProvider> */}
                    <AppProviderWrapper>
                        <UserHandling>
                            <div
                                id="RSNT-APP-INNER"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100vw",
                                    height: "100vh",
                                }}
                            >
                                {children}
                            </div>
                        </UserHandling>
                    </AppProviderWrapper>
                {/* </SupabaseProvider> */}
            </ClientOnly>
        </RootErrorBoundary>
    </div>
}

export function RootLayout({ children }: any) {
    // The entire app is wrapped in a very simple error boundary.
    return (
        <html lang="en">
            <body
                id="BODY"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    background: theme.palette.background.default,
                }}
            >
                {/* <RSNTAppLayout>{children}</RSNTAppLayout> */}
            {children}
            </body>
        </html>
    );
}

// do not cache this layout
export const revalidate = 0;
