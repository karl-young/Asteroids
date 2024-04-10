let canvas, ctx
let canvasWidth = 1400
let canvasHeight = 1000
let keys = []

document.addEventListener('DOMContentLoaded', SetupCanvas)

function SetupCanvas() {
  canvas = document.getElementById('my-canvas')
  ctx = canvas.getContext('2d')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  document.body.addEventListener('keydown', function (e) {
    keys[e.key] = true
    ship.movingForward = true
    console.log('Key pressed:', e.key)
  })
  document.body.addEventListener('keyup', function (e) {
    keys[e.key] = false
    ship.movingForward = false
    console.log('Key unpressed:', e.key)
  })
  canvas.focus()
  Render()
}

class Ship {
  constructor() {
    this.visible = true
    this.x = canvasWidth / 2
    this.y = canvasHeight / 2
    this.speed = 0.1
    this.velx = 0
    this.vely = 0
    this.rotateSpeed = 0.001
    this.radius = 15
    this.angle = 0
    this.strokeColor = 'white'
  }

  Rotate(dir) {
    this.angle += this.rotateSpeed * dir
  }
  Update() {
    // console.log('Updating ship...')
    // console.log('this.movingForward:', this.movingForward)
    let radians = (this.angle / Math.PI) * 180

    if (this.movingForward) {
      this.velx += Math.cos(radians) * this.speed
      this.vely += Math.sin(radians) * this.speed
      console.log('Ship velocity X:', this.velx)
      console.log('Ship velocity Y:', this.vely)
    }

    // Update ship position based on velocity
    this.x += this.velx
    this.y += this.vely

    // Wrap around the canvas if ship goes out of bounds
    if (this.x > canvas.width + this.radius) {
      this.x = -this.radius
    } else if (this.x < -this.radius) {
      this.x = canvas.width + this.radius
    }
    if (this.y > canvas.height + this.radius) {
      this.y = -this.radius
    } else if (this.y < -this.radius) {
      this.y = canvas.height + this.radius
    }

    // Apply friction to slow down the ship
    this.velx *= 0.99
    this.vely *= 0.99
  }
  Draw() {
    ctx.strokeStyle = this.strokeColor
    ctx.beginPath()
    let angle = this.angle
    let x = this.x
    let y = this.y
    ctx.moveTo(
      x + this.radius * Math.cos(angle),
      y + this.radius * Math.sin(angle)
    )
    ctx.lineTo(
      x + this.radius * Math.cos(angle - (Math.PI * 2) / 3),
      y + this.radius * Math.sin(angle - (Math.PI * 2) / 3)
    )
    ctx.lineTo(
      x + this.radius * Math.cos(angle + (Math.PI * 2) / 3),
      y + this.radius * Math.sin(angle + (Math.PI * 2) / 3)
    )
    ctx.closePath()
    ctx.stroke()
  }
}

let ship = new Ship()
function Render() {
  ship.movingForward = keys[87]
  if (keys[68]) {
    console.log(keys[68])
    ship.Rotate(1)
  }
  if (keys[65]) {
    ship.Rotate(-1)
  }
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ship.Update()
  ship.Draw()
  requestAnimationFrame(Render)
}
