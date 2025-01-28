import { Component } from 'react';
import PropTypes from 'prop-types';

class Alert extends Component {
	constructor(props) {
		super(props);
		this.color = null;
		this.bgColor = null;
	}

	getStyle = () => {
		return {
			color: this.color,
			backgroundColor: this.bgColor,
			borderWidth: '2px',
			borderStyle: 'solid',
			fontWeight: '600',
			borderRadius: '3px',
			borderColor: this.color,
			textAlign: 'center',
			fontSize: '14px',
			margin: '10px auto',
			padding: '10px',
		};
	};

	render() {
		return (
			<div className="Alert">
				<p style={this.getStyle()}>{this.props.text}</p>
			</div>
		);
	}
}

class InfoAlert extends Alert {
	constructor(props) {
		super(props);
		this.color = 'rgb(49, 133, 252)';
		this.bgColor = 'rgb(235, 250, 255)';
	}
}
class ErrorAlert extends Alert {
	constructor(props) {
		super(props);
		this.color = 'rgb(223, 59, 87)';
		this.bgColor = 'rgb(252, 237, 240)';
	}
}
Alert.propTypes = {
	text: PropTypes.string.isRequired,
};
export { InfoAlert, ErrorAlert };
