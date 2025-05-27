const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const formDivisas = document.getElementById("formDivisas");
const resultDiv = document.getElementById('result');
const resultAmountDiv = document.querySelector('.result-amount');


formDivisas.addEventListener('submit', (e) => {
    e.preventDefault();
    
    
    if ( amount.value === '' || isNaN(parseFloat(amount.value)) ) {
        alert('Debe ingresar un monto y debe ser un número!');
        return;
    }
    
    const resultFetch = fetchCurrency(currency.value);
    resultFetch.then( data => {
        
        resultDiv.classList.remove('loading');
        resultAmountDiv.classList.remove('d-none');

        const currencyData = data;
        const currentValue = parseFloat( currencyData[0]?.valor ) || 0;
        
        if (!currentValue && currentValue === 0) {
            alert('No se encontraron datos para el valor seleccionado.');
            return;
        }
        
        const totalAmount = calculateTotalAmount(amount.value, currentValue);
        // Metodos para renderizar en DOM
        renderCurrentResult(totalAmount);

        console.log( currencyData );


    });

});

// Obtener datos desde API Mi Indicador
const fetchCurrency = async (currency) => {
    const url = `https://mindicador.cl/api/${currency}`;

    try {

        resultDiv.classList.add('loading');
        resultAmountDiv.classList.add('d-none');

        const response = await fetch(url);
        const data = await response.json();
        return data?.serie || [];
        
    } catch (error) {
        console.error('Error en solicitud a servidor:', error);
        alert('Error solicitando datos. Por favor, inténtalo de nuevo.');
    }

}

// Calcular monto total de la divisa
const calculateTotalAmount = (amount, currencyValue) => {
    return (amount * currencyValue).toFixed(2) || 0;
}

// Imprimir en pantalla el resultado actual
const renderCurrentResult = (totalAmount) => {
    const resultValue = document.querySelector('.result-value');
    const formatedValue = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(totalAmount);
    resultValue.innerHTML = formatedValue;
}