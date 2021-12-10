import React, { useEffect, useState } from 'react';

import SvgArrowRight from 'Svgs/arrow-right.svg';
import SvgArrowLeft from 'Svgs/arrow-left.svg';
import SvgSearch from 'Svgs/search.svg';
import SvgMenuBurger from 'Svgs/menu-burger.svg';
import SvgUserCircle from 'Svgs/user-circle.svg';
import { toggleShowAside } from 'Rdx/layoutSlice';
import { connect } from 'react-redux';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useAuth } from 'Hooks/Auth';
import { usePlayer } from 'src/hooks/Player';
import { useHistory } from 'react-router-dom';

const Header = (props) => {
    const [state, setState] = useState({
        opacity: 0,
    });
    const [searchValue, setSearchValue] = useState<string>('');

    const { user, logout } = useAuth()!;
    const { searchTracks } = usePlayer()!;
    const history = useHistory();


    const toggle = () => {
        props.toggleShowAside();
    }


    const renderProfile = () => {
        if (user) return (
            <div className="header-profile">
                {/* <div className="header-profile__left"><img src="" alt="ava" width="24"
                    height="24" /></div> */}
                <div className="header-profile__right">
                    <button className="header-profile__name" onClick={logout}>
                        <SvgUserCircle/> Logout
                    </button>
                </div>
            </div>
        )
        else return (
            null
        )
    }

    const search = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        searchTracks(searchValue);
        history.push("/search");
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    const back = () => {
        history.goBack();
    }

    const forward = () => {
        history.goForward();
    }

    useEffect(() => {

        let opacity = props.scrollMain / 100;
        if (props.scrollMain < 0) opacity = 0;
        if (props.scrollMain > 98) opacity = 1;
        setState(() => {
            return {
                ...state,
                opacity,
            }
        })
    }, [props.scrollMain]);

    
    if (!user) return null;

    return (
        <header className="site-header">
            <div className="header-bg" style={{opacity: state.opacity}}></div>
            <div className="header-container">
                <div className="header-menu-burger">
                    <button onClick={toggle}>
                        <SvgMenuBurger/>
                    </button>
                </div>
                <div className="header-arrows">
                    <button className="header-arrow header-arrow_left" onClick={back}>
                        <SvgArrowLeft />
                    </button>
                    <button className="header-arrow header-arrow_right" onClick={forward}>
                        <SvgArrowRight />
                    </button>
                </div>
                <div className="header-search">
                    <form className="header-search__form" onSubmit={search}>
                        <div className="header-search__icon">
                            <SvgSearch />
                        </div>
                        <input className="header-search__input" type="text" placeholder="Type here to search" onChange={handleSearchChange} />
                    </form>
                </div>
                { renderProfile() }
            </div>
        </header>
    )
}

function mapStateToProps(state) {
    return {
        scrollMain: state.layout.scrollMain,
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ toggleShowAside }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);