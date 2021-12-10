import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "src/hooks/Auth";
import { useAppSelector } from "Rdx/hooks";
import SvgFolder from 'Svgs/folder.svg';
import SvgRecordVinyl from 'Svgs/record-vinyl.svg';
import useWindowDimensions from "Utils/useWindowDimensions";
import { RootState } from "src/rdx/store";





const Aside = () => {
    const { width } = useWindowDimensions();
    const widthForShowAside = 789.998; // 790 - 0.002

    const auth = useAuth();

    const showAside = useAppSelector((state: RootState) => state.layout.showAside);


    const [doesRenderAside, setDoesRenderAside] = useState( (showAside || widthForShowAside < width) ? true : false );

    useEffect(() => {
        setDoesRenderAside( (showAside || widthForShowAside < width) ? true : false );
    }, [showAside, width])

    if (!auth || !auth.user) return null;

    return (
        <aside className={`aside-site ${doesRenderAside ? "aside-site__active" : null}`}>
            <Link to="/"  className="aside-logo">
                    <div className="aside-logo__img"></div>
                    <div className="aside-logo__text">spot </div>
            </Link>
            <nav className="aside-nav">
                <ul className="aside-nav__list">
                    <li className="aside-nav__item">
                        <Link to="/"  className="aside-nav__item-href">
                            <div className="aside-nav__item-icon aside-nav__item_artists">
                                <SvgFolder />
                            </div>
                            <div className="aside-nav__item-name">Home</div>
                        </Link>
                    </li>
                    <li className="aside-nav__item">
                        <Link to="/search"  className="aside-nav__item-href">
                            <div className="aside-nav__item-icon aside-nav__item_albums">
                                <SvgRecordVinyl />
                            </div>
                            <div className="aside-nav__item-name">Search</div>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default Aside;