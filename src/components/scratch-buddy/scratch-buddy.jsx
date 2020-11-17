/* eslint-disable react/prefer-stateless-function */
import ReactDOM from 'react-dom';
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import ScratchBuddyStaticTips from './scratch-buddy-static-tips.jsx';
import scratchCatIconOn from './scratch-cat.png';
import scratchCatIconOff from './scratch-cat-off.png';
import soundOnIcon from './sound-on.png';
import soundOffIcon from './sound-off.png';
import tipsOnIcon from './turn-on.png';
import tipsOffIcon from './turn-off.png';
import styles from './scratch-buddy.css';
import api from './api';

const SpeechBubbleManual = () =>

    (<div className={styles.speechBubble}>
        <section className={styles.nestedListGrid}>
            <ScratchBuddyStaticTips />
            {/* scratch buddy messages*/}
        </section>
    </div>)
;

const SpeechBubbleDynamic = ({tip, secondsOpen, func}) => {

    setTimeout(func, (secondsOpen * 1000));

    return (<div className={styles.speechBubble}>
        <section className={styles.nestedListGrid}>
            <p>{tip}</p>
        </section>
    </div>);

};

SpeechBubbleDynamic.propTypes = {
    tip: PropTypes.string,
    secondsOpen: PropTypes.number,
    func: PropTypes.func
};

SpeechBubbleDynamic.defaultProps = {
    tip: '',
    secondsOpen: 5
};

const TipsOption = ({isOn}) => (
    <img
        className={styles.scratchCatOptIcon}
        src={isOn ? tipsOnIcon : tipsOffIcon}
    />
);

TipsOption.propTypes = {
    isOn: PropTypes.bool
};

TipsOption.defaultProps = {
    isOn: true
};

const SoundOption = ({isOn}) => (
    <img
        className={styles.scratchCatOptIcon}
        src={isOn ? soundOnIcon : soundOffIcon}
    />
);

SoundOption.propTypes = {
    isOn: PropTypes.bool
};

SoundOption.defaultProps = {
    isOn: true
};


class ScratchBuddy extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            speechBubbleManualOpen: false,
            speechBubbleDynamicOpen: false,
            dynamicTip: '',
            soundIsOn: true,
            tipsIsOn: true,
            oldState: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleTipsOptionClick = this.handleTipsOptionClick.bind(this);
        this.handleSoundOptionClick = this.handleSoundOptionClick.bind(this);
        this.closeDynamicBubble = this.closeDynamicBubble.bind(this);
    }

    componentDidMount () {

        api.get('/static-tips')
            .then(response => {
                // handle success
                const {data} = response;

                if (!data) {
                    this.setState({speechBubbleStaticContent: ''});
                    return;
                }

            })
            .catch(error => {
                // handle error
            })
            .then(() => {
                // always executed
            });


        window.setInterval(() => {
            const lastBlockInserted = localStorage.getItem('lastBlockInserted');
            const lastBlockMessage = localStorage.getItem('lastBlockMessage');
            const blocksArray = localStorage.getItem('blocks');
            let blockTimesMoved = 0;

            // console.log('blocksArray', blocksArray);

            if (blocksArray) {
                blockTimesMoved = JSON.parse(blocksArray).find(block =>
                    block.id === JSON.parse(lastBlockInserted).id
                );
            } else {
                blockTimesMoved = 0;
            }

            // console.log('timesMoved', blockTimesMoved.timesMoved);

            if (blockTimesMoved && blockTimesMoved.timesMoved === 1) {
                if (!this.state.speechBubbleManualOpen && !this.state.speechBubbleDynamicOpen){

                    if (lastBlockInserted !== lastBlockMessage) {
                        localStorage.setItem('lastBlockMessage', lastBlockInserted);

                        const tip = JSON.parse(lastBlockInserted);

                        this.setState({
                            dynamicTip: tip.opcode,
                            speechBubbleDynamicOpen: true
                        });
                        // FAZ CHAMADA API

                    }

                } else {
                    localStorage.setItem('lastBlockMessage', lastBlockInserted);
                }
            }

            if (this.state.speechBubbleManualOpen){
                this.setState({
                    speechBubbleDynamicOpen: false
                });
            }

        }, 1000);

    }

    handleClick () {
        if (this.state.tipsIsOn || !this.state.speechBubbleDynamicOpen) {
            this.setState({
                speechBubbleManualOpen: !this.state.speechBubbleManualOpen
            });
        }
    }

    handleTipsOptionClick () {
        this.setState({
            tipsIsOn: !this.state.tipsIsOn
        });

        if (!this.state.tipsIsOn) {
            this.setState({
                speechBubbleManualOpen: false
            });
        }
    }

    handleSoundOptionClick () {
        this.setState({soundIsOn: !this.state.soundIsOn});
    }

    closeDynamicBubble () {

        this.setState({
            speechBubbleDynamicOpen: false
        });
        return;
    }

    render () {
        return (
            <section className={styles.grid}>
                <div className={styles.item} />
                <div className={styles.item}>
                    <section className={styles.nestedGrid}>
                        <section className={styles.nestedGridBalloon}>
                            <div className={styles.item} />
                            <div className={styles.item}>
                                {this.state.speechBubbleManualOpen ?
                                    <SpeechBubbleManual /* content={this.state.speechBubbleStaticContent}*/ /> :
                                    (this.state.speechBubbleDynamicOpen ?
                                        <SpeechBubbleDynamic
                                            tip={this.state.dynamicTip}
                                            secondsOpen={3}
                                            func={this.closeDynamicBubble}
                                        /> :
                                        null
                                    )}
                            </div>
                            <div className={styles.item} />
                        </section>
                        <div
                            onClick={this.handleClick}
                            className={styles.item}
                        >
                            <img
                                className={styles.scratchCatIcon}
                                src={this.state.tipsIsOn ? scratchCatIconOn : scratchCatIconOff}
                            />
                        </div>
                        <section className={styles.nestedGridButtons}>
                            <div
                                className={styles.item}
                            />
                            <div
                                className={styles.item}
                                onClick={this.handleTipsOptionClick}
                            >
                                <TipsOption
                                    isOn={this.state.tipsIsOn}
                                />
                            </div>
                            <div
                                className={styles.item}
                                onClick={this.handleSoundOptionClick}
                            >
                                <SoundOption
                                    isOn={this.state.soundIsOn}
                                />
                            </div>
                            <div
                                className={styles.item}
                            />
                        </section>

                    </section>
                </div>
            </section>
        );
    }
}

export default ScratchBuddy;
