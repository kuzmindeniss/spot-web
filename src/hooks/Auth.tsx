import React, { createContext, useContext, useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { IAuthContext, IAuthState } from "src/types";


const SPOTIFY_SCOPES: string[] = [
    "ugc-image-upload",
    // "playlist-modify-private", 
    "playlist-read-private",
    // "playlist-modify-public",
    "playlist-read-collaborative",
    // "user-read-private",
    // "user-read-email",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    // "user-library-modify",
    "user-library-read",
    "user-read-playback-position",
    // "user-read-recently-played",
    // "user-top-read",
    "app-remote-control",
    // "streaming",
    // "user-follow-modify",
    // "user-follow-read"
];

const CLIENT_ID = "93a39f9a00b84d9aa02f0b5855bedff8";
const RESPONSE_TYPE = "token";
const REDIRECT_URI = window.location.origin;
const SPOTIFY_SCOPES_STRING: string = SPOTIFY_SCOPES.join("%20");
const SHOW_DIALOG = true;
export const authUrl: string = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=${RESPONSE_TYPE}&redirect_uri=${REDIRECT_URI}&scope=${SPOTIFY_SCOPES_STRING}&show_dialog=${SHOW_DIALOG}`;


const AuthContext = createContext<IAuthContext | null>(null);

export function ProvideAuth({ children }) {
    const auth = useProvideAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

const useProvideAuth = () => {
    const [authState, setAuthState] = useState<IAuthState>({
        user: null,
        token: null,
        didUserInit: false,
    });
    
    const spotifyApi = new SpotifyWebApi();

    const initUserFromToken = () => {
        const token = new URLSearchParams( window.location.hash.substr(1) ).get('access_token');
        if (!token) return null;
        window.history.pushState({}, "", "/");
        return token;
    }

    const initUserFromCookies = () => {
        const token = Cookies.get('token');
        if (!token) return null;
        return token;
    }

    const initUser = () => {
        let token = initUserFromToken();
        if( !token ) token = initUserFromCookies();
        if (token) {
            // token = token ? token : '';
            spotifyApi.setAccessToken(token);
            spotifyApi.getMe().then(user => {
                if (!token) return;
                setAuthState({
                    token,
                    user,
                    didUserInit: true,
                });
                Cookies.set('token', token);
            }).catch((e) => {
                setAuthState((state) => {
                    return {
                        ...state,
                        didUserInit: true,
                    }
                })
                toast.error(e.message || e.responseText);
                clearTokenAndCookies();
            });
        } else {
            setAuthState((state) => {
                return {
                    ...state,
                    didUserInit: true,
                }
            })
        }
    }

    const clearTokenAndCookies = () => {
        Cookies.remove('token');
        setAuthState({
            user: null,
            token: null,
            didUserInit: true,
        });
        spotifyApi.setAccessToken(null);
    }

    const logout = () => {
        if (authState.token) {
            toast.success("You have successfully logged out");
        }
        clearTokenAndCookies();
    }

    useEffect(() => {
        initUser();
    }, []);

    // useEffect(() => {
    //     console.log(authState.user);
    // })

    return {
        token: authState.token,
        user: authState.user,
        didUserInit: authState.didUserInit,
        spotifyApi,
        logout,
    };
}