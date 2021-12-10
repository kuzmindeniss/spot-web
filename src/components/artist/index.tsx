import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePlayer } from 'src/hooks/Player';
import { IArtistState, IWebPlaybackTrack, IWebPlaybackTrackAlbum, IWebPlaybackTrackArtist } from 'src/types';
import SvgDurationTrackTable from 'Svgs/duration-track-table.svg';
import SearchItem from '../common/TrackItem';

const Artist: React.FC = () => {
    let { id } = useParams<{id: string}>();
    const { getTracksByArtistId, getArtistById, player } = usePlayer()!;

    const [artistState, setArtistState] = useState<IArtistState | null>(null);


    const renderItems = (): React.ReactElement[] => {
        let items: React.ReactElement[] = [];
        if (!artistState || !artistState.tracks) return items;


        items = artistState.tracks.map((item, idx) => {
            return <SearchItem key={item.id} track={item} idx={idx} type="artistTopTrack"/>
        });

        return items;
    }

    const getTracksTable = () => {
        if (artistState && artistState.artist) return (
            <main className="site-main">
                <h1>Top tracks</h1>
                <div className="tracks-table">
                    <div className="tracks-table__header">
                        <div className="tracks-table__row">
                            <div role="gridcell" aria-colindex={1} className="tracks-table__index">
                                <span>#</span>
                            </div>
                            <div role="gridcell" aria-colindex={2} className="tracks-table__track">
                                <span>Title</span>
                            </div>
                            <div role="gridcell" aria-colindex={3} className="tracks-table__year">
                                <span>Album</span>
                            </div>
                            <div role="gridcell" aria-colindex={4} className="tracks-table__duration">
                                <div>
                                    <SvgDurationTrackTable/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="tracks-table__body">
                        {renderItems()}
                    </div>
                </div>
            </main>
        )
    }


    useEffect(() => {
        if (!player) return;

        const promiseTracks = getTracksByArtistId(id);
        const promiseArtist = getArtistById(id);

        Promise.all([promiseTracks, promiseArtist]).then((values: any[]) => {
            const tracks = values[0].tracks as IWebPlaybackTrack[];
            const artist = values[1] as IWebPlaybackTrackArtist;
            setArtistState({
                artist,
                tracks,
            });
        });
        
    }, [player]);



    if (!artistState || !artistState.artist  || !artistState.artist || !artistState.artist.images) return null;

    let imageUrl: string;

    if(artistState.artist.images[1]) {
        imageUrl = artistState.artist.images[1].url;
    } else {
        imageUrl = "https://i.scdn.co/image/ab67616d00001e02fd4fd07e7e9bf9e6d3b7e6e1";
    }
    
    return (
        <main className="site-main">
            <div className="album-header">
                <div className="album-header__left">
                    <img src={ imageUrl} alt="album" />
                </div>
                <div className="album-header__right">
                    <span className="album-header__right-span">Artist</span>
                    <div className="album-header__right-name">{ artistState.artist?.name }</div>
                </div>
            </div>

            {getTracksTable()}
        </main>
        
    )
}

export default Artist;