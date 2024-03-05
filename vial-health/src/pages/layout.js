'use client';

import { useState, useEffect } from "react";

import { MantineProvider, UnstyledButton, Group, Text, Pagination, Table, TextInput, Paper } from '@mantine/core';

import { Select } from '@mantine/core';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faArrowDown, faArrowUp, faArrowsUpDown } from '@fortawesome/free-solid-svg-icons'


function TableHeader({ children, reversed, sorted, onSort }) {
    const Icon = sorted ? (reversed ? faArrowUp : faArrowDown) : faArrowsUpDown;
    return (
        <Table.Th>
            <UnstyledButton onClick={onSort}>
            <Group justify="space-between">
                <Text fw={500} fz="sm">
                    {children}
                </Text>
                <FontAwesomeIcon icon={Icon} />
            </Group>
            </UnstyledButton>
        </Table.Th>
    );
}

function TableRow({ row }) {
    return (
        <Table.Tr key={row.id}>
            <Table.Td>{row.name}</Table.Td>
            <Table.Td>{row.age}</Table.Td>
            <Table.Td>{row.gender}</Table.Td>
            <Table.Td>{row.diagnosisDate}</Table.Td>
            <Table.Td>{row.status}</Table.Td>
        </Table.Tr>
    )
}


export default function RootLayout({ props }) {
    function chunk(array, size) {
        if (!array.length) {
            return [];
        }
        const head = array.slice(0, size);
        const tail = array.slice(size);
        return [head, ...chunk(tail, size)];
    }

    const [filterKey, setFilterKey] = useState(null);
    const [filter, setFilter] = useState(null);
    const [numEntries, setNumEntries] = useState(10);
    const [search, setSearch] = useState('');
    const [sortedData, setSortedData] = useState(chunk(props, 10));
    const [sortBy, setSortBy] = useState(null);
    const [reverseSortDirection, setReverseSortDirection] = useState(false);
    const [activePage, setPage] = useState(1);

    const [rows, setRows] = useState(sortedData[0].map((element) => (<TableRow row={element} key={element.id}/>)));

    useEffect(() => {
        setRows(sortedData[activePage - 1 < sortedData.length ? activePage - 1 : 0].map((element) => ((<TableRow row={element} key={element.id}/>))));
    }, [sortedData, activePage]);

    function sortData(data, payload) {
        const { sortBy } = payload;
      
        if (!sortBy) {
            return chunk(filterDataByFilterableField(filterDataByName(data.flat(), payload.search), payload.filter, payload.filterKey), numEntries);
        }
      
        return chunk(filterDataByFilterableField(filterDataByName(
            [...data.flat()].sort((a, b) => {
                if (payload.reversed) {
                    return b[sortBy].toString().localeCompare(a[sortBy], undefined, {'numeric': true});
                }
                return a[sortBy].toString().localeCompare(b[sortBy], undefined, {'numeric': true});
            }), payload.search), payload.filter, payload.filterKey), numEntries);
    }

    function filterDataByName(data, search) {
        const query = search.toLowerCase().trim();
        return data.filter((item) => item.name.toLowerCase().includes(query));
    }

    function filterDataByFilterableField(data, filter, filterKey) {
        if (filterKey === undefined || filterKey == null || filter == null || filter === undefined) return data;
        const query = filter.toLowerCase().trim();
        return data.filter((item) => item[filterKey].toLowerCase() == query);
    }

    const handleSearchChange = (event) => {
        const { value } = event.currentTarget;
        setSearch(value);
        setSortedData(sortData(props, { sortBy, reversed: reverseSortDirection, search: value, filter: filter, filterKey: filterKey }));
    };

    const handleFilterChange = (event, filter_key) => {
        setFilter(event);
        setFilterKey(filter_key);
        setSortedData(sortData(props, { sortBy, reversed: reverseSortDirection, search: search, filter: event, filterKey: filter_key }));
    };

    const setSorting = (field) => {
        const reversed = field === sortBy ? !reverseSortDirection : false;
        setReverseSortDirection(reversed);
        setSortBy(field);
        setSortedData(sortData(props, { sortBy: field, reversed, search }));
    };

    return (   
        <MantineProvider>
            <div style={{width: "18%", float: "right", margin: "1%"}}>
                <Paper shadow="xs" p="xl">
                    <TextInput
                        placeholder="Search by name"
                        mb="md"
                        leftSection={<></>}
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <Text>Filter By</Text>
                    <Select
                        label="Gender"
                        placeholder="Pick value"
                        data={[... new Set(sortedData.flat().map((a) => a.gender))]}
                        value={filter}
                        onChange={(e) => handleFilterChange(e, "gender")}
                    />
                    <Select
                        label="Diagnosis date"
                        placeholder="Pick value"
                        data={[... new Set(sortedData.flat().map((a) => a.diagnosisDate))]}
                        value={filter}
                        onChange={(e) => handleFilterChange(e, "diagnosisDate")}
                    />
                    <Select
                        label="Status"
                        placeholder="Pick value"
                        data={[... new Set(sortedData.flat().map((a) => a.status))]}
                        value={filter}
                        onChange={(e) => handleFilterChange(e, "status")}
                    />
                </Paper>
            </div>
            <div style={{width: "78%", float: "left", margin: "1%"}}>
                <Paper shadow="xs" p="xl">
                    <Table stickyHeader>
                        <Table.Thead>
                            <Table.Tr>
                                <TableHeader 
                                    sorted={sortBy === 'name'} 
                                    reversed={reverseSortDirection} 
                                    onSort={() => setSorting('name')}
                                >
                                    Name
                                </TableHeader>
                                <TableHeader 
                                    sorted={sortBy === 'age'} 
                                    reversed={reverseSortDirection} 
                                    onSort={() => setSorting('age')}
                                >
                                    Age
                                </TableHeader>
                                <TableHeader 
                                    sorted={sortBy === 'gender'} 
                                    reversed={reverseSortDirection} 
                                    onSort={() => setSorting('gender')}
                                >
                                    Gender
                                </TableHeader>
                                <TableHeader 
                                    sorted={sortBy === 'diagnosisDate'} 
                                    reversed={reverseSortDirection} 
                                    onSort={() => setSorting('diagnosisDate')}
                                >
                                    Diagnosis date
                                </TableHeader>
                                <TableHeader 
                                    sorted={sortBy === 'status'} 
                                    reversed={reverseSortDirection} 
                                    onSort={() => setSorting('status')}
                                >
                                    Status
                                </TableHeader>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                    <Pagination 
                        total={sortedData.flat().length / numEntries + (sortedData.flat().length % numEntries == 0 ? 0 : 1)} 
                        value={activePage} 
                        onChange={setPage} 
                        mt="sm"
                    />
                </Paper>
            </div>
        </MantineProvider>
    );
}
