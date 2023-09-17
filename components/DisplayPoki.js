import React, { useState, useEffect } from "react";
// import useSwr from 'swr'
import Image from 'next/image';

import {
    Row, Col,
    Card,
    ProgressBar,
    Form,
    InputGroup,
    Dropdown
} from 'react-bootstrap';

// const fetcher = (url) => fetch(url).then((res) => res.json())

const stats = [
    "hp",
    "attack",
    "defense",
    "special_attack",
    "special_defense",
    "speed"
]

const variants = {
    "hp": "success",
    "attack": "danger",
    "defense": "warning",
    "special_attack": "info",
    "special_defense": "warning",
    "speed": ""
}

export default function DisplayPoki() {
    const [validated, setValidated] = useState(false);
    // const { data, error, isLoading } = useSwr('/api/api', fetcher)

    // if (error) return <div>Failed to load users</div>
    // if (isLoading) return <div>Loading...</div>
    // if (!data) return null

    const [data, setData] = useState(null)
    const [pokimon, setPokimon] = useState([{}])
    const [isLoading, setLoading] = useState(true)
    const [searchKeyword, setSearchKeyword] = useState("")
    const [selectedSort, setSelectedSort] = useState("default")
    const [selectedOrder, setSelectedOrder] = useState(true)

    useEffect(() => {
        fetch('/api/api')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
                setPokimon(data)
            })
    }, [])

    useEffect(() => {
        if (searchKeyword.length === 0) {
            setPokimon(data)
        }
    }, [searchKeyword])

    useEffect(() => {
        const ascendingOrderFunction = (v1, v2) => v1[selectedSort] - v2[selectedSort]
        const ascendingNameOrderFunction = (v1, v2) => v1.name.localeCompare(v2.name)
        const descendingOrderFunction = (v1, v2) => v2[selectedSort] - v1[selectedSort]
        const descendingNameOrderFunction = (v1, v2) => v2.name.localeCompare(v1.name)

        let orderFunction = () => { }

        if (selectedSort === "name") {
            orderFunction = selectedOrder ? ascendingNameOrderFunction : descendingNameOrderFunction
        } else {
            orderFunction = selectedOrder ? ascendingOrderFunction : descendingOrderFunction
        }

        const modifiedData = pokimon.sort(orderFunction)
        setPokimon(modifiedData)
        setLoading(false)
    }, [selectedSort, selectedOrder])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No pokimon data found</p>

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        event.preventDefault();
        setValidated(true);

        if (searchKeyword) {
            const modifiedData = data.filter(poki => {
                const regex = new RegExp(searchKeyword, "i")
                return poki.name.match(regex)
            })
            setPokimon(modifiedData)
            setValidated(false);
        } else {
            setPokimon(data)
        }
    };

    const handleSort = (stat) => {
        setLoading(true)
        setSelectedSort(stat)
    }

    const handleOrder = () => {
        setLoading(true)
        setSelectedOrder(!selectedOrder)
    }

    return (
        <Row className="md-12" style={{ backgroundColor: "lightgrey", borderRadius: 25, justifyContent: "center", alignItems: "center" }}>
            <Row style={{ marginTop: 10, justifyContent: "center", alignItems: "center" }}>
                <Col md={7}>
                    <Form style={{ margin: 20 }} noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Col} md="4" controlId="validationCustomSearchKeyword">
                            <InputGroup hasValidation style={{ width: "45vw" }}>
                                <InputGroup.Text id="inputGroupPrepend">Search</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter keyword and press enter to search"
                                    aria-describedby="inputGroupPrepend"
                                    required
                                    value={searchKeyword}
                                    onChange={(event) => {
                                        setSearchKeyword(event.target.value)
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Enter keyword to search.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={3}>
                    <Dropdown style={{ alignSelf: "flex-end" }}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Sort By ({selectedSort})
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {["name", ...stats].map((stat, index) => (<Dropdown.Item key={stat + index} onClick={handleSort.bind(this, stat)} >{stat}</Dropdown.Item>))}
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col md={1}>
                    <Form.Check
                        type={"checkbox"}
                        id={"sort-checkbox"}
                        label={"Ascending"}
                        checked={selectedOrder}
                        onChange={handleOrder}
                    />
                </Col>
            </Row>

            <Row className="md-12" style={{ padding: 0, margin: 0, justifyContent: "center", alignItems: "center" }}>
                {pokimon?.map(poki => (
                    <Card key={"poki" + poki?.id + "card"} style={{ width: '18rem', margin: 20, alignItems: "center" }}>
                        <Image key={"poki" + poki?.id + "image"} style={{ margin: 20 }} priority src={require("../public/sprites/" + poki.id + ".svg")} width={200} height={200} alt="..." />
                        <Card.Body key={"poki" + poki?.id + "body"} style={{ width: "100%", paddingBottom: 30 }}>
                            <Card.Title key={"poki" + poki?.id + "title"}>{poki?.name}</Card.Title>
                            <Card.Text key={"poki" + poki?.id + "type"}>
                                Type: {poki?.type}
                            </Card.Text>
                            {stats.map((statIndex, index) => {
                                const statName = statIndex?.replace("_", " ")
                                const StatDisplayName = statName.charAt(0).toUpperCase() + statName.slice(1)
                                const statValue = poki[statIndex]
                                return (
                                    <div key={"poki" + poki?.id + "stats" + index}>
                                        <div key={"poki" + poki?.id + "stat" + index}>
                                            {StatDisplayName}: {statValue}
                                        </div>
                                        <ProgressBar variant={variants[statIndex]} animated={statValue >= 100} now={statValue} />
                                    </div>
                                )
                            })}
                        </Card.Body>
                    </Card>
                ))}
            </Row>
        </Row>
    );
}