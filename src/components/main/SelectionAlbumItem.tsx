import React from 'react';
import { Link } from 'react-router-dom';
import { usePlayer } from 'src/hooks/Player';
import { INewReleaseAlbum } from 'src/types';

const SelectionAlbumItem: React.FC<{item: INewReleaseAlbum}> = (props) => {

    const { getIdByUri } = usePlayer()!;
    
    const item: INewReleaseAlbum  = props.item;

    return (
        <li className="tracks-selection__item">
            <div className="tracks-selection__item-img">
                <img src={item.images[1].url} alt="track" />
            </div>
            <Link className="tracks-selection__item-name"  to={ `/album/${getIdByUri(item.uri)}` }>{ item.name }</Link>
            <Link className="tracks-selection__item-artist" to={ `/artist/${getIdByUri(item.artists[0]!.uri)}` }>{ item.artists[0].name }</Link>
        </li>
    )
}

export default SelectionAlbumItem;