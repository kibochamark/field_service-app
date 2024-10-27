export function FormatCurrency(amount: number | null){
    // Format the price above to USD using the locale, style, and currency.
    let USDollar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    if(amount){
        return USDollar.format(amount)
    }
    return 0
}