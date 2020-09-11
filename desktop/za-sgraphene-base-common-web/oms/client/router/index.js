/* eslint-disable */
import React from 'react';
import Bundle from '../components/Bundle';
import Home from 'bundle-loader?lazy!../components/Home';
import Article from 'bundle-loader?lazy!../components/Article';
import NotFound from 'bundle-loader?lazy!../components/404';
import Iframe from 'bundle-loader?lazy!../components/Iframe';
const HomePage = (props) => (
    <Bundle load={Home}>
        {(Container) => <Container {...props} />}
    </Bundle>
);
const ArticlePage = (props) => (
    <Bundle load={Article}>
        {(Container) => <Container {...props} />}
    </Bundle>
);
const NotFoundPage = (props) => (
    <Bundle load={NotFound}>
        {(Container) => <Container {...props} />}
    </Bundle>
);
const IframePage = (props) => (
    <Bundle load={Iframe}>
        {(Container) => <Container {...props} />}
    </Bundle>
);
const Routers = [
    { id: 1, path: '/', component: HomePage, exact: true },
    { id: 2, path: '/article', component: ArticlePage },
    { id: 3, path: '/iframe', component: IframePage },
    { id: 404, component: NotFoundPage }
];
export default Routers;