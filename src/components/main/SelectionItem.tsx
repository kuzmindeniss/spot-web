import { usePlayer } from "Hooks/Player";
import React from "react"
import { INewReleaseAlbum, ISelectionItemProps, IWebPlaybackTrack } from "src/types";
import SelectionAlbumItem from "./SelectionAlbumItem";
import SelectionTrackItem from "./SelectionTrackItem";


const SelectionItem: React.FC<ISelectionItemProps> = (props: ISelectionItemProps) => {

    const { playTrackByUri, getIdByUri } = usePlayer()!;

    const playTrack = () => {
        if (!props.item) return;
        playTrackByUri({
            uris: [props.item.uri]
        });
    }


    if (props.itemType === "tracks") return <SelectionTrackItem item={props.item as IWebPlaybackTrack}/>


    if (props.itemType === "albums") return <SelectionAlbumItem item={props.item as INewReleaseAlbum}/>



    return null;
}

export default SelectionItem;