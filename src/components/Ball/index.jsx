import './styles.css';

function Ball(props) {
	return (
		<div
			className='ball'
			style={{
				height: props.size,
				width: props.size,
				top: props.position.y,
				left: props.position.x,
			}}
		></div>
	);
}

export default Ball;
