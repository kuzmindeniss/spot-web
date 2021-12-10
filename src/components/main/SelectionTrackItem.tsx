import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from 'src/hooks/Player';
import { IWebPlaybackTrack } from 'src/types';
import SvgPlayTrack from 'Svgs/play-track-table.svg';

const SelectionTrackItem: React.FC<{ item: IWebPlaybackTrack  }> = (props) => {

    const { playTrackByUri, getIdByUri } = usePlayer()!;

    const playTrack = () => {
        if (!props.item) return;
        playTrackByUri({
            uris: [props.item.uri]
        });
    }

    const item: IWebPlaybackTrack  = props.item;

    return (
        <li className="tracks-selection__item">
            <div className="tracks-selection__item-img">
                <img src={props.item.album!.images[0].url} alt="track" />
                <div className="tracks-selection__item-play">
                    <button className="tracks-selection__item-play-button" onClick={playTrack}>
                        <SvgPlayTrack/>
                    </button>
                </div>
            </div>
            <Link className="tracks-selection__item-name"  to={ `/album/${getIdByUri(item.album!.uri)}` }>{ item.name }</Link>
            <Link className="tracks-selection__item-artist" to={ `/artist/${getIdByUri(item.artists[0]!.uri)}` }>{ item.artists[0].name }</Link>
        </li>
    )
}

export default SelectionTrackItem;