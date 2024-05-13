import './styles.css';
import { PaddleProps } from './PaddleProps';

export default function Paddle(props: PaddleProps) {
	return (
		<div
			className='paddle'
			style={{
				height: props.height,
				width: props.width,
				bottom: props.bottom,
				left: props.left,
			}}
		></div>
	);
}
