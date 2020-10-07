/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import scratchCatIcon from './scratch-cat.png';
import styles from './scratch-buddy.css';
import api from './api';

const SpeechBubble = props => {
    const {content} = props;

    const isArray = typeof content !== 'string';
    let tipsList;

    if (isArray) {
        tipsList = props.content.map(item =>
            <div key={item.id}>{item.displaySequence}</div>
        );
    }

    return (
        <div className={styles.speechBubble}>
            <section className={styles.nestedListGrid}>
                {isArray ? tipsList : <ReactMarkdown source={content} />}
                {/* <div className={styles.item}><div className={styles.tipsCategories}>1</div></div>

             <ReactMarkdown source={input} />*/}
            </section>
        </div>);
};

SpeechBubble.propTypes = {
    content: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.object), PropTypes.string])
};

class ScratchBuddy extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            speechBubbleOpen: false,
            speechBubbleContent: ''
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount () {
        api.get('/static-tips')
            .then(response => {
                // handle success
                const {data} = response;

                if (!data) {
                    this.setState({speechBubbleContent: ''});
                    return;
                }

                this.setState({speechBubbleContent: data});
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
            speechBubbleOpen: !this.state.speechBubbleOpen
        });
    }
    render () {
        return (
            <section className={styles.grid}>
                <div className={styles.item} />
                <div className={styles.item}>
                    <section className={styles.nestedGrid}>
                        <div className={styles.item}>
                            {this.state.speechBubbleOpen ?
                                <SpeechBubble content={this.state.speechBubbleContent} /> :
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
