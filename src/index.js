import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createStore, compose, combineReducers } from 'redux';

import middleware from './middleware';

import core from './modules/core';

import App from './modules/core/components/App.jsx';

const httpLink = createHttpLink({
	uri: process.env.DATALAYER_URL
});

const afterwareLink = onError(({ graphQLErrors, networkError }) => {
	if (graphQLErrors) {
		graphQLErrors.map(({ message, locations, path }) => {
			// eslint-disable-next-line
			console.log(
				`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
			);
		});
	}

	if (networkError) {
		// eslint-disable-next-line
		console.log(`[Network error]: ${networkError}`);
	}
});

const link = from([
	afterwareLink,
	httpLink
]);

/** APOLLO CLIENT */
const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
});

const reducer = combineReducers({
	...core.reducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(middleware);

const store = createStore(reducer, {}, enhancer);

ReactDOM.render(
	React.createElement(App, {
		store,
		client
	}),
	document.getElementById('app')
);
