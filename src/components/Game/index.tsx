/* eslint-disable react-hooks/exhaustive-deps */
import './styles.css';
import Board from '../../components/Board';
import Menu from 'components/Menu';
import { GameStatus } from '../../pages/GamePage/enums/GameStatus';
import { OpponentMode } from '../../pages/GamePage/enums/OpponentMode';
import PauseMenu from 'components/PauseMenu';
import { GameProps } from './GameProps';

/*
 * Regarding the axis:
 * The short axis is the smallest of the two dimensions.
 * For example, if the screen is in portrait mode, the short axis is the width.
 * The long axis is the main direction of the ball.
 */

export default function Game(props: GameProps) {
	switch (props.gameStatus) {
		case GameStatus.InitialScreen:
			return (
				<div className='game-container'>
					<Menu
						title='Welcome!'
						gameOrientation={props.gameSettings.gameOrientation}
						shortAxis={props.gameSettings.boardShortAxis}
						longAxis={props.gameSettings.boardLongAxis}
						handleClick={props.handleNextScreen}
					/>
				</div>
			);
		case GameStatus.SelectOpponentMode:
			return (
				<div className='game-container'>
					<Menu
						title='Choose opponent mode:'
						gameOrientation={props.gameSettings.gameOrientation}
						shortAxis={props.gameSettings.boardShortAxis}
						longAxis={props.gameSettings.boardLongAxis}
						options={props.opponentModeOptions}
						handleSelection={props.handleChooseOpponentMode}
					/>
				</div>
			);
		case GameStatus.SelectKeys:
			return (
				<div className='game-container'>
					<Menu
						title={
							props.gameOptions.opponentMode === OpponentMode.Machine
								? 'Choose your keys:'
								: 'Choose player one keys:'
						}
						gameOrientation={props.gameSettings.gameOrientation}
						shortAxis={props.gameSettings.boardShortAxis}
						longAxis={props.gameSettings.boardLongAxis}
						options={props.selectKeysOptions}
						handleSelection={props.handleChooseKeys}
					/>
				</div>
			);
		case GameStatus.SelectGameMode:
			return (
				<div className='game-container'>
					<Menu
						title='Choose game mode:'
						gameOrientation={props.gameSettings.gameOrientation}
						shortAxis={props.gameSettings.boardShortAxis}
						longAxis={props.gameSettings.boardLongAxis}
						options={props.gameModeOptions}
						handleSelection={props.handleChooseGameMode}
					/>
				</div>
			);
		case GameStatus.Playing:
			return (
				<div className='game-container'>
					<div className='board-container'>
						<Board
							gameOrientation={props.gameSettings.gameOrientation}
							boardShortAxis={props.gameSettings.boardShortAxis}
							boardLongAxis={props.gameSettings.boardLongAxis}
							score={props.gameData.gameScore}
							isPaused={props.isPaused}
							playerOneKeys={props.gameOptions.playerOneKeys}
							playerTwoKeys={props.gameOptions.playerTwoKeys}
							playerSpeed={props.gameOptions.playerSpeed}
							ballSpeed={props.gameOptions.ballSpeed}
							opponentDifficulty={props.gameOptions.opponentDifficulty}
							opponentMode={props.gameOptions.opponentMode}
							handleChangePause={props.handleChangePause}
							handleScoreChange={props.handleScoreChange}
						/>
						{props.isPaused ? (
							<PauseMenu
								handleChangePause={props.handleChangePause}
								gameOrientation={props.gameSettings.gameOrientation}
								boardShortAxis={props.gameSettings.boardShortAxis}
								boardLongAxis={props.gameSettings.boardLongAxis}
								playerSpeed={props.gameOptions.playerSpeed}
								handleChangePlayerSpeed={props.handleChangePlayerSpeed}
								ballSpeed={props.gameOptions.ballSpeed}
								handleChangeBallSpeed={props.handleChangeBallSpeed}
								opponentDifficulty={props.gameOptions.opponentDifficulty}
								handleChangeOpponentDifficulty={
									props.handleChangeOpponentDifficulty
								}
								playerOneKeys={props.gameOptions.playerOneKeys.code}
								handleChooseKeys={props.handleChooseKeys}
								goalsPerMatch={props.gameOptions.goalsPerMatch}
								maxGoalsPerMatch={props.gameSettings.maxGoalsPerMatch}
								handleChangeGoalsPerMatch={props.handleChangeGoalsPerMatch}
								gameMode={props.gameOptions.gameMode}
								handleChooseGameMode={props.handleChooseGameMode}
							/>
						) : null}
					</div>
				</div>
			);
		default:
			return null;
	}
}
