import { Component } from 'react';
import PropTypes from 'prop-types';

class Alert extends Component {
	constructor(props) {
		super(props);
		this.color = null;
	}

	getStyle = () => {
		return {
			color: this.color,
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
		this.color = 'rgb(97, 212, 249)';
	}
}
class ErrorAlert extends Alert {
	constructor(props) {
		super(props);
		this.color = 'rgb(254, 74, 131)';
	}
}
class WarningAlert extends Alert {
	constructor(props) {
		super(props);
		this.color = 'rgb(101, 194, 58)';
	}
}

Alert.propTypes = {
	text: PropTypes.string.isRequired,
};
export { InfoAlert, ErrorAlert, WarningAlert };
