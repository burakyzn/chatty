import Avatar from "./Avatar";
import "../styles/HoverableAvatar.css";

export default function HoverableAvatar(props) {
  const {
    src,
    text,
    className,
    avatarClassName,
    hover,
    hoverOnClick,
    hoverClassName,
  } = props;

  return (
    <div
      className={`hoverable-avatar__container ${className ? className : ""}`}
    >
      <Avatar
        src={src}
        text={text}
        className={`hoverable-avatar ${avatarClassName ? avatarClassName : ""}`}
      />
      <div
        className={`hoverable-avatar__hover ${
          hoverClassName ? hoverClassName : ""
        }`}
        onClick={hoverOnClick}
      >
        {hover}
      </div>
    </div>
  );
}
