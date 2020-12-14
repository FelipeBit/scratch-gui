import React from 'react';
import PropTypes from 'prop-types';


import api from './api';
import styles from './scratch-buddy-static-tips.css';
import ScratchBuddySpinner from '../scratch-buddy-spinner/scratch-buddy-spinner.jsx';
import ScratchMarkdown from './scratch-markdown.jsx';

class ScratchBuddyStaticTips extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: true,
            tipsList: '',
            tipOpen: false,
            selectedTipMarkdowntext: '',
            selectedTipText: ''

        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {
        api.get('/static-tips')
            .then(response => {
                // handle success
                const {data} = response;

                if (!data) {
                    this.setState({tipsList: ''});
                    return;
                }

                const tipsList = data.map(
                    item =>
                        (<div key={item.id}>
                            <img
                                className={styles.tip}
                                heigth={'50'}
                                width={'50'}
                                src={`${item.file.path}${item.file.name}`}
                                onClick={() => this.handleClick(item.markdownText, item.text)}
                            />
                        </div>)
                );

                this.setState({tipsList});

            })
            .catch(error => {
                // handle error
            })
            .then(() => {
                this.setState({isLoading: false});
            });
    }

    handleClick (selectedTipMarkdowntext, selectedTipText) {
        this.setState({
            tipOpen: !this.state.tipOpen,
            selectedTipMarkdowntext,
            selectedTipText
        });


        if ('speechSynthesis' in window && !this.state.tipOpen) {

            if (this.props.soundIsOn){
                const utterance = new SpeechSynthesisUtterance();

                utterance.text = selectedTipText;
                utterance.lang = 'pt-br';
                // utterance.rate = 0.9;
                utterance.pitch = 3;

                speechSynthesis.speak(utterance);
            }

        } else {
            speechSynthesis.pause();
            speechSynthesis.cancel();
        }

    }

    render () {

        return (
            <div>
                { this.state.isLoading ?
                    <ScratchBuddySpinner /> :
                    (
                        this.state.tipOpen ?
                            (<>
                                <div className={styles.buttonDiv}>
                                    <button
                                        className={styles.closeButton}
                                        onClick={() => this.handleClick('', '')}
                                    >{'X'}</button>
                                </div>
                                <div>
                                    <ScratchMarkdown markdownText={this.state.selectedTipMarkdowntext} />
                                    {/* <ReactMarkdown source={this.state.selectedTipMarkdowntext} />*/}
                                </div>
                            </>) : (<>
                                <div className={styles.buttonDiv}>
                                    <button
                                        className={styles.closeButton}
                                        onClick={() => this.props.func()}
                                    >{'X'}</button>
                                </div>
                                <div>
                                    {this.state.tipsList}
                                </div>
                            </>)

                    )
                }
            </div>

        );
    }
}

ScratchBuddyStaticTips.propTypes = {
    soundIsOn: PropTypes.bool,
    func: PropTypes.func
};

export default ScratchBuddyStaticTips;
