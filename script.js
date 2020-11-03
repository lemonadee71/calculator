let previousAnswer = null,
  previousAction = null

const clearScreen = () => {
  let expr = document.getElementById('expr'),
    ans = document.getElementById('ans')

  expr.textContent = ''
  ans.textContent = ''
  previousAction = 'clear'
}

// All buttons
let buttons = Array.from(document.querySelectorAll('.buttons>button'))
buttons.forEach(button => {
  if (button.id === 'delete') {
    button.addEventListener('click', () => {
      let expr = document.getElementById('expr')
      expr.textContent = expr.textContent.slice(0, -1)

      if (previousAction === 'equals') {
        let ans = document.getElementById('ans')
        ans.textContent = ''
      }

      previousAction = `${button.id}`
    })
  } else if (button.id === 'clear') {
    button.addEventListener('click', clearScreen)
  } else if(button.id === 'sign') {
    button.addEventListener('click', () => {
      let expr = document.getElementById('expr')
      expr.textContent += '-'

      if (previousAction === 'equals') {
        let ans = document.getElementById('ans')
        ans.textContent = ''
      }

      previousAction = `${button.id}`
    })
  } else if (button.id !== 'equals') {
    button.addEventListener('click', () => {
      let expr = document.getElementById('expr')

      if (previousAction === 'equals') {
        if (isNaN(button.id)) {
          clearScreen()
          expr.textContent = `ANS${button.textContent}`
        } else {
          clearScreen()
          expr.textContent = button.textContent
        }
      } else {
        expr.textContent += button.textContent
      }

      previousAction = `${button.id}`
    })
  }
})

// Equals button
let equalsButton = document.getElementById('equals')
equalsButton.addEventListener('click', () => {
  let expr = document.getElementById('expr').textContent,
    ans = document.getElementById('ans')
  
  expr = expr.replace(/—/g, '-')
  expr = expr.replace(/✕/g, '*')
  expr = expr.replace(/÷/g, '/')
  expr = expr.replace(/ANS/, `${previousAnswer}`)

  let tree = parse(expr),
    answer = evaluate(tree)

  if (isNaN(answer)) {
    ans.textContent = 'ERROR'
    setTimeout(() => {
      ans.textContent = ''
    }, 1500)
  } else {
    ans.textContent = `${answer}`.length > 12 ? `${answer.toExponential(10)}` : `${answer}`
  }

  console.log(tree)
  console.log(expr)
  previousAnswer = answer
  previousAction = 'equals'
})