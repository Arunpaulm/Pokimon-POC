import React, { useState, useContext } from "react";
import useSwr from 'swr'
import Image from 'next/image';

import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';

const fetcher = (url) => fetch(url).then((res) => res.json())

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
    const { data, error, isLoading } = useSwr('/api/api', fetcher)

    if (error) return <div>Failed to load users</div>
    if (isLoading) return <div>Loading...</div>
    if (!data) return null

    return (
        <Row className="md-12" style={{ backgroundColor: "lightgrey" }}>
            {data.map(poki => (
                <Card style={{ width: '18rem', margin: 20, alignItems: "center" }}>
                    <Image style={{ margin: 20 }} priority src={require("../public/sprites/" + poki.id + ".svg")} width={200} height={200} alt="..." />
                    <Card.Body style={{ width: "100%" }}>
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