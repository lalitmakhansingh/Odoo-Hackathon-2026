function Card({
  title,
  subtitle,
  children,
  className = "",
  actions,
}) {
  return (
    <div className={`ui-card ${className}`}>

      {(title || subtitle || actions) && (
        <div className="ui-card-header">

          <div>
            {title && (
              <h2>{title}</h2>
            )}

            {subtitle && (
              <p>{subtitle}</p>
            )}
          </div>

          {actions && (
            <div className="ui-card-actions">
              {actions}
            </div>
          )}

        </div>
      )}

      <div className="ui-card-body">
        {children}
      </div>

    </div>
  );
}

export default Card;