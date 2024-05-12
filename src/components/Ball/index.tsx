import { BallProps } from './BallProps';
import './styles.css';

function Ball(props: BallProps) {
	return (
		<div
			className='ball'
			style={{
				height: props.size,
				width: props.size,
				top: props.position.shortAxis,
				left: props.position.longAxis,
			}}
		></div>
	);
}

export default Ball;
