import MyNavbar from '../components/Navbar';
import DisplayPoki from '../components/DisplayPoki';
import { Container } from 'react-bootstrap';

export default function Index() {
  return (
    <>
      <MyNavbar />
      <Container key="maincontainer">
        <div style={{ margin: 20 }} />

        <DisplayPoki />

      </Container>
    </>
  )
}
