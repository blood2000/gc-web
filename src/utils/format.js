const format = {
  //价格格式化
  priceFormat: (number, places, symbol, thousand, decimal) => {
    //number-原值, places-小数位数, symbol-货币符号, thousand-千分位符号, decimal-小数点符号
    number = number || 0;
    places = !isNaN(places = Math.abs(places)) ? places : 2;
    symbol = symbol !== undefined ? symbol : " ";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var negative = number < 0 ? "-" : "",
      a,
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = (a = i.length) > 3 ? a % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  },
  //银行卡格式化: 每4位加空格
  bankCardFormat: (account) => {
    return account.replace(/\D/g,'').replace(/(\d{4})(?=\d)/g,"$1 ");
  }
}
export default format;
