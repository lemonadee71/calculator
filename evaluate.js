let test = '(5-2)^3!^-4!' || '-2+1+√4/2' || '-cos(10)*3+(5+2)^2' || '6+(-3*2)-(9-3)/3' || '((4*3)^2)/2' || '4*(3-2)+5' || '4^3^2*5'

const factorial = (n) => {
  if (n === 1) return 1
  return n * factorial(n - 1)
}

const calculator = (type, x, y) => {
  x = x ? evaluate(x) : null
  y = y ? evaluate(y) : null

  switch(type) {
    case 'add':
      return x + y;
    case 'subtract':
      return x - y;
    case 'multiply':
      return x * y;
    case 'divide':
      if (y === 0)
        throw 'MathError'
      return x / y;
    case 'exponent':
      return x ** y; 
    case 'factorial':
      if (x < 0 || y < 0)
        throw 'MathError'
      return factorial(x || y)
    case 'negative':
      return -1 * (x || y)
    case 'positive':
      return x || y
    case 'sin':
      return Math.sin(x || y)
    case 'cos':
      return Math.cos(x || y)
    case 'tan':
      return Math.tan(x || y)
    case 'sqrt':
      return Math.sqrt(x || y)
  }
}

const evaluate = (node) => {
  if (node.type === 'function' || node.type === 'operator')
    return calculator(node.text, node.leftChild, node.rightChild)
  return parseFloat(node.node)
}

//let tree = parse(test)
//console.log(evaluate(tree))