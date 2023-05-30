import React from 'react';
import Typography from '@mui/material/Typography';

class Title extends React.Component {

	render() {
		return (
		
			<Typography variant="h3" component="h1">{this.props.text}</Typography>
		);
	}
}

export default Title;