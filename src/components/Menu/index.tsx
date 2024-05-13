import { MenuProps } from './MenuProps';
import './styles.css';

export default function Menu(props: MenuProps) {
	return (
		<div className='menu-container'>
			<div
				onClick={props.handleClick}
				className='menu'
				style={{
					width:
						props.gameOrientation === 'horizontal'
							? props.longAxis
							: props.shortAxis,
					height:
						props.gameOrientation === 'vertical'
							? props.longAxis
							: props.shortAxis,
				}}
			>
				<div className='menu-options'>
					<h1>{props.title}</h1>
				</div>
				<div className='menu-options'>
					{props.options &&
						props.options.map(option => (
							<button
								className='menu-button'
								key={option.key}
								onClick={() =>
									props.handleSelection && props.handleSelection(option.key)
								}
							>
								{option.label}
							</button>
						))}
				</div>
			</div>
		</div>
	);
}
