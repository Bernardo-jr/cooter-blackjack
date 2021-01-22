import {Container,Row,Col,Card} from 'react-bootstrap';
export default function Carta(props){
    var pos=0;
    return (
        <Card border='dark'  style={{ width: '10rem',height:'15rem',padding:'0.125rem' }} className="justify-content-md-center">
        <Card.Body>
          <Card.Title className={props.color}>{props.numero}</Card.Title>
            <Container>
              {
                ("AJQK".includes(props.numero))
                ?<Row className={props.color + " justify-content-md-center"}><h1>{props.palo}</h1></Row>
                :Array.apply(null, { length: (props.numero%2===0)?(props.numero/2):(props.numero/2+1) }).map((e, i) => {
                  return <Row key={i} className={props.color}>
                     <Col>{props.palo}</Col>
                     {
                     ((pos=pos+2)<=props.numero)
                     ?<Col>{props.palo}</Col>
                     :<span></span>
                    }
                   </Row>
                   })
              }
            </Container>
        </Card.Body>
      </Card>
      );
}