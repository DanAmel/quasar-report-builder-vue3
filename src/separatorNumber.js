
export default function(a, b) {

  a = a.toString()
  var x = a.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ' ' + '$2');
  }
  return x1 + x2;

  //  return new Intl.NumberFormat('bj-BJ', { style: 'decimal', currency: 'XOF'}).format(number)
}
