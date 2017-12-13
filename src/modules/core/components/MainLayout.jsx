import React from 'react';
import { Switch } from 'react-router-dom';
import { Route } from 'react-router';

const MainLayout = () => (
	<div>
		<Switch>
			<Route path="/" render={
				() => <div>Hello World</div>
			} />
		</Switch>
	</div>
);

export default MainLayout;
