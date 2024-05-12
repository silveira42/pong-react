import './styles.css';

export default function Paddle(props) {
	return (
		<div
			className='paddle'
			style={{
				height: props.height,
				width: props.width,
				top: props.position.shortAxis,
				left: props.position.longAxis,
			}}
		></div>
	);
}
