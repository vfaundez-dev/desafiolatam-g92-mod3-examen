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
        
        const currencyData = data;
        
        if (!currencyData || currencyData.length === 0) {
            alert('No se encontraron datos para el valor seleccionado.');
            return;
        }
        
        resultAmountDiv.classList.remove('d-none');
        // Transformar objeto, parseando fechas en formato YYYY-MM-DD
        // y devolviendo solo los primeros 10 elementos
        const parsedCurrencyData = parseCurrencyObject(currencyData);
        // Obtenemos el valor actual de la divisa
        const currentCurrencyValue = parsedCurrencyData[0].valor;
        // Calculamos el monto total de la divisa en CLP
        const currentTotalValue = calculateTotalAmount(amount.value, currentCurrencyValue);

        // Imprimir en pantalla el resultado del monto actual
        renderCurrentTotalValue(currentTotalValue);


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

// Transformar objeto obtenido en Mi Indicador
const parseCurrencyObject = (currencyData) => {
    return currencyData.slice(0, 10).map( currency => ({
        fecha: new Date(currency.fecha).toISOString().split('T')[0],
        valor: currency.valor.toFixed(2)
    }));
}

// Calcular monto total de la divisa
const calculateTotalAmount = (amount, currencyValue) => {
    return (amount * currencyValue).toFixed(2) || 0;
}

// Imprimir en pantalla el resultado  actual
const renderCurrentTotalValue = (totalAmount) => {
    const resultValue = document.querySelector('.result-value');
    const formatedValue = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
    }).format(totalAmount);
    resultValue.innerHTML = formatedValue;
}