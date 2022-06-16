import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "../styles/Loader.css";

function Loader(props) {
  const { open } = props;

  return (
    <Backdrop className="loader" open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

export default Loader;
