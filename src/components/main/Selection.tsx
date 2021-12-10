import React, { useRef, useCallback, useEffect, useState } from 'react';
import { ISelectionProps, SelectionType } from 'src/types';
import SelectionItem from './SelectionItem';

const Selection: React.FC<ISelectionProps<SelectionType>> = (props: ISelectionProps<SelectionType>) => {
    const selectionListRef = useRef<HTMLUListElement>(null);
    const [columnsCount, setColumnsCount] = useState<number>(0);


    const getColumnsQuantity = (minWidth: number, containerWidth: number, gap: number = 0): number => {
        if (minWidth > containerWidth) return 0;
        const widthWithGap = minWidth + gap;
        const containerWithoutLast = containerWidth - minWidth;
        return Math.floor(containerWithoutLast / widthWithGap) + 1;
    }


    const getSelectionItemsList = (data, type: SelectionType ) => {
        let items: React.ReactElement[] = [];

        let itemsForIterate = data.slice(0, columnsCount);

        items = itemsForIterate.map((item, idx) => {
            return (
                <SelectionItem itemType={type} key={item.id}
                    item={item}
                />
            )
        })
        
        return items;
    }

    const calculateColumns = useCallback(() => {
        if (!selectionListRef.current) return;
        const gridComputedStyle  = window.getComputedStyle(selectionListRef.current);

        const gridGap = parseInt(gridComputedStyle.getPropertyValue("grid-column-gap"));
        const gridWidth = parseInt(gridComputedStyle.getPropertyValue("width"));

        setColumnsCount(getColumnsQuantity(180, gridWidth, gridGap));
    }, []);

    useEffect(() => {
        calculateColumns();
        window.addEventListener('resize', calculateColumns);
        return () => {
            window.removeEventListener('resize', calculateColumns);
        }
    }, []);



    return (
        <div className="tracks-selection">
            <div className="tracks-selection__top"><span className="tracks-selection__title">{ props.name }</span>
            {/* <a className="tracks-selection__see-all" href="#">SEE ALL </a> */}
            </div>
            <div className="tracks-selection">
                <ul className="tracks-selection__list" ref={selectionListRef}>
                    {getSelectionItemsList(props.data, props.type)}
                </ul>
            </div>
        </div>
    )
}

export default Selection;