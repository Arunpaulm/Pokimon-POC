import React, { useState, useContext } from "react";
import useSwr from 'swr'
import Image from 'next/image';

import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';

const fetcher = (url) => fetch(url).then((res) => res.json())

const variants = {
    "hp": "success",
    "attack": "danger",
    "defense": "warning",
    "special-attack": "info",
    "special-defense": "warning",
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
                        <Card.Title>{poki.name.charAt(0).toUpperCase() + poki.name.slice(1)}</Card.Title>
                        <Card.Text>
                            Type: {poki.types?.map(({ type }) => type.name).join(", ")}
                        </Card.Text>
                        <Card.Text>
                            {poki.stats.map(currentstat => {
                                const statName = currentstat.stat.name?.replace("-", " ")
                                const StatDisplayName = statName.charAt(0).toUpperCase() + statName.slice(1)
                                return (
                                    <div>
                                        <div>
                                            {StatDisplayName}: {currentstat.base_stat}
                                        </div>
                                        <ProgressBar variant={variants[currentstat.stat.name]} animated={currentstat.base_stat >= 100} now={currentstat.base_stat} />
                                    </div>
                                )
                            }
                            )}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </Row>
    );
}