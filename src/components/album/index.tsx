import React, { useEffect, useState } from 'react';
import { Link, useParams, useRouteMatch } from 'react-router-dom';
import { usePlayer } from 'src/hooks/Player';
import { IAlbumById, IWebPlaybackTrackAlbum } from 'src/types';
import SvgDurationTrackTable from 'Svgs/duration-track-table.svg';
import SearchItem from '../common/TrackItem';

const Album: React.FC = () => {
    let { id } = useParams<{id: string}>();
    const { getAlbumById, getIdByUri, player } = usePlayer()!;

    const [album, setAlbum] = useState<IAlbumById | null>(null);


    const renderItems = (): React.ReactElement[] => {
        let items: React.ReactElement[] = [];
        if (!album || !album.tracks.items) return items;

        const albumObj: IWebPlaybackTrackAlbum = {
            uri: album.uri,
            name: album.name,
            images: album.images
        };

        items = album.tracks.items.map((item, idx) => {
            return <SearchItem key={item.id} track={item} album={albumObj} idx={idx} type="albumTrack"/>
        });

        return items;
    }

    const getTracksTable = () => {
        if (album && album.tracks.items.length) return (
            <main className="site-main">
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
                                {/* <span>Album</span> */}
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

        getAlbumById(id).then(data => {
            setAlbum(data);
        });
        
        
    }, [player]);

    
    if (album) return (
        <main className="site-main">
            <div className="album-header">
                <div className="album-header__left">
                    <img src={ album?.images[1].url } alt="album" />
                </div>
                <div className="album-header__right">
                    <span className="album-header__right-span">Album</span>
                    <div className="album-header__right-name">{ album?.name }</div>
                    <div className="album-header__right-artist">
                        <Link to={`/artist/${getIdByUri(album?.artists[0]!.uri)}`}>
                            { album?.artists[0].name }
                        </Link>
                    </div>
                </div>
            </div>

            {getTracksTable()}
        </main>
        
    )

    return null;
}

export default Album;