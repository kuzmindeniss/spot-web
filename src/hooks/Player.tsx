import React, {createContext, MutableRefObject, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./Auth";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { ILoadedDataState, IPlayer, IPlayerContext, IPlayerState, IWebPlaybackState, IWebPlaybackTrack } from "src/types";

const PlayerContext = createContext<IPlayerContext | null>(null);

export function ProvidePlayer({ children }) {
    const auth = useProvidePlayer();
    return <PlayerContext.Provider value={auth}>{children}</PlayerContext.Provider>;
}

export const usePlayer = () => {
    return useContext(PlayerContext);
};

const useProvidePlayer = () => {
    const auth = useAuth();
    const errors = {
        "initialization_error": "Fails to instantiate a player capable of playing content in the current environment. Most likely due to the browser not supporting EME protection",
        "authentication_error": "Access token invalid",
        "account_error": "User authenticated does not have a valid Spotify Premium subscription",
        "playback_error": "Loading and/or playing back a track failed"
    }
    const repeatMods: Array<"off" | "track" | "context"> = ["off", "track", "context"];
    const refWebPlaybackState: MutableRefObject<IWebPlaybackState | null> = useRef<IWebPlaybackState>(null);
    const [playerState, setPlayerState] = useState<IPlayerState>({
        spotifyApi: auth!.spotifyApi!,
        player: null,
        playerScript: null,
        deviceId: null,
        trackId: null,

        playerInfo: {
            isReady: false,
            isDraggingVolume: false,
            isDraggingPosition: false,
            isPaused: true,
            isShuffle: false,
            isRepeat: 0,
            volume: 0,
            playbackPosition: 0,
        },

        trackInfo: {
            id: null,
            img: null,
            uri: null,
            name: null,
            artist: null,
            artistId: null,
            artistUri: null,
            album: null,
            albumId: null,
            albumUri: null,
            duration: null,
        },
    });

    const [loadedData, setLoadedData] = useState<ILoadedDataState | null>(null);
    const [queryData, setQueryData] = useState<IWebPlaybackTrack[] | null>(null);

    const initRecommenations = () => {
        if(!auth || !auth.token) return;
        const seedsQuantity = 1;
        

        let genersSeedPromise = playerState.spotifyApi.getAvailableGenreSeeds();
        let topTracksPromise = playerState.spotifyApi.getMyTopTracks();
        let topArtistsPromise = playerState.spotifyApi.getMyTopArtists();
        let newReleasesPromise = playerState.spotifyApi.getNewReleases();

        Promise.all([genersSeedPromise, topTracksPromise, topArtistsPromise, newReleasesPromise]).then((data: [
            genres: SpotifyApi.AvailableGenreSeedsResponse, tracks: SpotifyApi.UsersTopTracksResponse, artists: SpotifyApi.UsersTopArtistsResponse, newReleases: SpotifyApi.ListOfNewReleasesResponse
        ]) => {
            const seedGenres = data[0].genres.slice(0, seedsQuantity);
            const seedTracks = data[1].items.slice(0, seedsQuantity).map(track => track.id);
            const seedArtists = data[2].items.slice(0, seedsQuantity).map(album => album.id);

            const newReleases = data[3].albums.items;

            playerState.spotifyApi.getRecommendations({
                seed_artists: seedArtists,
                seed_genres: seedGenres,
                seed_tracks: seedTracks,
            }).then((data) => {
                setLoadedData(state => {
                    return {
                        ...state,
                        recommendations: data.tracks,
                        newReleases: newReleases
                    }
                });
            });
        });
        
    }

    const setPlayer = (player: IPlayer) => {
        setPlayerState((state) => {
            return {
                ...state,
                player
            }
        });
    };

    const setPlayerScript = (playerScript: HTMLScriptElement) => {
        setPlayerState((state) => {
            return {
                ...state,
                playerScript
            }
        });
    };

    const setIsPlayerReady = (isReady: boolean) => {
        setPlayerState((state) => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    isReady
                }
            }
        });
    }

    const setIsDraggingVolume = (isDraggingVolume: boolean): void => {
        setPlayerState((state) => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    isDraggingVolume
                },
            }
        });
    }

    const setIsDraggingPosition = (isDraggingPosition: boolean): void => {
        setPlayerState((state) => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    isDraggingPosition
                },
            }
        });
    }


    const setPosition = (position: number) => {
        playerState.player!.seek(position);
    }

    const setVolume = (volume: number) => {
        setPlayerState((state) => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    volume
                }
            }
        });
        Cookies.set('volume', String(volume / 100));
        playerState.player!.setVolume(volume / 100);
    }

    const toggleRepeat = (): void => {
        if (!refWebPlaybackState.current) return;
        let newRepeat = refWebPlaybackState.current.repeat_mode + 1;
        if (newRepeat >= 2) newRepeat = 0;
        playerState.spotifyApi.setRepeat(repeatMods[newRepeat]);
    }

    const toggleShuffle = (): void => {
        if (!refWebPlaybackState.current) return;
        playerState.spotifyApi.setShuffle(!playerState.playerInfo.isShuffle);
    }

    const playTrackByUri = (props: {uris?: string[], contextUri?: string}): void => {
        if (props.uris) {
            playerState.spotifyApi.play({
                uris: props.uris 
            });
        }
        if (props.contextUri) {
            playerState.spotifyApi.play({
                context_uri: props.contextUri 
            });
        }
    }

    const initVolume = (volume, player) => {
        let cookiesVolume = Cookies.get('volume');
        if (cookiesVolume) {
            player.setVolume(cookiesVolume);
        };
        setPlayerState((state) => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    volume
                }
            }
        });
    }

    const handleError = (e) => {
        toast.error(e.message);
    }

    const didWebPlaybackChanged = (webPlaybackState: IWebPlaybackState): boolean => {
        if (!refWebPlaybackState.current || !webPlaybackState) return true;

        const currentTrack = webPlaybackState.track_window.current_track;
        const refCurrentTrack = refWebPlaybackState.current.track_window.current_track;


        if (
            webPlaybackState.paused !== refWebPlaybackState.current.paused ||
            webPlaybackState.position !== refWebPlaybackState.current.position ||
            webPlaybackState.repeat_mode !== refWebPlaybackState.current.repeat_mode ||
            webPlaybackState.shuffle !== refWebPlaybackState.current.shuffle ||
            webPlaybackState.position !== refWebPlaybackState.current.position ||

            currentTrack.id !== refCurrentTrack.id ||
            currentTrack.album!.uri !== refCurrentTrack.album!.uri 
        ) return true
        
        return false;
    }

    const playerStateChangeListener = (webPlaybackState: IWebPlaybackState): void => {
        if( !didWebPlaybackChanged(webPlaybackState) || !webPlaybackState) return;

        refWebPlaybackState.current = webPlaybackState;
        const currentTrackState = webPlaybackState.track_window.current_track;

        const getIdFromUri = (uri: string):string => {
            return uri.split(":")[2];
        }
        
        setPlayerState(state => {
            return {
                ...state,
                playerInfo: {
                    ...state.playerInfo,
                    isPaused: webPlaybackState.paused,
                    isShuffle: webPlaybackState.shuffle,
                    isRepeat: webPlaybackState.repeat_mode,
                    playbackPosition: webPlaybackState.position,
                },
                trackInfo: {
                    ...state.trackInfo,
                    id: currentTrackState.id,
                    img: currentTrackState.album!.images[1].url || currentTrackState.album!.images[0].url,
                    uri: currentTrackState.uri,
                    name: currentTrackState.name,
                    artist: currentTrackState.artists[0].name,
                    artistId: getIdFromUri(currentTrackState.artists[0].uri),
                    artistUri: currentTrackState.artists[0].uri,
                    album: currentTrackState.album!.name,
                    albumId: getIdFromUri(currentTrackState.album!.uri),
                    albumUri: currentTrackState.album!.uri,
                    duration: currentTrackState.duration_ms,
                },
            }
        });
    };

    const initSdk = (): void => {
        if(!auth || !auth.token) return;
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
    
        document.body.appendChild(script);
        setPlayerScript(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(auth.token); },
                volume: Cookies.get('volume') || 1
            }) as IPlayer;

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setPlayerState((state) => {
                    return {
                        ...state,
                        deviceId: device_id,
                        playerInfo: {
                            ...state.playerInfo,
                            isReady: true,
                        }
                    }
                })
                playerState.spotifyApi.transferMyPlayback([device_id]);
                player.getVolume().then(volume => {
                    initVolume(volume * 100, player);
                });
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setIsPlayerReady(false);
            });

            player.addListener('player_state_changed', playerStateChangeListener);

            for (let error in errors) {
                player.on(error, handleError);
            }

            player.connect();
        };
    }

    const togglePlaying = (): void => {
        if (playerState.playerInfo.isReady) {
            playerState.player!.togglePlay();
        }
    }

    const setNextTrack = (): void => {
        if (!playerState.player) return;
        playerState.player.nextTrack();
    }

    const setPreviousTrack = (): void => {
        if (!playerState.player) return;
        playerState.player.previousTrack();
    }

    const logout = (): void => {
        if (!playerState.player || !playerState.playerScript) return;
        playerState.player.removeListener('ready');
        playerState.player.removeListener('not_ready');
        playerState.player.removeListener('player_state_changed');
        for (let error in errors) {
            playerState.player.removeListener(error);
        }
        playerState.player.disconnect();
        playerState.playerScript.remove();
        setPlayerState((state) => {
            return {
                ...state,
                player: null,
                playerScript: null,
                playerInfo: {
                    ...state.playerInfo,
                    isReady: false
                }
            }
        });
    }

    const searchTracks = (query: string) => {
        playerState.spotifyApi.searchTracks(query).then(data => {
            setQueryData(data.tracks.items as IWebPlaybackTrack[]);
        });
    }

    const getTracksByAlbum = (id: string): Promise<SpotifyApi.AlbumTracksResponse> => {
        return playerState.spotifyApi.getAlbumTracks(id, {
            limit: 50,
        });
    }

    const getAlbumById = (id: string): Promise<SpotifyApi.SingleAlbumResponse> => {
        return playerState.spotifyApi.getAlbum(id);
    }

    const getTracksByArtistId = (id: string): Promise<SpotifyApi.ArtistsTopTracksResponse> =>{
        return playerState.spotifyApi.getArtistTopTracks(id, 'RU');
    }

    const getArtistById = (id: string): Promise<SpotifyApi.SingleArtistResponse> => {
        return playerState.spotifyApi.getArtist(id);
    }

    const getIdByUri = (uri: string): string => {
        return uri.split(':')[2];
    }


    useEffect(() => {
        if(auth!.token && auth!.user) {
            initSdk();
            initRecommenations();
        };

        if (auth!.token === null && playerState.player) {
            logout();
        }
    }, [auth!.token])

    useEffect(() => {
        // console.log(playerState.trackInfo);
    }, [loadedData]);

    return {
        spotifyApi: playerState.spotifyApi,
        player: playerState.player,

        playerInfo: playerState.playerInfo,
        trackInfo: playerState.trackInfo,

        loadedData,
        queryData,

        setVolume,
        setPosition,
        setIsDraggingVolume,
        setIsDraggingPosition,
        togglePlaying,
        toggleShuffle,
        toggleRepeat,
        setNextTrack,
        setPreviousTrack,
        playTrackByUri,
        searchTracks,
        getTracksByAlbum,
        getIdByUri,
        getAlbumById,
        getTracksByArtistId,
        getArtistById,
    }
}