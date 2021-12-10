import { usePlayer } from 'Hooks/Player';
import React from 'react';
import { Link } from 'react-router-dom';
import { ITrackItemProps } from 'src/types';
import SvgPlayTrackTable from 'Svgs/play-track-table.svg';

const TrackItem: React.FC<ITrackItemProps> = (props) => {
    const { playTrackByUri, getIdByUri } = usePlayer()!;

    const playTrack = () => {
        if (!props.track.uri) return;
        playTrackByUri({
            uris: [props.track.uri]
        });
    }

    const minutes = Math.floor(props.track.duration_ms / 1000 / 60);
    const seconds = Math.floor((props.track.duration_ms - (minutes * 60 * 1000)) / 1000);

    let artistSrc: string = `/artist/${getIdByUri(props.track.artists[0]!.uri)}`;
    let albumImg: string;
    let albumName: string;
    let albumSrc: string;

    if (props.album) {
        albumImg = props.album.images[2].url;
        albumName = props.album.name;
        albumSrc = `/album/${getIdByUri(props.album!.uri)}`;
    } else {
        albumImg = props.track.album!.images[2].url;
        albumName = props.track.album!.name;
        albumSrc = `/album/${getIdByUri(props.track.album!.uri)}`;
    }


    if (props.type == "search") return (
        <div className="tracks-table__row">
            <div role="gridcell" aria-colindex={1} className="tracks-table__index">
                <div className="tracks-table__index-container">
                    <span>{ props.idx + 1 }</span>
                    <button className="tracks-table__index-button" onClick={playTrack}>
                        <SvgPlayTrackTable />
                    </button>
                </div>
            </div>
            <div role="gridcell" aria-colindex={2} className="tracks-table__track">
                <img src={ albumImg } width="40" height="40" />
                <div className="tracks-table__track-info">
                    <div className="tracks-table__track-info-top">{ props.track.name }</div>
                    <Link to={ artistSrc } className="tracks-table__track-info-bottom">{ props.track.artists[0].name }</Link>
                </div>
            </div>
            <div role="gridcell" aria-colindex={3} className="tracks-table__year">
                <Link to={albumSrc}>{ albumName }</Link>
            </div>
            <div role="gridcell" aria-colindex={4} className="tracks-table__duration">
                <span>
                    { minutes } : { seconds }
                </span>
            </div>
        </div>
    )


    if (props.type == "albumTrack") return (
        <div className="tracks-table__row">
            <div role="gridcell" aria-colindex={1} className="tracks-table__index">
                <div className="tracks-table__index-container">
                    <span>{ props.idx + 1 }</span>
                    <button className="tracks-table__index-button" onClick={playTrack}>
                        <SvgPlayTrackTable />
                    </button>
                </div>
            </div>
            <div role="gridcell" aria-colindex={2} className="tracks-table__track">
                {/* <img src={ albumImg } width="40" height="40" /> */}
                <div className="tracks-table__track-info">
                    <div className="tracks-table__track-info-top">{ props.track.name }</div>
                    <Link to={artistSrc} className="tracks-table__track-info-bottom">{ props.track.artists[0].name }</Link>
                </div>
            </div>
            <div role="gridcell" aria-colindex={3} className="tracks-table__year">
                {/* <Link to={albumSrc}>{ albumName }</Link> */}
            </div>
            <div role="gridcell" aria-colindex={4} className="tracks-table__duration">
                <span>
                    { minutes } : { seconds }
                </span>
            </div>
        </div>
    )


    if (props.type == "artistTopTrack") return (
        <div className="tracks-table__row">
            <div role="gridcell" aria-colindex={1} className="tracks-table__index">
                <div className="tracks-table__index-container">
                    <span>{ props.idx + 1 }</span>
                    <button className="tracks-table__index-button" onClick={playTrack}>
                        <SvgPlayTrackTable />
                    </button>
                </div>
            </div>
            <div role="gridcell" aria-colindex={2} className="tracks-table__track">
                <img src={ albumImg } width="40" height="40" />
                <div className="tracks-table__track-info">
                    <div className="tracks-table__track-info-top">{ props.track.name }</div>
                    <Link to={artistSrc} className="tracks-table__track-info-bottom">{ props.track.artists[0].name }</Link>
                </div>
            </div>
            <div role="gridcell" aria-colindex={3} className="tracks-table__year">
                <Link to={albumSrc}>{ albumName }</Link>
            </div>
            <div role="gridcell" aria-colindex={4} className="tracks-table__duration">
                <span>
                    { minutes } : { seconds }
                </span>
            </div>
        </div>
    )

    return null;
}

export default TrackItem;