import React, { useEffect, useMemo, useRef } from 'react';
import Aside from './components/aside';
import Header from './components/header';
import Main from './components/main';
import Footer from './components/footer';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { setScrollMain } from 'Rdx/layoutSlice';
import { throttle } from 'lodash';
import { useAuth } from 'Hooks/Auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { usePlayer } from 'Hooks/Player';
import Search from './components/search';
import Album from './components/album';
import Artist from './components/artist';
import PrivateRoute from './PrivateRouter';
import { useAppDispatch } from 'Rdx/hooks';



const App = () => {
    const mainRef = useRef<HTMLDivElement | null>(null);
    const { setIsDraggingVolume, setIsDraggingPosition } = usePlayer()!;
    
    const dispatch = useAppDispatch();

    const scrollListener = (e) => {
        dispatch(setScrollMain(mainRef.current!.scrollTop));
    };

    const throttledScrollListener = useMemo(
        () => throttle(scrollListener, 200)
    , []);

    const mouseUp = () => {
        setIsDraggingVolume(false);
        setIsDraggingPosition(false);
    };

    
    const auth = useAuth();


    useEffect(() => {
        mainRef.current!.addEventListener('scroll', throttledScrollListener);
    }, [])

    return (
        <Router>
            <div className="site-wrapper" onMouseUp={mouseUp}>
                <div className="basic-container">
                    <Aside />
                    <div className="basic-part" ref={mainRef} onScroll={throttledScrollListener}>
                        <Header />
                        <script src="https://sdk.scdn.co/spotify-player.js"></script>

                        <Switch>
                            <PrivateRoute path="/search" exact>
                                <Search />
                            </PrivateRoute>
                            <PrivateRoute path="/album/:id">
                                <Album/>
                            </PrivateRoute>
                            <PrivateRoute path="/artist/:id">
                                <Artist/>
                            </PrivateRoute>
                            <Route path="/">
                                <Main />
                            </Route>
                        </Switch>

                    </div>
                </div>
                <Footer />
                <ToastContainer 
                    position="top-right"
                    autoClose={10000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    />
            </div>
        </Router>
    )

}

export default App;

// function mapDispatchToProps(dispatch) {
//     return bindActionCreators({ setScrollMain }, dispatch);
// }

// export default connect(null, mapDispatchToProps)(App);