import './styles.css';

export default function Paddle(props) {
	return (
		<div
			className='paddle'
			style={{
				height: props.height,
				width: props.width,
				top: props.position.y,
				left: props.position.x,
			}}
		></div>
	);
}
