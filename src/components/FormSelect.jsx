import {useEffect, useRef, useState} from "react";

const FormSelect = ({value, onChange, options, placeholder, columns = 2}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const selectedOption = options.find((option) => String(option.value) === String(value));

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (!selectRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    return <div className="form-picker" ref={selectRef} style={{'--picker-columns': columns}}>
        <button
            className={isOpen ? "form-picker__trigger form-picker__trigger--open" : "form-picker__trigger"}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span>{selectedOption?.label || placeholder}</span>
            <span className="form-picker__chevron" aria-hidden="true"></span>
        </button>
        {isOpen && <div className="form-picker__menu" role="listbox" aria-label={placeholder}>
            {options.map((option) => <button
                className={selectedOption?.value === option.value ? "form-picker__option form-picker__option--selected" : "form-picker__option"}
                type="button"
                key={option.value}
                role="option"
                aria-selected={selectedOption?.value === option.value}
                onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                }}
            >{option.label}</button>)}
        </div>}
    </div>;
};

export default FormSelect;
