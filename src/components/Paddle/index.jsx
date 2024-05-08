import './styles.css';

function Paddle(props) {
	return (
		<div
			className='paddle-container'
			style={{
				top: props.position.y,
				left: props.position.x,
			}}
		></div>
	);
}

export default Paddle;
