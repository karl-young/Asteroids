let canvas
let ctx
let canvasWidth = 1400
let canvasHeight = 1000
let keys = []
let ship = new Ship()
let bullets = []
let asteroids = []

document.addEventListener('DOMContentLoaded', SetupCanvas)

function SetupCanvas() {
  canvas = document.getElementById('my-canvas')
  ctx = canvas.getContext('2d')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ship = new Ship()
  document.body.addEventListener('keydown', function (e) {
    keys[e.key] = true
  })
  document.body.addEventListener('keyup', function (e) {
    keys[e.key] = false
  })

  Render()
}

class Ship {
  constructor() {
    this.visible = true
    this.x = canvasWidth / 2
    this.y = canvasHeight / 2
    this.movingForward = false
    this.speed = 0.1
    this.velX = 0
    this.velY = 0
    this.rotateSpeed = 0.004
    this.radius = 15
    this.angle = 0
    this.strokeColor = 'white'
    this.noseX = canvasWidth / 2 + 15
    this.noseY = canvasHeight / 2
  }
  Rotate(dir) {
    this.angle += this.rotateSpeed * dir
  }
  Update() {
    // Get current direction ship is facing
    let radians = (this.angle / Math.PI) * 180

    // If ship is moving forward
    if (this.movingForward) {
      this.velX += Math.cos(radians) * this.speed
      this.velY += Math.sin(radians) * this.speed
    }
    // If ship goes off board place it on the opposite
    // side
    if (this.x < this.radius) {
      this.x = canvas.width
    }
    if (this.x > canvas.width) {
      this.x = this.radius
    }
    if (this.y < this.radius) {
      this.y = canvas.height
    }
    if (this.y > canvas.height) {
      this.y = this.radius
    }
    // Slow ship speed when not holding key
    this.velX *= 0.89
    this.velY *= 0.89

    // Change value of x & y while accounting for
    // air friction
    this.x -= this.velX
    this.y -= this.velY
  }

  Draw() {
    ctx.strokeStyle = this.strokeColor
    ctx.beginPath()
    // Angle between vertices of the ship
    let vertAngle = (Math.PI * 2) / 3
    let radians = (this.angle / Math.PI) * 180
    this.noseX = this.x - this.radius * Math.cos(radians)
    this.noseY = this.y - this.radius * Math.sin(radians)

    for (let i = 0; i < 3; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      )
    }
    ctx.closePath()
    ctx.stroke()
  }
}

class Bullet {
  constructor(angle) {
    this.visible = true
    this.x = ship.noseX
    this.y = ship.noseY
    this.angle = angle
    this.height = 4
    this.width = 4
    this.speed = 5
    this.velX = 0
    this.velY = 0
  }

  Update() {
    let radians = (this.angle / Math.PI) * 180
    this.x -= this.speed * Math.cos(radians)
    this.y -= this.speed * Math.sin(radians)
  }

  Draw() {
    ctx.fillStyle = 'white'
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

class Asteroid {
  constructor(x, y) {
    this.visible = true
    this.x = Math.floor(Math.random() * canv.width)
    this.y = Math.floor(Math.random() * canv.height)
    this.speed = 1
    this.radius = 50
    this.angle = Math.floor(Math.random() * 359)
    this.strokeColor = 'white'
  }

  Update() {
    let radians = (this.angle / Math.PI) * 180
    this.x += Math.cos(radians) * this.speed
    this.y += Math.sin(radians) * this.speed

    if (this.x < this.radius) {
      this.x = canvas.width
    }
    if (this.x > canvas.width) {
      this.x = this.radius
    }
    if (this.y < this.radius) {
      this.y = canvas.height
    }
    if (this.y > canvas.height) {
      this.y = this.radius
    }
  }

  Draw() {
    ctx.beginPath()
    let vertAngle = (Math.PI * 2) / 6
    let radians = (this.angle / Math.PI) * 180
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(
        this.x - this.radius * Math.cos(vertAngle * i + radians),
        this.y - this.radius * Math.sin(vertAngle * i + radians)
      )
    }
    ctx.closePath()
    ctx.stroke()
  }
}
function Render() {
  // Check if the ship is moving forward
  ship.movingForward = keys[87]

  if (keys[68]) {
    // d key rotate right
    ship.Rotate(1)
  }
  if (keys[65]) {
    // a key rotate left
    ship.Rotate(-1)
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ship.Update()
  ship.Draw()
  requestAnimationFrame(Render)
}
