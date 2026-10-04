import {useEffect, useRef, useState} from "react";

const prices = [1, 1400, 1500, 1650, 1800, 1900, 2100, 2200, 2400];
const formatPrice = (price) => new Intl.NumberFormat('ru-RU').format(Number(price));

const PriceSelect = ({value, onChange}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    const selectedPrice = Number(value);

    useEffect(() => {
        const closeOnOutsideClick = (event) => {
            if (!selectRef.current?.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    return <div className="price-picker" ref={selectRef}>
        <button
            className={isOpen ? "price-picker__trigger price-picker__trigger--open" : "price-picker__trigger"}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="price-picker__currency">₽</span>
            <span>{selectedPrice ? `${formatPrice(selectedPrice)} ₽` : 'Стоимость занятия'}</span>
            <span className="price-picker__chevron" aria-hidden="true"></span>
        </button>
        {isOpen && <div className="price-picker__menu" role="listbox" aria-label="Стоимость занятия">
            {prices.map((price) => <button
                className={selectedPrice === price ? "price-picker__option price-picker__option--selected" : "price-picker__option"}
                type="button"
                key={price}
                role="option"
                aria-selected={selectedPrice === price}
                onClick={() => {
                    onChange(price);
                    setIsOpen(false);
                }}
            >
                <span>{formatPrice(price)}</span>
                <span>₽</span>
            </button>)}
        </div>}
    </div>;
};

export default PriceSelect;
