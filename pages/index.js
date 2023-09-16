import MyNavbar from '../components/Navbar';
import DisplayPoki from '../components/DisplayPoki';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Index() {
  return (
    <>
      <MyNavbar />
      <Container>
        <div style={{ margin: 20 }}></div>

        <DisplayPoki></DisplayPoki>

      </Container>
    </>
  )
}
