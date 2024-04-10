const FPS = 60 // frames per second
const SHIP_SIZE = 30 // in pixels
const TURN_SPEED = 360 // degrees per second
const SHIP_THRUST = 5 // acceleration of the ship in pixels per second per second
const FRICTION = 0.7 // fraction coefficient of space (0 = no friction, 1 = lots of friction)

let canv, ctx, ship

document.addEventListener('DOMContentLoaded', function () {
  canv = document.getElementById('gameCanvas')
  ctx = canv.getContext('2d')

  // Initialize the ship position after the canvas is loaded
  ship = {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 4,
    a: (90 / 180) * Math.PI, // convert to radians
    rot: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
  }

  // set up game loop
  setInterval(update, 1000 / FPS)
})

// set up event handlers
document.addEventListener('keydown', Keydown)
document.addEventListener('keyup', Keyup)

function Keydown(e) {
  switch (e.keyCode) {
    case 37: // left arrow (rotate ship left)
      ship.rot = ((TURN_SPEED / 180) * Math.PI) / FPS
      break
    case 38: // up arrow (thrust the ship forward)
      ship.thrusting = true
      break
    case 39: // right arrow (rotate ship right)
      ship.rot = ((-TURN_SPEED / 180) * Math.PI) / FPS
      break
    case 40: // down arrow (decelerate the ship)
      break
  }
}

function Keyup(e) {
  switch (e.keyCode) {
    case 37: // left arrow (stop rotating left)
      ship.rot = 0
      break
    case 38: // up arrow ( stop thrust the ship forward)
      ship.thrusting = false
      break
    case 39: // right arrow (stop rotating right)
      ship.rot = 0
      break
  }
}

function update() {
  // draw space background
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canv.width, canv.height)
  // Thrust the ship
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS

    // draw the thruster
    ctx.fillStyle = 'orange'
    ctx.strokeStyle = 'yellow'
    ctx.lineWidth = SHIP_SIZE / 20
    ctx.beginPath()

    ctx.moveTo(
      // rear left
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
    )

    ctx.lineTo(
      // Rear center behind the ship
      ship.x - ((ship.r * 6) / 3) * Math.cos(ship.a),
      ship.y + ((ship.r * 6) / 3) * Math.sin(ship.a) - Math.cos(ship.a)
    )

    ctx.lineTo(
      // Rear right
      ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
      ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
    )

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS
  }

  // Draw the triangular ship
  ctx.strokeStyle = 'white'
  ctx.lineWidth = SHIP_SIZE / 30
  ctx.beginPath()

  ctx.moveTo(
    // nose of the ship
    ship.x + (4 / 3) * ship.r * Math.cos(ship.a),
    ship.y - (4 / 3) * ship.r * Math.sin(ship.a)
  )

  ctx.lineTo(
    // Rear left
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) + Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) - Math.cos(ship.a))
  )

  ctx.lineTo(
    // Rear right
    ship.x - ship.r * ((2 / 3) * Math.cos(ship.a) - Math.sin(ship.a)),
    ship.y + ship.r * ((2 / 3) * Math.sin(ship.a) + Math.cos(ship.a))
  )

  ctx.closePath()
  ctx.stroke()

  // rotate the ship
  ship.a += ship.rot

  // move the ship
  ship.x += ship.thrust.x
  ship.y += ship.thrust.y

  // handle edge of screen
  if (ship.x < 0 - ship.r) {
    ship.x = canv.width + ship.r
  } else if (ship.x > canv.width + ship.r) {
    ship.x = 0 - ship.r
  }

  if (ship.y < 0 - ship.r) {
    ship.y = canv.width + ship.r
  } else if (ship.y > canv.height + ship.r) {
    ship.y = 0 - ship.r
  }

  // Draw center dot
  ctx.fillStyle = 'red'
  ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2)
}
