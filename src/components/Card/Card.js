import './Card.css';

const Card = (props) => {
  return (
    <div style={props.style} className={`card`}>
      {props.children}
    </div>
  );
};

export default Card;
