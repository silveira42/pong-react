import './styles.css';
import { PauseMenuProps } from './PauseMenuProps';

export default function PauseMenu(props: PauseMenuProps) {
	return (
		<div
			className='pause-menu'
			style={{
				width:
					props.gameOrientation === 'horizontal'
						? props.boardLongAxis
						: props.boardShortAxis,
				height:
					props.gameOrientation === 'vertical'
						? props.boardLongAxis
						: props.boardShortAxis,
			}}
		>
			<button
				className='pause-menu-resume-button'
				onClick={() => {
					props.handleChangePause(false);
				}}
			>
				Resume
			</button>
			<div className='pause-menu-wrapper'>
				<h3>Player speed</h3>
				<input
					className='pause-menu-input-range'
					type='range'
					min='5'
					max='15'
				/>
			</div>
			<div className='pause-menu-wrapper'>
				<h3>Ball speed</h3>
				<input
					className='pause-menu-input-range'
					type='range'
					min='1'
					max='5'
				/>
			</div>
			<div className='pause-menu-wrapper'>
				<h3>Machine difficulty</h3>
				<input
					className='pause-menu-input-range'
					type='range'
					min='1'
					max='5'
				/>
			</div>
		</div>
	);
}
