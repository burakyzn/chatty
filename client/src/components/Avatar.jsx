import "../styles/Avatar.css";

export default function Avatar(props) {
  const { src, className } = props;

  return <img src={src} className={`avatar ${className}`}></img>;
}
