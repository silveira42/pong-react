import './styles.css';
import { HeaderProps } from './HeaderProps';

export default function Header(props: HeaderProps) {
	return (
		<div
			className='header-container'
			style={{ height: props.height, width: props.width }}
		>
			<h2 className='header-score'>
				Game score {props.gameScore.player} - {props.gameScore.opponent}
			</h2>
			{props.showMatchScore ? (
				<h2 className='header-score'>
					Matches score {props.matchScore.player} - {props.matchScore.opponent}
				</h2>
			) : null}
		</div>
	);
}
