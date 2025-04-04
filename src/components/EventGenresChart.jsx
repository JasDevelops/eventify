import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import PropTypes from 'prop-types';

const EventGenresChart = ({ events }) => {
	const [data, setData] = useState([]);
	const [genres, setGenres] = useState([]);
	const COLORS = ['#fbc353', '#d81e5b', '#7E3C7E', '#ea4752', '#861b47'];

	const getGenres = useCallback(() => {
		const genreSet = new Set();
		events.forEach((event) => {
			const genresInSummary = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
			genresInSummary.forEach((genre) => {
				if (event.summary.includes(genre)) {
					genreSet.add(genre);
				}
			});
		});
		setGenres((prevGenres) => {
			const newGenres = [...genreSet];
			if (JSON.stringify(prevGenres) !== JSON.stringify(newGenres)) {
				return newGenres;
			}
			return prevGenres;
		});
	}, [events]);

	const getData = useCallback(() => {
		const data = genres.map((genre) => {
			const filteredEvents = events.filter((event) => event.summary.includes(genre));
			return {
				name: genre,
				value: filteredEvents.length,
			};
		});
		setData(data);
	}, [events, genres]);

	useEffect(() => {
		if (events.length > 0) {
			getGenres();
		}
	}, [events, getGenres]);

	useEffect(() => {
		if (genres.length > 0) {
			getData();
		}
	}, [genres, getData]);

	const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
		const RADIAN = Math.PI / 180;
		const radius = outerRadius * 1.18;
		const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.07;
		const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.07;
		return percent ? (
			<text
				x={x}
				y={y}
				fill="#f9f9f9"
				fontSize={12}
				textAnchor={x > cx ? 'start' : 'end'}
				dominantBaseline="central">
				{`${genres[index]} ${(percent * 100).toFixed(0)}%`}
			</text>
		) : null;
	};

	return (
		<ResponsiveContainer
			width="99%"
			height={400}>
			<p>Topic distribution:</p>
			<PieChart margin={{ left: 10, right: 10 }}>
				<Tooltip />
				<Pie
					data={data}
					dataKey="value"
					nameKey="name"
					outerRadius={130}
					labelLine={true}
					label={renderCustomizedLabel}>
					{data.map((entry, index) => (
						<Cell
							key={`cell-${index}`}
							fill={COLORS[index % COLORS.length]}
							stroke="none"
						/>
					))}
				</Pie>
				<Legend
					iconSize={15}
					layout="horizontal"
					verticalAlign="bottom"
					align="center"
					formatter={(value) => (
						<span style={{ color: '#eee', fontSize: '11px', fontWeight: '300' }}>{value}</span>
					)}
				/>
			</PieChart>
		</ResponsiveContainer>
	);
};

EventGenresChart.propTypes = {
	events: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default EventGenresChart;
