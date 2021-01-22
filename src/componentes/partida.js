import {Component} from 'react';
import pichonImg from '../pichon.png';
import cooterImg from '../COOTER.png';
import Carta from './carta';
import {Container,Row,Col,Button,Card} from 'react-bootstrap';
const initialState = {
    pichon:[],
    puntosPichon:0,
    asPichon:false,
    fin:false,
    casa:[],
    puntosCasa:0,
    asCasa:false,
};
const valores=["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const  palos=["♣" , "♠", "♥" , "♦" ];
export default class Partida extends Component{

    
    numero=0;
    index=0;
    constructor(props){
        super(props);
        this.state=initialState;
        this.getCard=this.getCard.bind(this);
        this.plantarse=this.plantarse.bind(this);
        this.refresh=this.refresh.bind(this);
    }
    //evento inicial
    async componentDidMount(){
        await this.getCard(null,false);
        await this.getCard(null,true);
        await this.getCard(null,false);
        await this.getCard(null,true);
    }
    //El pichon se planta
    async plantarse(){
      var aux=this.state.casa;
      aux.forEach((c)=>{
        c.visible=true;
      });
      await this.setState({
        fin:true,
        casa:[...aux]
      });
    if(this.state.puntosPichon<21){
      while(this.state.puntosCasa<17){
        aux=this.state.casa;
        await this.getCard(null,this.state.casa,this.state.puntosCasa);
      }
    }
    }
   //reinicia la mano 
   async refresh(){
       await this.setState({...initialState,casa:[],pichon:[]});
        this.componentDidMount();
    }
    
  //cuenta los puntos   
  async contar(pts,as){
      let p=pts;
      if("JQK".includes(this.numero)){
        p=p+10;
        if(p>21&& as){
          p=p-10;
          as=false;
        }
      }else if(this.numero.includes("A")){
        if(p+11>21){
          p=p+1;
        }else{
          as=true;
          p=p+11;
        }
      }else{
          p=p+parseInt(this.numero);
          if(p>21&& as){
            p=p-10;
            as=false;
          }
      }
      return [p,as];
    }
    //valida que no se repitan las cartas
    async validar(){
      var exist=false;
      await this.state.casa.forEach((c)=>{
        if(c.numero===this.numero && c.index===this.index){
          exist=true;
        }
      });
      await this.state.pichon.forEach((c)=>{
        if(c.numero===this.numero && c.index===this.index){
          exist=true;
        }
      });
      console.log(exist);
      return exist;
    }
    //pide una carta
    async getCard(e,esCasa){
        this.index=Math.floor(Math.random() * palos.length);
        this.numero=valores[Math.floor(Math.random() * valores.length)];
        var exist=false;
        exist= await this.validar();

        while(exist){
          this.index=Math.floor(Math.random() * palos.length);
          this.numero=valores[Math.floor(Math.random() * valores.length)];
         exist = await this.validar();
        }

      var c,aux;
      if(esCasa){
        c=this.state.casa; 
        aux=await this.contar(this.state.puntosCasa,this.state.asCasa);
        if(c.length===0 || this.state.fin){
          c.push({numero:this.numero,index:this.index,visible:true});
        }else{
          c.push({numero:this.numero,index:this.index,visible:false});
        }
        await this.setState({casa:[...c],puntosCasa:parseInt(aux[0]),asCasa:aux[1]});
        if(this.state.puntosCasa>=21)
        this.plantarse(null);
      }else{
        c=this.state.pichon; 
        var points=this.state.puntosPichon;
        aux=await this.contar(points,this.state.asPichon);
        c.push({numero:this.numero,index:this.index});
        await this.setState({pichon:[...c],puntosPichon:parseInt((aux[0])),asPichon:aux[1]},()=>{return this.puntosPichon;});
        if(this.state.puntosPichon>=21)
        this.plantarse(null);
      }
    }


    render(){
        return( 
        <Container bg='#' style={{padding:'1.5rem 0'}}>
        <img className='left' height='240' src={cooterImg} style={{position:'absolute',margin:'2rem 0'}} />
        <Row style={{padding:'2rem 0', minHeight:'18rem'}} className="justify-content-md-center">   
        {this.state.casa.map((card,i)=>{
          return (card.visible)
          ?<Col xs lg="2" key={i}><Carta numero={card.numero} palo={palos[card.index]} color={card.index<=1?'text-black':'text-danger'} /></Col> 
          :<Col xs lg="2" key={i}><Card border='dark' style={{ width: '10rem',height:'15rem',padding:'0.125rem' }} className="justify-content-md-center">
              <Card.Img src={pichonImg} />
          </Card></Col>

        })}
        </Row>
        <Row style={{minHeight:'2rem'}} className="text-warning justify-content-md-center">
          {
            (this.state.fin)
            ?(this.state.puntosPichon>21 || (this.state.puntosCasa<=21 && this.state.puntosCasa>this.state.puntosPichon))
            ?<Col xs lg="4" className="text-center"><h3>Te bailé sabroso</h3></Col>
            :(this.state.puntosPichon===this.state.puntosCasa)
            ?<Col xs lg="4" className="text-center"><h3>Desempate ?</h3></Col>
            :<Col xs lg="4" className="text-center"><h3>Caimos ante el mejor </h3></Col>
            :<Col></Col>
          }
        </Row>
        <Row style={{padding:'2rem 0', minHeight:'18rem'}}  className="justify-content-md-center">   
        {this.state.pichon.map((card,i)=>{
          return <Col xs lg="2" key={i}>
                  <Carta numero={card.numero} palo={palos[card.index]} color={card.index<=1?'text-black':'text-danger'} />
                </Col> 
        })}
        </Row>
        <Row className="justify-content-md-center">
        <Button variant={(this.state.fin)?'outline-warning':'warning'} onClick={(e)=>(this.state.fin)?null:this.getCard(e,false)}>Dame Carta</Button>&nbsp;
        <Button variant={(this.state.fin)?'outline-warning':'warning'} onClick={(e)=>(this.state.fin)?null:this.plantarse(e)} >Plantarse</Button>&nbsp;
        <Button variant={(!this.state.fin)?'outline-warning':'warning'} onClick={(e)=>(!this.state.fin)?null:this.refresh(e)} >Repartir</Button>&nbsp;
        </Row>
      </Container>)
    };
}