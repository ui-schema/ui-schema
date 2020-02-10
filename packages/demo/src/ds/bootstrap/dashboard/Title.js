import React from 'react';
import PropTypes from 'prop-types';

export default function Title(props) {
    return (
        <h6>
            {props.children}
        </h6>
    );
}

Title.propTypes = {
    children: PropTypes.node,
};
