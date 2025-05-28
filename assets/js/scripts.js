const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const btnConvert = document.querySelector('.btn-convert');
const formDivisas = document.getElementById("formDivisas");
const resultDiv = document.getElementById('result');
const resultAmountDiv = document.querySelector('.result-amount');
let currencyChart = null;


formDivisas.addEventListener('submit', (e) => {
    e.preventDefault();
    btnConvert.disabled = true;
    
    
    if ( amount.value === '' || isNaN(parseFloat(amount.value)) ) {
        alert('Debe ingresar un monto y debe ser un número!');
        return;
    }
    
    const resultFetch = fetchCurrency(currency.value);
    resultFetch.then( data => {
        
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
        // Generar grafico
        renderCurrencyChart(parsedCurrencyData);

    }).catch( error => {
        alert('Error solicitando datos. Por favor, inténtalo de nuevo.');
    }).finally( () => {
        btnConvert.disabled = false;
        resultDiv.classList.remove('loading');
    } );

});

// Obtener datos desde API Mi Indicador
const fetchCurrency = async (currency) => {
    try {
        
        const url = `https://mindicador.cl/api/${currency}`;
        
        resultDiv.classList.add('loading');
        resultAmountDiv.classList.add('d-none');

        const response = await fetch(url);
        const data = await response.json();
        return data?.serie || [];
        
    } catch (error) {
        console.error('Error en solicitud a servidor:', error);
        throw new Error('Error al obtener datos de la API');
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
    return currencyValue == 0 ? 0 : (amount / currencyValue).toFixed(2);
}

// Imprimir en pantalla el resultado  actual
const renderCurrentTotalValue = (totalAmount) => {
    const resultValue = document.querySelector('.result-value');
    const resultLabel = document.querySelector('.result-label');
    const formatedValue = new Intl.NumberFormat('es-ES').format(totalAmount);
    resultValue.innerHTML = '$ ' + formatedValue;
    resultLabel.innerHTML = `Al día ${ new Date().toLocaleDateString('es-ES') }`;
}

// Generar Grafico
const renderCurrencyChart = (currencyData) => {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    // Si ya existe un gráfico generado, se destruye
    if (currencyChart) {
        currencyChart.destroy();
    }
    
    // Ordenar objeto por fechas de forma ascendente
    currencyData.sort( (a, b) => new Date(a.fecha) - new Date(b.fecha) )
    // Generar arrays de etiquetas y valores para grafico
    const labels = currencyData.map(data => data.fecha);
    const values = currencyData.map(data => data.valor);

    currencyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Valor de ${currency.value}`,
                data: values,
                borderColor: 'rgba(0, 143, 255, 1)',
                backgroundColor: 'rgba(0, 143, 255, 0.1)',
                pointBackgroundColor: 'rgba(0, 143, 255, 1)',
                pointStyle: 'rect',
                pointRadius: 6,
                pointHoverRadius: 8,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#C2D2E9',
                        font: {
                            size: 14
                        }
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: '#8CB3F4'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                },
                y: {
                    ticks: {
                        color: '#8CB3F4'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    }
                }
            }
        }
    });

}
