const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const formDivisas = document.getElementById("formDivisas");


formDivisas.addEventListener('submit', (e) => {
    e.preventDefault();

    if (amount.value === '') {
        alert('Debe ingresar un monto!');
        return;
    }

    const resultFetch = fetchCurrency(currency.value);
    resultFetch.then( data => {

        console.log(data[0]);

    });

});

const fetchCurrency = async (currency) => {
    const url = `https://mindicador.cl/api/${currency}`;

    try {

        const response = await fetch(url);
        const data = await response.json();
        return data?.serie || [];
        
    } catch (error) {
        console.error('Error en solicitud a servidor:', error);
        alert('Error solicitando datos. Por favor, inténtalo de nuevo.');
    }

}