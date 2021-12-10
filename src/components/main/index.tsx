import { usePlayer } from "Hooks/Player";
import React from "react";
import { useAuth } from "src/hooks/Auth";
import TrendingSection from "./TrendingSection";
import { authUrl } from "Hooks/Auth";
import Selection from "./Selection";
import { INewReleaseAlbum } from "src/types";

const Main = () => {
    const { loadedData, player } = usePlayer()!;
    const auth = useAuth()!;

    if (auth && auth.user) return (
        <main className="site-main">
            <TrendingSection/>
            <Selection type="tracks" name="Recommendations" data={loadedData && loadedData.recommendations ? loadedData.recommendations : []}/>
            <Selection type="albums" name="New releases" data={loadedData && loadedData.newReleases ? loadedData.newReleases as INewReleaseAlbum[] : []}/>
        </main>
    )
    else return (
        <div className="site-main site-main--login-request">
            <h1>
                <a href={authUrl}>
                    Click here for spotify authentication...
                </a>
            </h1>
        </div>
    )
}

export default Main;