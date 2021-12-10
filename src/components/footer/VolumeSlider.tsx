import { usePlayer } from "Hooks/Player";
import React, { useRef, MouseEvent, useMemo } from "react";
import { throttle } from 'lodash';


const VolumeSlider: React.FC = () => {
    const volumeRef = useRef<HTMLDivElement | null>(null);
    const { setIsDraggingVolume, setVolume, player, playerInfo: { volume, isDraggingVolume, isReady} } = usePlayer()!;

    const volumeChange = (e: MouseEvent<HTMLDivElement>, isAfterStarted: boolean = false) => {
        if (!isDraggingVolume && !isAfterStarted) return;
        const slider = volumeRef.current!;
        const sliderStart = slider.getBoundingClientRect().left;
        const width = e.clientX - sliderStart;
        if (width < 0 || width > 100) return;
        setVolume(width);
    }

    const throttledVolumeChange = useMemo(
        () => throttle(volumeChange, 100)
    , [isDraggingVolume, player]);


    const volumeStartedChange = (e: MouseEvent<HTMLDivElement>) => {
        setIsDraggingVolume(true);
        throttledVolumeChange(e, true);
    };

    if (isReady) return (
        <div className="footer-slider"
            ref={volumeRef}
            onMouseMove={throttledVolumeChange}
            onMouseDown={volumeStartedChange}
        >
            <div className="footer-slider__strip">
                <div className="footer-slider__strip-full" style={{ width: volume + '%' }}></div>
                <div className="footer-slider__icon" style={{ left: volume + '%' }}></div>
            </div>
        </div>
    )
    else return null;
}


export default VolumeSlider;