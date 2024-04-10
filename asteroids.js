const FPS = 60 // frames per second
const SHIP_SIZE = 30 // in pixels
const TURN_SPEED = 360 // degrees per second
const SHIP_THRUST = 5 // acceleration of the ship in pixels per second per second
const FRICTION = 0.7 // fraction coefficient of space (0 = no friction, 1 = lots of friction)
const ROIDS_NUM = 4 // starting number of asteroids
const ROIDS_JAG = 0.3 // Jaggedness of the asteroids (0 = none, 1 = lots)
const ROIDS_SPD = 50 // max-starting speed of asteroids in pixels per second
const ROIDS_SIZE = 100 // starting size of asteroids in pixels
const ROIDS_VERT = 10 // number of vertices on each asteroid
const SHOW_CENTER_DOT = false // show or hide the center dot
const SHOW_BOUNDING = false // show or hide collision bounding
const SHIP_EXPLODE_DUR = 0.3 // duration of the ship explosion in seconds

let canv, ctx, ship

document.addEventListener('DOMContentLoaded', function () {
  canv = document.getElementById('gameCanvas')
  ctx = canv.getContext('2d')

  // Initialize the ship position after the canvas is loaded
  ship = newShip()

  // set up game loop
  setInterval(update, 1000 / FPS)
  createAsteroidBelt(canv)
})

let roids = []

// set up event handlers
document.addEventListener('keydown', Keydown)
document.addEventListener('keyup', Keyup)

const explodeShip = () => {
  ship.explodeTime = Math.ceil(SHIP_EXPLODE_DUR * FPS)
}

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

// set up asteroid
function createAsteroidBelt() {
  roids = []
  let x, y

  for (let i = 0; i < ROIDS_NUM; i++) {
    do {
      x = Math.floor(Math.random() * canv.width)
      y = Math.floor(Math.random() * canv.height)
    } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r)
    roids.push(newAsteroid(x, y))
  }
}

const distBetweenPoints = (x1, y1, x2, y2) => {
  const xs = x2 - x1
  const ys = y2 - y1
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
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

const newAsteroid = (x, y) => {
  let roid = {
    x: x,
    y: y,
    xv: ((Math.random() * ROIDS_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    yv: ((Math.random() * ROIDS_SPD) / FPS) * (Math.random() < 0.5 ? 1 : -1),
    r: ROIDS_SIZE / 2,
    a: Math.random() * Math.PI * 2, // in radians
    vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
    offs: [],
  }

  // create the vertex offsets array
  for (let i = 0; i < roid.vert; i++) {
    roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG)
  }
  return roid
}

const newShip = () => {
  return {
    x: canv.width / 2,
    y: canv.height / 2,
    r: SHIP_SIZE / 4,
    a: (90 / 180) * Math.PI, // convert to radians
    explodeTime: 0,
    rot: 0,
    thrusting: false,
    thrust: {
      x: 0,
      y: 0,
    },
  }
}

function update() {
  let exploding = ship.explodeTime > 0

  // draw space background
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, canv.width, canv.height)
  // Thrust the ship
  if (ship.thrusting) {
    ship.thrust.x += (SHIP_THRUST * Math.cos(ship.a)) / FPS
    ship.thrust.y -= (SHIP_THRUST * Math.sin(ship.a)) / FPS

    // draw the thruster
    if (!exploding) {
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
    }
  } else {
    ship.thrust.x -= (FRICTION * ship.thrust.x) / FPS
    ship.thrust.y -= (FRICTION * ship.thrust.y) / FPS
  }

  // Draw the triangular ship
  if (!exploding) {
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
  } else {
    // draw the ship explosion
    ctx.fillStyle = 'darkred'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r * 1.7, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.fillStyle = 'red'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r * 1.5, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.fillStyle = 'orange'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r * 1.1, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.fillStyle = 'yellow'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r * 0.8, 0, Math.PI * 2, false)
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r * 0.5, 0, Math.PI * 2, false)
    ctx.fill()
  }

  if (SHOW_BOUNDING) {
    ctx.strokeStyle = 'lime'
    ctx.beginPath()
    ctx.arc(ship.x, ship.y, ship.r, 0, Math.PI * 2, false)
    ctx.stroke()
  }

  // draw the asteroids

  let x, y, a, r, vert, offs
  for (let i = 0; i < roids.length; i++) {
    ctx.strokeStyle = 'slategrey'
    ctx.lineWidth = SHIP_SIZE / 20
    // get the asteroid properties
    x = roids[i].x
    y = roids[i].y
    a = roids[i].a
    r = roids[i].r
    vert = roids[i].vert
    offs = roids[i].offs
    // draw a path
    ctx.beginPath()
    ctx.moveTo(x + r * offs[0] * Math.cos(a), y + r * offs[0] * Math.sin(a))

    // draw a polygon
    for (let j = 1; j < vert; j++) {
      ctx.lineTo(
        x + r * offs[j] * Math.cos(a + (j * Math.PI * 2) / vert),
        y + r * offs[j] * Math.sin(a + (j * Math.PI * 2) / vert)
      )
    }

    ctx.closePath()
    ctx.stroke()

    if (SHOW_BOUNDING) {
      ctx.strokeStyle = 'lime'
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2, false)
      ctx.stroke()
    }
  }

  // center dot
  if (SHOW_CENTER_DOT) {
    ctx.fillStyle = 'red'
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2)
  }

  // check for asteroid collision
  if (!exploding) {
    for (let i = 0; i < roids.length; i++) {
      if (
        distBetweenPoints(ship.x, ship.y, roids[i].x, roids[i].y) <
        ship.r + roids[i].r
      ) {
        explodeShip()
      }
    }

    // rotate the ship
    ship.a += ship.rot

    // move the ship
    ship.x += ship.thrust.x
    ship.y += ship.thrust.y
  } else {
    ship.explodeTime--
    if (ship.explodeTime == 0) {
      ship = newShip()
    }
  }

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

  // move the asteroid
  for (let i = 0; i < roids.length; i++) {
    roids[i].x += roids[i].xv
    roids[i].y += roids[i].yv
    // handle edge of screen
    if (roids[i].x < 0 - roids[i].r) {
      roids[i].x = canv.width + roids[i].r
    } else if (roids[i].x > canv.width + roids[i].r) {
      roids[i].x = 0 - roids[i].r
    }
    if (roids[i].y < 0 - roids[i].r) {
      roids[i].y = canv.height + roids[i].r
    } else if (roids[i].y > canv.height + roids[i].r) {
      roids[i].y = 0 - roids[i].r
    }
  }
  // Draw center dot
  ctx.fillStyle = 'red'
  ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2)
}
