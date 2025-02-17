import { useState, useEffect } from 'react';
import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts';
import PropTypes from 'prop-types';

const CityEventsChart = ({ allLocations, events }) => {
	const [data, setData] = useState([]);
	useEffect(() => {
		const getData = () => {
			if (!allLocations || !events) return [];

			const data = allLocations.map((location) => {
				const count = events.filter((event) => event.location === location).length;
				const city = location.split(/, | - /)[0];
				return { city, count };
			});
			return data;
		};
		setData(getData());
	}, [allLocations, events]);

	return (
		<ResponsiveContainer
			width="99%"
			height={400}>
			<p>Events by city:</p>
			<ScatterChart margin={{ top: 20, bottom: 100, left: 10, right: 10 }}>
				<CartesianGrid />
				<XAxis
					type="category"
					dataKey="city"
					name="City"
					angle={90}
					interval={0}
					tick={{ dx: 20, dy: 40, fontSize: 12, fill: '#f9f9f9' }}
				/>
				<YAxis
					type="number"
					dataKey="count" /*countnumber*/
					name="Number of events"
					allowDecimals={false}
					tick={{ fill: '#f9f9f9' }}
				/>
				<Tooltip cursor={{ strokeDasharray: '3 3' }} />
				<Scatter
					name="Events"
					data={data}
					fill="#e43955"
				/>
			</ScatterChart>
		</ResponsiveContainer>
	);
};
CityEventsChart.propTypes = {
	allLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
	events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default CityEventsChart;
