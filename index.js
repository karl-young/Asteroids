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
  })
  document.body.addEventListener('keydown', function (e) {
    keys[e.key] = false
  })
  Render()
}

class Ship {
  constructor() {
    this.visible = true
    this.x = canvas.width / 2
    this.y = canvas.height / 2
    this.movingForward = false
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
    // check if ship is moving
    let radians = (this.angle / Math.PI) * 180
    if (this.movingForward) {
      this.velx += Math.cos(radians) * this.speed
      this.vely += Math.sin(radians) * this.speed
    }
    // check if ship is out of bounds
    if (this.x < this.radius) {
      this.x = canvas.width
    }
    if (this.x < this.width) {
      this.x = this.radius
    }
    if (this.y < this.radius) {
      this.y = canvas.height
    }
    if (this.y < this.height) {
      this.y = canvas.radius
    }
    this.velx *= 0.99
    this.vely *= 0.99
    this.x -= this.velx
    this.y -= this.vely
  }
  Draw() {
    ctx.strokeStyle = this.strokeColor
    ctx.beginPath()
    let vertAngle = Math.PI / 2 / 3
    let radians = (this.angle / Math.PI) * 180
    for (let i = 0; i < 3; i++) {
      ctx.lineTo(
        this.x + this.radius * Math.cos(i * vertAngle + radians),
        this.y + this.radius * Math.sin(i * vertAngle + radians)
      )
    }
  }
}

let ship = new Ship()
function Render() {}
