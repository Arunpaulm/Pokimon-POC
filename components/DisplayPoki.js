import React, { useState, useEffect } from "react";
// import useSwr from 'swr'
import Image from 'next/image';

import {
    Container,
    Row, Col,
    Card,
    Button,
    ProgressBar,
    Form,
    InputGroup
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
    const [pokimon, setPokimon] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [searchKeyword, setSearchKeyword] = useState("")

    useEffect(() => {
        fetch('/api/api')
            .then((res) => res.json())
            .then((data) => {
                setData(data)
                setLoading(false)
                setPokimon(data)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>

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

    return (
        <Row className="md-12" style={{ backgroundColor: "lightgrey", borderRadius: 25 }}>
            <Row style={{ marginTop: 10 }}>
                <Form style={{ margin: 20, width: "70vw" }} noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group as={Col} md="4" controlId="validationCustomSearchKeyword">
                        <InputGroup hasValidation style={{ width: "70vw" }}>
                            <InputGroup.Text id="inputGroupPrepend">Search</InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Enter keyword and press enter to search"
                                aria-describedby="inputGroupPrepend"
                                required
                                onChange={(event) => {
                                    setSearchKeyword(event.target.value)
                                }}
                                onKeyDown={(event) => {
                                    if (event.keyCode === 8 && searchKeyword.length === 1) {
                                        setPokimon(data)
                                    }
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Enter keyword to search.
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Row>

            {pokimon?.map(poki => (
                <Card style={{ width: '18rem', margin: 20, alignItems: "center" }}>
                    <Image style={{ margin: 20 }} priority src={require("../public/sprites/" + poki.id + ".svg")} width={200} height={200} alt="..." />
                    <Card.Body style={{ width: "100%", paddingBottom: 30 }}>
                        <Card.Title>{poki.name}</Card.Title>
                        <Card.Text>
                            Type: {poki.type}
                        </Card.Text>
                        <Card.Text>
                            {stats.map(statIndex => {
                                const statName = statIndex?.replace("_", " ")
                                const StatDisplayName = statName.charAt(0).toUpperCase() + statName.slice(1)
                                const statValue = poki[statIndex]
                                return (
                                    <div>
                                        <div>
                                            {StatDisplayName}: {statValue}
                                        </div>
                                        <ProgressBar variant={variants[statIndex]} animated={statValue >= 100} now={statValue} />
                                    </div>
                                )
                            })}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </Row>
    );
}