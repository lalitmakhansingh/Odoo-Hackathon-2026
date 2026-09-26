function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  required = false,
  disabled = false,
  error = "",
}) {
  return (
    <div className="ui-form-group">

      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={error ? "ui-input ui-input-error" : "ui-input"}
      />

      {error && (
        <span className="ui-input-error-text">
          {error}
        </span>
      )}

    </div>
  );
}

export default Input;