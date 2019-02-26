import React from 'react';

// render forbidden error component
const Forbidden = () => {
    return(
        <div className="bounds">
            <h1>Forbidden</h1>
            <p>You are not authorized to view this page, the authorities have been notified.</p>
        </div>
    )
};

export default Forbidden;
