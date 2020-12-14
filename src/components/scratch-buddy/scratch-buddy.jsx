/* eslint-disable max-len */
/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import PropTypes from 'prop-types';

import ScratchBuddyStaticTips from './scratch-buddy-static-tips.jsx';
import scratchCatIconOn from './scratch-cat.png';
import scratchCatIconOff from './scratch-cat-off.png';
import soundOnIcon from './sound-on.png';
import soundOffIcon from './sound-off.png';
import tipsOnIcon from './turn-on.png';
import tipsOffIcon from './turn-off.png';
import styles from './scratch-buddy.css';
import api from './api';
import scratchSpeechSynthesis from './speech-synthesis';
import ScratchMarkdown from './scratch-markdown.jsx';

const SpeechBubbleManual = ({tipsIsOn, soundIsOn, func}) => {
    if (!tipsIsOn) return null;

    return (<div className={styles.speechBubble}>
        <section className={styles.nestedListGrid}>
            <ScratchBuddyStaticTips
                soundIsOn={soundIsOn}
                func={func}
            />
        </section>
    </div>);
}
;

SpeechBubbleManual.propTypes = {
    tipsIsOn: PropTypes.bool,
    soundIsOn: PropTypes.bool,
    func: PropTypes.func
};

const SpeechBubbleDynamic = ({tipsIsOn, speech, markdownText, soundIsOn, secondsOpen, func}) => {
    // MOSTRA MENSAGEM POR X SEGUNDOS, CONFORME DEFINIDO NO REGISTRO DO BANCO
    if (!tipsIsOn) return null;

    if (soundIsOn) {
        scratchSpeechSynthesis(speech);
    }

    setTimeout(func, secondsOpen);

    return (
        <div className={styles.speechBubble}>
            <section className={styles.nestedListGrid}>
                <ScratchMarkdown
                    markdownText={markdownText}
                />
            </section>
        </div>
    );
};

SpeechBubbleDynamic.propTypes = {
    tipsIsOn: PropTypes.bool,
    speech: PropTypes.string,
    markdownText: PropTypes.string,
    soundIsOn: PropTypes.bool,
    secondsOpen: PropTypes.number,
    func: PropTypes.func
};

SpeechBubbleDynamic.defaultProps = {
    tip: {},
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
            dynamicTip: {},
            soundIsOn: true,
            tipsIsOn: true,
            oldState: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleTipsOptionClick = this.handleTipsOptionClick.bind(this);
        this.handleSoundOptionClick = this.handleSoundOptionClick.bind(this);
        this.closeDynamicBubble = this.closeDynamicBubble.bind(this);
        this.closeManualBubble = this.closeManualBubble.bind(this);
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

            });

        // VERIFICA SE ALGUMA PEÇA FOI MOVIDA OU INSERIDA
        window.setInterval(() => {
            const lastBlockInserted = localStorage.getItem('lastBlockInserted');
            const lastBlockMessage = localStorage.getItem('lastBlockMessage');
            const blocksArray = localStorage.getItem('blocks');
            const isOutside = localStorage.getItem('outside');

            let blockTimesMoved = 0;

            if (isOutside) {

                this.setState({
                    dynamicTip: {
                        id: 0,
                        text: 'Fora da área permitida',
                        markdownText: 'Fora da área permitida',
                        secondsUntilDisplay: 5,
                        secondsDisplaying: 5000
                    },
                    speechBubbleDynamicOpen: true
                });

                localStorage.removeItem('outside');
            } else {

                if (blocksArray) {
                    blockTimesMoved = JSON.parse(blocksArray).find(block =>
                        block.id === JSON.parse(lastBlockInserted).id
                    );
                } else {
                    blockTimesMoved = 0;
                }

                if (blockTimesMoved && blockTimesMoved.timesMoved === 1) {
                    if (!this.state.speechBubbleManualOpen && !this.state.speechBubbleDynamicOpen){

                        if (lastBlockInserted !== lastBlockMessage) {
                            localStorage.setItem('lastBlockMessage', lastBlockInserted);

                            const tip = JSON.parse(lastBlockInserted);

                            api.get(`/dynamic-tips/${tip.opcode}`)
                                .then(response => {
                                    const {dynamicTip, readingTime} = response.data;
                                    dynamicTip.readingTime = readingTime;

                                    if (dynamicTip) {
                                        this.setState({
                                            dynamicTip: dynamicTip,
                                            speechBubbleDynamicOpen: true
                                        });
                                    }

                                })
                                .catch(() => {
                                    this.setState({
                                        speechBubbleDynamicOpen: false
                                    });
                                });

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
        scratchSpeechSynthesis('', true);
        return;
    }

    closeManualBubble () {
        this.setState({
            speechBubbleManualOpen: false
        });
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
                                    <SpeechBubbleManual
                                        tipsIsOn={this.state.tipsIsOn}
                                        soundIsOn={this.state.soundIsOn}
                                        func={this.closeManualBubble}
                                    /> :
                                    (this.state.speechBubbleDynamicOpen ?
                                        <SpeechBubbleDynamic
                                            tipsIsOn={this.state.tipsIsOn}
                                            speech={this.state.dynamicTip.text}
                                            markdownText={this.state.dynamicTip.markdownText}
                                            soundIsOn={this.state.soundIsOn}
                                            secondsOpen={this.state.dynamicTip.readingTime || this.state.dynamicTip.secondsDisplaying}
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
