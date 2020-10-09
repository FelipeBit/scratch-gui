/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import ScratchBuddyStaticTips from './scratch-buddy-static-tips.jsx';
import scratchCatIcon from './scratch-cat.png';
import styles from './scratch-buddy.css';
import api from './api';

const SpeechBubble = () =>
// const {content} = props;

// const isArray = typeof content !== 'string';
/* let tipsList;

    if (isArray) {
        tipsList = content.map(item =>
            (<div key={item.id}>
                <img
                    heigth={'50'}
                    width={'50'}
                    src={`${item.file.path}${item.file.name}`}
                />
            </div>)
        );
    }*/

    (
        <div className={styles.speechBubble}>
            <section className={styles.nestedListGrid}>
                <ScratchBuddyStaticTips />
                {/* isArray ?
                    <ScratchBuddyStaticTips tipsList={content} /> :
                <ReactMarkdown source={content} />*/}
            </section>
        </div>)
;

/*
SpeechBubble.propTypes = {
    content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string])
};
*/

class ScratchBuddy extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            speechBubbleManualOpen: false,
            speechBubbleDynamicOpen: false
        };
        this.handleClick = this.handleClick.bind(this);
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

                localStorage.setItem('staticTips', JSON.stringify(data));
            })
            .catch(error => {
                // handle error
            })
            .then(() => {
                // always executed
            });
    }

    handleClick () {
        this.setState({
            speechBubbleManualOpen: !this.state.speechBubbleManualOpen
        });
    }
    render () {
        return (
            <section className={styles.grid}>
                <div className={styles.item} />
                <div className={styles.item}>
                    <section className={styles.nestedGrid}>
                        <div className={styles.item}>
                            {this.state.speechBubbleManualOpen || this.state.speechBubbleDynamicOpen ?
                                (this.state.speechBubbleManualOpen ?
                                    <SpeechBubble /* content={this.state.speechBubbleStaticContent}*/ /> :
                                    null // <SpeechBubble content={this.state.speechBubbleDynamicContent} />
                                ) :
                                null}
                        </div>
                        <div
                            onClick={this.handleClick}
                            className={styles.item}
                        >
                            <img
                                className={styles.scratchCatIcon}
                                src={scratchCatIcon}
                            />
                        </div>
                    </section>
                </div>
            </section>
        );
    }
}

export default ScratchBuddy;
