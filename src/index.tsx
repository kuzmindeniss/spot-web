import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from 'Rdx/store';
import App from './App';
import './styles/main.scss';
import { ProvideAuth } from 'Hooks/Auth';
import { ProvidePlayer } from 'Hooks/Player';

render((
    <ProvideAuth>
        <ProvidePlayer>
            <Provider store={store}>
                <App/>
            </Provider>
        </ProvidePlayer>
    </ProvideAuth>
), document.getElementById('root'));