import { usePlayer } from 'Hooks/Player';
import React from 'react';
import SvgDurationTrackTable from 'Svgs/duration-track-table.svg';
import TrackItem from 'src/components/common/TrackItem';

const Search: React.FC = () => {
    const { queryData } = usePlayer()!;

    const renderItems = (): React.ReactElement[] => {
        let items: React.ReactElement[] = [];
        if (!queryData) return items;

        items = queryData.map((item, idx) => {
            return <TrackItem key={item.id} track={item} idx={idx} type="search"/>
        });

        return items;
    }

    if (queryData && queryData.length) return (
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
    else return (
        <main className="site-main">
            <h1>Nothing found...</h1>
        </main>
    )
}

export default Search;

