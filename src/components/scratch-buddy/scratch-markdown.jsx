/* eslint-disable react/no-children-prop */
import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';


class ScratchMarkdown extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }

    render () {
        return (<ReactMarkdown
            escapeHtml={false}
            source={this.props.markdownText}
        />
        );
    }

}

ScratchMarkdown.propTypes = {
    markdownText: PropTypes.string
};


export default ScratchMarkdown;
