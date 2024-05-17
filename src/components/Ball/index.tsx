import './styles.css';
import { BallProps } from './BallProps';

function Ball(props: BallProps) {
	return (
		<div
			className='ball'
			style={{
				height: props.size,
				width: props.size,
				bottom: props.bottom,
				left: props.left,
			}}
		></div>
	);
}

export default Ball;
