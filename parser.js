let operatorList = {
  '(': {
    type: 'bracket',
    text: 'bracket',
    precedence: 1
  },
  ')': {
    type: 'bracket',
    text: 'bracket',
    precedence: 1
  },
  '+': {
    type: 'operator',
    text: 'add',
    precedence: 2
  },
  '-': {
    type: 'operator',
    text: 'subtract',
    precedence: 2
  },
  've': {
    type: 'operator',
    text: 'negative',
    precedence: 3
  },
  '*': {
    type: 'operator',
    text: 'multiply',
    precedence: 4
  },
  '/': {
    type: 'operator',
    text: 'divide',
    precedence: 4
  },
  '^': {
    type: 'function',
    text: 'exponent',
    precedence: 5
  },
  '!': {
    type: 'function',
    text: 'factorial',
    precedence: 6
  },
  'sin': {
    type: 'function',
    text: 'sin',
    precedence: 7
  },
  'cos': {
    type: 'function',
    text: 'cos',
    precedence: 7
  },
  'tan': {
    type: 'function',
    text: 'tan',
    precedence: 7
  },
  '√': {
    type: 'function',
    text: 'sqrt',
    precedence: 5
  },
}

function Node(x) {
  this.node = x
  this.parent = null
  this.leftChild = null
  this.rightChild = null
  this.text = isNaN(this.node) ? operatorList[x].text : 'constant'
  this.type = isNaN(this.node) ? operatorList[x].type : 'constant'
  this.precedence = isNaN(this.node) ? operatorList[x].precedence : 7
}

const parse = (expr) => {
  try {
    let nodes = [],
     prev = null

    while(expr) {
      let match = expr.match(/^[\d.]+/) || expr.match(/^[a-z]+/)
      
      if (match) {
        if (isNaN(match[0])) {
          if (match[0].includes('.'))
            throw 'MathError. Decimal point is more than 1.'

          nodes.push(new Node(match[0]))
          expr = expr.replace(/^[a-z]+/, '')
        } else {         
          // for cases like (3)3 and sin(30)3
          if (prev && prev === ')') {
            throw 'SyntaxError'
          }

          nodes.push(new Node(match[0]))
          expr = expr.replace(/^[\d.]+/, '')
        }

        prev = match[0]
      } else {
        let char = expr.charAt(0)
        
        // for cases like 3(3) and 3sin(30)
        if (prev && !isNaN(prev) && '(√sincostan'.includes(char)) {
          nodes.push(new Node('*'))
        } 

        // for cases like 3(3)√4 and 3sin(30)
        // for cases like (3)(3) and sin(30)(3)
        if (prev && prev === ')' && '√sincostan'.includes(char)) {
          nodes.push(new Node('*'))
        } else if (prev && prev === ')' && char === '(') {
          nodes.push(new Node('*'))
        }
        
        if (char === '-' && !'()'.includes(prev) && isNaN(prev)) {
          nodes.push(new Node('ve'))
        } else {
          nodes.push(new Node(char))
        }      

        expr = expr.replace(char, '')
        prev = char
      }
    }   
    console.log(nodes)
    return createTree(nodes)
  } catch(error) {
    console.log(error)
    return error
  }
  
}

const createTree = (nodes) => {
  let expressionTree = nodes.reduce((tree, node) => insertToTree(tree, node), new Node('('))
  
  while(expressionTree.parent) {
    expressionTree = expressionTree.parent
  }

  expressionTree = expressionTree.rightChild
  expressionTree.parent = null
  
  return expressionTree
}

const insertToTree = (currentNode, newNode) => {
  let condition = newNode.node === '^' || newNode.node === '√'
                ? newNode.precedence < currentNode.precedence 
                : newNode.precedence <= currentNode.precedence

  if (newNode.node === ')') {
    return deleteNode(currentNode)
  }

  if (newNode.text !== 'negative' && newNode.type !== 'bracket' && condition) {   
    return insertToTree(currentNode.parent, newNode)
  } else {
    newNode.leftChild = currentNode.rightChild
    currentNode.rightChild = newNode
    newNode.parent = currentNode
    
    if (newNode.leftChild) {
      newNode.leftChild.parent = newNode
    }

    return newNode
  }
}

const deleteNode = (currentNode) => {
  let openingParen = climbTree(currentNode)
  openingParen.rightChild.parent = openingParen.parent
  openingParen.parent.rightChild = openingParen.rightChild
  return openingParen.parent
}

const climbTree = (currentNode) => {
  if (currentNode.parent.type !== 'bracket') {
    return climbTree(currentNode.parent)
  }
  return currentNode.parent
}