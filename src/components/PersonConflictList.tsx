import React from "react";
import { Conflict, conflictablePersonFields } from "../Interfaces";
import { Label, Octicon, Text, Stack, Box, Link } from "@primer/react";
import { DataTable, Table } from '@primer/react/experimental'
import { AlertFillIcon, AlertIcon, CheckIcon } from "@primer/octicons-react";
import { Link as RouterLink } from 'react-router-dom'

interface PersonConflictListProps {
    conflicts: Conflict[];
}

export default function PersonConflictList(props: PersonConflictListProps) {
    const openConflicts = (closed: boolean = false) => {
        return props.conflicts.filter((conflict) => closed ? !conflict.open : conflict.open)
    }
    if (openConflicts().length == 0) {
        return <Text>This person has no conflicts.</Text>
    }
    return (
        <Table.Container>
            <DataTable
                aria-labelledby="conflicts"
                aria-describedby="conflicts-subtitle"
                data={props.conflicts}
                columns={[
                    {
                        rowHeader: true,
                        header: () => {
                            return (
                                <>
                                    <Box sx={{ color: 'black' }}>
                                        <Octicon icon={AlertFillIcon} />
                                        <Text sx={{ padding: 2 }} >{openConflicts().length} Open</Text>
                                    </Box>
                                    <Box>
                                        <Octicon icon={CheckIcon} />
                                        <Text sx={{ padding: 2 }} >{openConflicts(true).length} Closed</Text>
                                    </Box>
                                </>
                            )
                        },
                        field: 'type',
                        renderCell: (row: Conflict) => {
                            return <Box>
                                <Octicon icon={row.type == "conflict" ? AlertFillIcon : AlertIcon} /> <Link as={RouterLink} to={`/conflicts/${row.id}`} sx={{ padding: 2 }}>{row.field.replaceAll("_", " ").toUpperCase()}</Link>
                            </Box>
                        }
                    }
                ]}
            />
        </Table.Container>
    )
}