import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ApolloProvider } from 'react-apollo';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import MainLayout from './MainLayout.jsx';

class App extends Component {
	static propTypes = {
		store: PropTypes.object.isRequired,
		client: PropTypes.object.isRequired
	}

	render() {
		const { store, client } = this.props;

		return (
			<ApolloProvider client={ client }>
				<Provider store={ store }>
					<HashRouter>
						<MainLayout />
					</HashRouter>
				</Provider>
			</ApolloProvider>
		);
	}
}

export default App;