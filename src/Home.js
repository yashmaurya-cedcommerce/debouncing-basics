import { Frame, Loading, TextField, Page, Card, DataTable, ButtonGroup, Button, Select, SkeletonPage, SkeletonTabs } from '@shopify/polaris'
import React, { useCallback, useEffect, useState } from 'react'

export default function Home() {

    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false)
    const [rows, setRows] = useState([])
    const [headings, setHeadings] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [selected, setSelected] = useState(10)
    const [totalPages, setTotalPages] = useState(10)
    const [disablePagination, setDisablePagination] = useState(false)

    let startOffset = 0 
    let endOffset = 0

    const handleChange = useCallback((newValue) => {
        setValue(newValue)
        setLoading(true)
        setDisablePagination(true)
        setRows([])
    }, []);

    const fetchData = () => {
        var tempArray = []
        fetch(`https://jsonplaceholder.typicode.com/posts`)
            .then(res => res.json())
            .then(ans => {
                setHeadings(Object.keys(ans[0]))
                ans.forEach((item) => {
                    tempArray.push(Object.values(item))
                })
                setTotalPages(Math.ceil(ans.length / selected))
                startOffset = (pageNum - 1) * selected
                endOffset = (selected * pageNum) - 1
                tempArray = tempArray.slice(startOffset, endOffset)
                setRows([...tempArray])
                setDisablePagination(false)
            })
    }

    const openNext = () => {
        setPageNum(pageNum + 1)
        setLoading(true) 
        setDisablePagination(true)
        setRows([])
    }

    const openPrev = () => {
        setPageNum(pageNum - 1)
        setLoading(true)
        setDisablePagination(true)
        setRows([])
    }

    useEffect(() => {
        const myTimeout = setTimeout(() => {
            if (value !== '') {
                fetchData()
                setLoading(false)
            }
        }, 3000)
        return () => {
            clearTimeout(myTimeout)
        }
    }, [value, selected, pageNum])

    const handleSelectChange = useCallback((value) => {
        setSelected(value)
        setDisablePagination(true)
        setLoading(true)
        setRows([])
    }, []);

    const options = [
        { label: '10', value: '10' },
        { label: '20', value: '20' },
        { label: '40', value: '40' },
        { label: '50', value: '50' },
    ];

    return (
        <>
            <div className='container'>
                <TextField
                    label="Enter Something"
                    value={value}
                    onChange={handleChange}
                    autoComplete="off"
                />
            </div>
            <div style={{ height: '20px' }}>
                <Frame>
                    {(loading === true) ? <Loading /> : null}
                </Frame>
            </div>
            <Page>
                <Card title="Data Grid">
                    <div className='select-div'>
                        <Select
                            label="Number of Entries"
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                    </div>
                    {(loading === true) ? <SkeletonPage>
                        {
                            Array(10).fill(1).map((item, index) => {
                                return (<Card key={index}>
                                    <SkeletonTabs count={10} />
                                </Card>)
                            })
                        }
                    </SkeletonPage> : <>
                        <DataTable
                            columnContentTypes={[
                                'numeric',
                                'numeric',
                                'text',
                                'text',
                            ]}
                            headings={headings}
                            rows={rows}
                        />
                    </>}
                    <div className='pagination-div'>
                        <ButtonGroup segmented>
                            <Button disabled={(pageNum === 1) || (disablePagination===true)} onClick={() => openPrev()}>Prev</Button>
                            <Button disabled>{pageNum}/{totalPages}</Button>
                            <Button disabled={(pageNum === totalPages) || (disablePagination===true)} onClick={() => openNext()}>Next</Button>
                        </ButtonGroup>
                    </div>
                </Card>
            </Page>
        </>
    )
}
