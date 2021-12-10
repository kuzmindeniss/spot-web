import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePlayer } from "Hooks/Player";
import { throttle } from 'lodash';

const TrackSlider: React.FC = () => {
    const sliderRef = useRef<HTMLDivElement | null>(null);

    const { player, playerInfo: { playbackPosition, isDraggingPosition, isReady, isPaused }, trackInfo: { duration }, setIsDraggingPosition, setPosition } = usePlayer()!;

    const [visiblePosition, setVisiblePosition] = useState<number>(playbackPosition || 0);
    
    const positionChange = (e: React.MouseEvent<HTMLDivElement>, isAfterStarted: boolean = false) => {
        if (!isDraggingPosition && !isAfterStarted) return;
        if (!player) return;
        const slider: HTMLDivElement = sliderRef.current!;
        const sliderStart: number = slider.getBoundingClientRect().left;
        const sliderWidth: number = slider.offsetWidth
        const pixelsFromStart: number = e.clientX - sliderStart;
        let ratio: number = pixelsFromStart / sliderWidth;
        // if (pixelsFromStart < 0 || pixelsFromStart > sliderWidth) return;
        if (ratio < 0) ratio = 0;
        if (pixelsFromStart > sliderWidth) ratio = 1;
        const newPosition = duration! * ratio;
        setPosition(newPosition);
    }

    const throttledPositionChange = useMemo(
        () => throttle(positionChange, 100)
    , [isDraggingPosition, player, duration]);

    const sliderStartedChange = (e: React.MouseEvent<HTMLDivElement>) => {
        if(!player) return;
        setIsDraggingPosition(true);
        throttledPositionChange(e, true);
    };

    const getWidthFromPlaybackPosition = useMemo(() => {
        if (!duration || !visiblePosition) return 0;
        return visiblePosition / duration * 100;
    }, [duration, visiblePosition]);

    useEffect(() => {
        if (isPaused || !isReady) return;
        setVisiblePosition(playbackPosition);
        const interval = setInterval(() => {
            setVisiblePosition(oldPos => oldPos + 1000);
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, [playbackPosition, isPaused, isReady, duration])


    return (
        <div className="footer-track-slider"
            ref={sliderRef}
            onMouseMove={throttledPositionChange}
            onMouseDown={sliderStartedChange}
        >
            <div className="footer-track-slider__strip">
                <div className="footer-track-slider__strip-full" style={{ width: getWidthFromPlaybackPosition + '%' }}></div>
                <div className="footer-track-slider__icon" style={{ left: getWidthFromPlaybackPosition + '%' }}></div>
            </div>
        </div>
    )
}

export default TrackSlider;