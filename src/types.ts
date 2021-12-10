import { MutableRefObject } from "react";
import SpotifyWebApi from "spotify-web-api-js";

export interface IPlayer {
    setVolume(volume: number): void;
    getVolume(): Promise<number>;
    addListener(event: string, listener: Function): void;
    on(event: string, listener: Function): void;
    connect(): void;
    disconnect(): void;
    togglePlay(): void;
    nextTrack(): void;
    previousTrack(): void;
    removeListener(event: string, listener?: Function): void;
    seek(positon: number): void;
}

export interface IAuthUser {
    display_name?: string;
    email: string;
    id: string;
}

export interface IAuthContext {
    user: IAuthUser | null;
    token: string | null;
    didUserInit: boolean;
    spotifyApi: SpotifyWebApi.SpotifyWebApiJs | null;
    logout: () => void;
}

export interface ILoadedDataState {
    recommendations: IWebPlaybackTrack[] | SpotifyApi.TrackObjectSimplified[];
    newReleases: INewReleaseAlbum[] | SpotifyApi.AlbumObjectSimplified[];
}

export interface IPlayerContext {
    spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
    player: IPlayer | null;

    playerInfo: {
        volume: number,
        playbackPosition: number,
        isReady: boolean;
        isDraggingVolume: boolean;
        isDraggingPosition: boolean;
        isPaused: boolean;
        isShuffle: boolean;
        isRepeat: 0 | 1 | 2;
    }

    trackInfo: {
        id: string | null,
        img: string | null,
        uri: string | null,
        name: string | null,
        artist: string | null,
        artistId: string | null,
        artistUri: string | null,
        album: string | null,
        albumId: string | null,
        albumUri: string | null,
        duration: number | null,
    },

    loadedData: ILoadedDataState | null;
    queryData: IWebPlaybackTrack[] | null;

    setVolume: (volume: number) => void;
    setPosition: (position: number) => void;
    setIsDraggingVolume: (newIsDragging: boolean) => void;
    setIsDraggingPosition: (newIsDragging: boolean) => void;
    togglePlaying: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setNextTrack: () => void;
    setPreviousTrack: () => void;
    getIdByUri: (uri: string) => string;
    playTrackByUri: (props: {uris?: string[], contextUri?: string}) => void;
    searchTracks: (query: string) => void;
    getTracksByAlbum: (id: string) => Promise<SpotifyApi.AlbumTracksResponse>;
    getAlbumById: (id: string) => Promise<SpotifyApi.SingleAlbumResponse>;
    getTracksByArtistId: (id: string) => Promise<SpotifyApi.ArtistsTopTracksResponse>;
    getArtistById: (id: string) => Promise<SpotifyApi.SingleArtistResponse>;
}

export interface IPlayerState {
    spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
    player: IPlayer | null;
    playerScript: HTMLScriptElement | null;
    deviceId: string | null;
    trackId: string | null;

    playerInfo: {
        isReady: boolean;
        isDraggingVolume: boolean;
        isDraggingPosition: boolean;
        isPaused: boolean;
        isShuffle: boolean;
        isRepeat: 0 | 1 | 2;
        volume: number;
        playbackPosition: number;
    },

    trackInfo: {
        id: string | null;
        img: string | null;
        uri: string | null;
        name: string | null;
        artist: string | null;
        artistId: string | null;
        artistUri: string | null;
        album: string | null;
        albumId: string | null;
        albumUri: string | null;
        duration: number | null;
    }
}

export interface IAuthState {
    user: IAuthUser | null;
    token: string | null;
    didUserInit: boolean;
}

export interface IWebPlaybackTrackAlbum {
    uri: string;
    name: string;
    images: IWebPlaybackTrackImage[];
}

export interface IWebPlaybackTrackArtist {
    name: string;
    uri: string;
    id: string;
    images?: IWebPlaybackTrackImage[];
}

export interface IWebPlaybackTrackImage {
    height?: number | undefined;
    url: string;
    width?: number | undefined;
}

export interface IWebPlaybackTrack {
    name: string;
    id: string;
    uri: string;
    duration_ms: number;
    album?: IWebPlaybackTrackAlbum;
    artists: IWebPlaybackTrackArtist[];
}

export interface IWebPlaybackState {
    paused: boolean;
    position: number;
    repeat_mode: 0 | 1 | 2;
    shuffle: boolean;
    track_window: {
        current_track: IWebPlaybackTrack;
        next_tracks: Array<IWebPlaybackTrack>;
        previous_tracks: Array<IWebPlaybackTrack>;
    }
}

export interface INewReleaseAlbum {
    id: string;
    name: string;
    uri: string;
    artists: IWebPlaybackTrackArtist[];
    images: IWebPlaybackTrackImage[];
}

export interface ITrackItemProps {
    track: IWebPlaybackTrack;
    album?: IWebPlaybackTrackAlbum;
    type: "search" | "albumTrack" | "artistTopTrack";
    idx: number;
}

export interface IAlbumById {
    id: string;
    name: string;
    uri: string;
    images: IWebPlaybackTrackImage[];
    tracks: {
        href: string;
        items: IWebPlaybackTrack[];
    };
    artists: IWebPlaybackTrackArtist[];
}

export interface IArtistState {
    artist: IWebPlaybackTrackArtist;
    tracks: IWebPlaybackTrack[];
}

export type SelectionType = "tracks" | "albums";

export interface ISelectionItemProps {
    itemType: SelectionType;
    item: IWebPlaybackTrack | INewReleaseAlbum;
}

export interface ISelectionTracksProps {
    type: SelectionType;
    name: string;
    data: IWebPlaybackTrack[];
}

export interface ISelectionAlbumsProps {
    type: SelectionType;
    name: string;
    data: INewReleaseAlbum[];
}

export type ISelectionProps<T extends SelectionType> = T extends "tracks" ? ISelectionTracksProps : ISelectionAlbumsProps;