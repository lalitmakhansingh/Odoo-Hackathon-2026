function Loader({
  text = "Loading...",
}) {
  return (
    <div className="ui-loader-container">

      <div className="ui-loader"></div>

      <span>
        {text}
      </span>

    </div>
  );
}

export default Loader;