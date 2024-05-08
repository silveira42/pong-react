import './styles.css';

function Ball(props) {
	return (
		<div
			className='ball-container'
			style={{
				top: props.position.y,
				left: props.position.x,
			}}
		></div>
	);
}

export default Ball;
