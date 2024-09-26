import React, { useEffect, useState } from "react";
import { Conflict, conflictablePersonFields, ConflictType } from "../Interfaces";
import { Label, Octicon, Text, Stack, Box, Link } from "@primer/react";
import { DataTable, Table } from '@primer/react/experimental'
import { AlertFillIcon, AlertIcon, CheckCircleFillIcon, CheckCircleIcon, CheckIcon, DiffAddedIcon } from "@primer/octicons-react";
import { Link as RouterLink } from 'react-router-dom'

interface PersonConflictListProps {
    conflicts: Conflict[];
    confirmed: boolean;
}

export default function PersonConflictList(props: PersonConflictListProps) {
    const [showClosed, setShowClosed] = useState(false)
    
    const openConflicts = (closed: boolean = false) => {
        return props.conflicts.filter((conflict) => props.confirmed || closed ? !conflict.open : conflict.open)
    }
    if (!props.confirmed && openConflicts(true).length == 0) {
        return <Text>This person has no conflicts.</Text>
    }
    if (props.confirmed && openConflicts(true).length == 0) {
        return <Text>This person has no confirmed data yet.</Text>
    }


    return (
        <Table.Container>
            <DataTable
                aria-labelledby="conflicts"
                aria-describedby="conflicts-subtitle"
                data={props.confirmed || showClosed ? props.conflicts : props.conflicts.filter((conflict) => conflict.open)}
                columns={[
                    {
                        rowHeader: true,
                        header: () => {
                            return (
                                <>
                                    {!props.confirmed ? <>
                                        <Box sx={{ color: 'black' }}>
                                            <Octicon icon={AlertFillIcon} />
                                            <Text sx={{ padding: 2 }} >{openConflicts().length} Open</Text>
                                        </Box>

                                        <Box>
                                            <Octicon icon={CheckIcon} sx={{ color: showClosed ? 'black' : 'unset' }} />
                                            <Link sx={{ padding: 2, color: showClosed ? 'black' : 'unset' }} onClick={() => setShowClosed(!showClosed)} >{openConflicts(true).length} Closed</Link>
                                        </Box>
                                    </>
                                        : <Box sx={{ color: 'black' }}>
                                            <Octicon icon={CheckCircleFillIcon} />
                                            <Text sx={{ padding: 2 }} >{openConflicts().length} Confirmed</Text>
                                        </Box>
                                    }
                                </>
                            )
                        },
                        field: 'type',
                        renderCell: (row: Conflict) => {
                            return <Box>
                                {!props.confirmed && 
                                <Octicon icon={
                                    !row.open ? CheckCircleIcon :
                                    row.type == "conflict" ? AlertFillIcon :
                                        row.type == "improvement" ? DiffAddedIcon :
                                            row.type == "confirmed" ? CheckCircleIcon :
                                                AlertIcon // for not_confirmed and any other (maybe future)
                                } />} <Link as={RouterLink} to={`/conflicts/${row.id}`} sx={{ color: 'unset', padding: !props.confirmed ? 2 : 'unset' }}>{row.field.replaceAll("_", " ").toUpperCase()}</Link>
                            </Box>
                        }
                    },
                    {
                        header: () => {
                            if (props.confirmed) return <></>
                            return <Text>Type</Text>
                        },
                        field: 'type',
                        renderCell: (row: Conflict) => {
                            if (props.confirmed) return <></>
                            return <>
                                {row.type == "conflict" && <Label variant='severe'>Conflict</Label>}
                                {row.type == "not_confirmed" && <Label variant='attention'>Not confirmed</Label>}
                                {row.type == "improvement" && <Label variant='accent'>Improvement</Label>}
                                {row.type == "confirmed" && <Label variant='success'>Confirmed</Label>}
                            </>
                        }
                    }
                ]}
            />
        </Table.Container>
    )
}