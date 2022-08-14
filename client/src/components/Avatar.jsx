import "../styles/Avatar.css";

export default function Avatar(props) {
  const { src, className, text } = props;

  return src ? (
    <img src={src} className={`avatar ${className}`} alt=""></img>
  ) : (
    <div className={`avatar default ${className}`}>
      {text ? text[0].toUpperCase() : "U"}
    </div>
  );
}
