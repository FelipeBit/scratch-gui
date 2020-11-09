import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

import api from './api';
import styles from './scratch-buddy-static-tips.css';
import ScratchBuddySpinner from '../scratch-buddy-spinner/scratch-buddy-spinner.jsx';
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

        const allLis = document.querySelectorAll('g.blocklyBlockCanvas');

        console.log('Aqui', allLis);
        console.log(allLis[0].children[0]);

        const blocksWrappers = allLis[0].children;
        /*
        allLis[0].children.forEach(element => {
            confirm.log('wraper de blocoss', element);
        });
        */
        console.log(allLis[0].children.length);

        for (let index = 0; index < blocksWrappers.length; index++) {
            const element = blocksWrappers[index];
            console.log('Blocos => ', element);
            const s = new XMLSerializer();
            const str = s.serializeToString(element);
            console.log('stringfied', str);

            console.log((str.split(new RegExp('data-category="motion"' /* 'texto da tag' ou 'data-category="motion"'/, 'gi')).length - 1));


        }


        if ('speechSynthesis' in window && !this.state.tipOpen) {
            // Synthesis support. Make your web apps talk!
            console.log('TESTE');

            const utterance = new SpeechSynthesisUtterance();

            utterance.text = selectedTipText;
            utterance.lang = 'pt-br';
            utterance.rate = 0.9;
            utterance.pitch = 3;

            speechSynthesis.speak(utterance);

        } else {
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
                                <button onClick={() => this.handleClick('', '')}>{'X'}</button>
                                <ReactMarkdown source={this.state.selectedTipMarkdowntext} />
                            </>) :
                            this.state.tipsList
                    )
                }
            </div>

        );
    }
}

export default ScratchBuddyStaticTips;
