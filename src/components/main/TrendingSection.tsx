import { usePlayer } from 'Hooks/Player';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { INewReleaseAlbum } from 'src/types';
import SvgArrowLeft20 from 'Svgs/arrow-left-20.svg';
import SvgArrowRight20 from 'Svgs/arrow-right-20.svg';
import SvgHeart16 from 'Svgs/heart-16.svg';

const TrendingSection: React.FC = () => {
    const [currentAlbumIndex, setCurrentAlbumIndex] = useState(0);
    const { loadedData, playTrackByUri, getIdByUri } = usePlayer()!;

    if (!loadedData || !loadedData.newReleases) return null;
    const newReleases = loadedData.newReleases as INewReleaseAlbum[];
    const release = newReleases[currentAlbumIndex];


    const decreaseAlbumIndex = (): void => {
        setCurrentAlbumIndex(oldAlbumIndex => {
            let newAlbumIndex = oldAlbumIndex - 1;
            if (newAlbumIndex <= 0) newAlbumIndex = newReleases.length - 1;
            return newAlbumIndex;
        });
    }

    const increaseAlbumIndex = (): void => {
        setCurrentAlbumIndex(oldAlbumIndex => {
            let newAlbumIndex = oldAlbumIndex + 1;
            if (newAlbumIndex >= newReleases.length) newAlbumIndex = 0;
            return newAlbumIndex;
        });
    }

    const playTrack = (): void => {
        const uri = release.uri;
        playTrackByUri({
            contextUri: uri
        });
    }


    return (
        <div className="trending-section">
            <span className="trending-section__title">Trending new hits</span>
            <div className="trending-section__info">
                <div className="trending-section__arrow-container trending-section__arrow-container_left">
                    <button className="trending-section__arrow trending-section__arrow_left" onClick={decreaseAlbumIndex}>
                        <SvgArrowLeft20 />
                    </button>
                </div>
                <div className="trending-section__info-container">
                    <div className="trending-section__info-left">
                        <Link to={`/album/${getIdByUri(release.uri)}`} className="trending-section__track-name">{release.name}</Link>
                        <div className="trending-section__middle">
                            <Link className="trending-section__artist-name" to={`/artist/${getIdByUri(release.artists[0]!.uri)}`}>{release.artists[0].name}</Link>
                        </div>
                        <div className="trending-section__bottom">
                            <button className="trending-section__listen-now" onClick={playTrack}>Listen Now</button>
                        </div>
                    </div>
                    <div className="trending-section__info-right">
                        <div className="trending-section__track-avatar">
                            <img src={release.images[1].url} alt="track" width="150" height="150"/>
                        </div>
                    </div>
                </div>
                <div className="trending-section__arrow-container trending-section__arrow-container_right">
                    <button className="trending-section__arrow trending-section__arrow_right" onClick={increaseAlbumIndex}>
                        <SvgArrowRight20 />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TrendingSection;