import { usePlayer } from "Hooks/Player";
import React from "react";
import SvgPlayerPlay from 'Svgs/player-play.svg';
import SvgPlayerPause from 'Svgs/pause.svg';
import SvgPlayerRepeat from 'Svgs/player-repeat.svg';
import SvgPlayerSetBackward from 'Svgs/player-set-backward.svg';
import SvgPlayerSetForward from 'Svgs/player-set-forward.svg';
import SvgPlayerShuffle from 'Svgs/player-shuffle.svg';
import VolumeSlider from "./VolumeSlider";
import TrackSlider from "./TrackSlider";

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: {Player};
    }
}

const Footer = () => {
    const { playerInfo } = usePlayer()!;
    const { togglePlaying, playerInfo: { isReady }, trackInfo, playerInfo: { isPaused }, setNextTrack, setPreviousTrack, toggleShuffle, toggleRepeat } = usePlayer()!;



    const renderTrackInfo = () => {
        if (trackInfo.img) {
            return (
                <div className="footer-left">
                    <img className="footer-albumlogo" src={trackInfo.img} alt="track" />
                    <div className="footer-songinfo">
                        <span className="footer-songinfo__name">{ trackInfo.name }</span>
                        <span className="footer-songinfo__artist">{ trackInfo.artist }</span>
                    </div>
                </div>
            )
        } else return (
            <div className="footer-left">
            </div>
        )
    };

    if (!trackInfo || !trackInfo.id) return (
        <footer className="footer-site">

        </footer>
    );

    return (
        <footer className={`footer-site ${isReady ? "footer-site__active" : null}`}>
            {renderTrackInfo()}
            <div className="footer-center">
                <div className="footer-center-top">
                    <button className={`footer-center-icon ${playerInfo.isShuffle ? 'footer-center-icon--active' : ''}`} onClick={toggleShuffle}>
                        <SvgPlayerShuffle/>
                    </button>
                    <button className="footer-center-icon" onClick={setPreviousTrack}>
                        <SvgPlayerSetBackward/>
                    </button>
                    <button className="footer-center-icon" onClick={togglePlaying}>
                        { isPaused ? <SvgPlayerPlay/> : <SvgPlayerPause/>}
                    </button>
                    <button className="footer-center-icon" onClick={setNextTrack}>
                        <SvgPlayerSetForward/>
                    </button>
                    <button className={`footer-center-icon ${playerInfo.isRepeat ? 'footer-center-icon--active' : ''}`} onClick={toggleRepeat}>
                        <SvgPlayerRepeat/>
                    </button>
                </div>
                <div className="footer-center-bottom">
                    <TrackSlider/>
                </div>
            </div>
            <div className="footer-right">
                <VolumeSlider/>
            </div>
        </footer>
    )
}

export default Footer;