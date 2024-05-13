import React from 'react';
import './styles.css';
import { HeaderProps } from './HeaderProps';

export default function Header(props: HeaderProps) {
	return (
		<div
			className='game-header-container'
			style={{ height: props.height, width: props.width }}
		>
			<div className='score-container'>
				<h2 className='score'>
					Game score {props.score.player} - {props.score.opponent}
				</h2>
				{props.showMatchScore ? (
					<h2 className='score'>
						Matches score {props.matchScore.player} -{' '}
						{props.matchScore.opponent}
					</h2>
				) : null}
			</div>
		</div>
	);
}
