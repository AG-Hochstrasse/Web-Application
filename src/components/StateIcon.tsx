import React, { useEffect, useState } from 'react';
import { Octicon } from '@primer/react';

import { IssueOpenedIcon, IssueClosedIcon, IssueTrackedByIcon } from '@primer/octicons-react';


const StateIcon = (props: any) => {
    switch (props.state) {
        case 'open':
            return <Octicon icon={IssueOpenedIcon} color='#1a7f37' />
        case 'closed':
            return <Octicon icon={IssueClosedIcon} color='#8250df' />
        default:
            return <></>
    }
};

export default StateIcon;