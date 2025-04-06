// Puzzlometry (Computer Science A-Level Project)
// ~ By Joshua Abbott

// ------------------------------------------
// Basic puzzle class
// ------------------------------------------

class Puzzle {
  constructor(type, diff) {
    this.type = type // Topic of the puzzle, e.g. Algebra
    this.diff = diff // Difficulty of the puzzle measured by a number
  }
  
}

// ------------------------------------------
// Multiple choice puzzle class
// ------------------------------------------

class MultChoice extends Puzzle {
  constructor(type, diff) {
    super(type, diff)
    this.question = ""
    this.choices = []
    this.answer = ""
  }

  generate() {
      let a = Math.floor(Math.random() * 3) + 2
      let b = Math.floor(Math.random() * 5) + 2
      let c = Math.floor(Math.random() * 3) + 2
      let d = Math.floor(Math.random() * 5) + 2
      
      this.question = "(" + a + "X + " + b + ") x (" + c + "X + " + d + ")"

      let e = a * c
      let f = a * b
      let g = b * d
      let h = (a * d + b * c)
      let i = (b + d)

      let c1 = e.toString() + "X² + " + h.toString() + "X + " + g.toString()
      let c2 = e.toString() + "X² + " + h.toString() + "X + " + i.toString()
      let c3 = e.toString() + "X² + " + f.toString() + "X + " + g.toString()
      let c4 = e.toString() + "X² + " + f.toString() + "X + " + i.toString()

      this.choices = [c1, c2, c3, c4]

      let num = 0

      for (let n = 1; n < Math.floor(Math.random() * 5); n++) {
        let shift = this.choices[3]
        this.choices.pop()
        this.choices.unshift(shift)
        num = n
      }

      let ans_pos = (num % 4) + 1
      this.answer = ans_pos.toString()
  }
}

// ------------------------------------------
// Graph based puzzle class
// ------------------------------------------

class Graph extends Puzzle {
  constructor(type, diff) {
    super(type, diff)
    this.xcoord = null // Current x-coordinate of point user has entered
    this.ycoord = null // Current y-coordinate of point user has entered
    this.grid = this.grid_create() // 2D array of the current state of the grid
    this.points = [] // Array of coordinates of points drawn by user
    this.question = this.grid_create() // 2D array of shape drawn by puzzle in grid
    this.qpoints = [] // Array of coordinates of points drawn by puzzle
    this.line = "" // Line that shape is reflected in
    this.answer = this.grid_create() // 2D array of correct answer grid
    this.apoints = [] // Array of coordinates of correct answer points
  }

  grid_create() {
    let grid = []
    let rows = 23
    let columns = 27

    for (let i = 0; i < rows; i++) {
      grid[i] = []
      for (let j = 0; j < columns; j++) {
        grid[i][j] = false
      }
    }
    return grid
  }

  grid_generate() {

    let axis = Math.floor(Math.random() * 2)

    if (axis == 1) {
      this.line = "Y-Axis"
    }
    else {
      this.line = "X-Axis"
    }

    let quadrant = Math.floor(Math.random() * 4) + 1
    let grid_increment = []

    switch (quadrant) {
      case 1:
        grid_increment = [0, 0]
        break
      case 2:
        grid_increment = [0, 13]
        break
      case 3:
        grid_increment = [11, 0]
        break
      case 4:
        grid_increment = [11, 13]
        break
    }
    
    let i1 = Math.floor(Math.random() * 6) + grid_increment[0]
    let j1 = Math.floor(Math.random() * 7) + grid_increment[1]

    let i2 = Math.floor(Math.random() * 6) + grid_increment[0]
    let j2 = Math.floor(Math.random() * 7) + 7 + grid_increment[1]

    let i3 = Math.floor(Math.random() * 6) + 6 + grid_increment[0]
    let j3 = Math.floor(Math.random() * 14) + grid_increment[1]

    let point1 = [i1, j1]
    let point2 = [i2, j2]
    let point3 = [i3, j3]
    
    this.qpoints = [point1, point2, point3]

    for (let i = 0; i < this.qpoints.length; i++) {
      this.question[this.qpoints[i][0]][this.qpoints[i][1]] = true
    }

    this.grid_answer()
  }

  grid_answer() {
    
    let answer_1 = []
    let answer_2 = []
    let answer_3 = []
      
    if (this.line == "Y-Axis") {
      answer_1 = [this.qpoints[0][0], 26 - this.qpoints[0][1]]
      answer_2 = [this.qpoints[1][0], 26 - this.qpoints[1][1]]
      answer_3 = [this.qpoints[2][0], 26 - this.qpoints[2][1]]
    }
    else {
      answer_1 = [22 - this.qpoints[0][0], this.qpoints[0][1]]
      answer_2 = [22 - this.qpoints[1][0], this.qpoints[1][1]]
      answer_3 = [22 - this.qpoints[2][0], this.qpoints[2][1]]
    }

    this.apoints = [answer_1, answer_2, answer_3]
    
    for (let i = 0; i < this.apoints.length; i++) {
      this.answer[this.apoints[i][0]][this.apoints[i][1]] = true
    }
  }

  grid_getpoints() {
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] == true) {
          this.points.push([i, j])
        }
      }
    }
  }

  grid_drawpoints(grid, colour) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] == true) {
          let xpoint = j - Math.floor(grid[i].length / 2)
          let ypoint = Math.floor(grid.length / 2) - i
          ctx.fillStyle = colour
          ctx.beginPath()
          ctx.arc(y_axis + cell_size * xpoint, x_axis + cell_size * ypoint * -1, 7, 0, 2 * Math.PI)
          ctx.fill()
        }
      }
    } 
  }

  grid_lines(points, colour) {
    ctx.lineWidth = 3
    ctx.strokeStyle = colour
    
    for (let i = 0; i < points.length - 1; i++) {
      let xpoint1 = points[i][1] - Math.floor(this.grid[0].length / 2)
      let ypoint1 = Math.floor(this.grid.length / 2) - points[i][0]
      let xpoint2= points[i + 1][1] - Math.floor(this.grid[0].length / 2)
      let ypoint2 = Math.floor(this.grid.length / 2) - points[i + 1][0]
      ctx.beginPath()
      ctx.moveTo(y_axis + cell_size * xpoint1, x_axis + cell_size * ypoint1 * -1)
      ctx.lineTo(y_axis + cell_size * xpoint2, x_axis + cell_size * ypoint2 * -1)
      ctx.stroke()
    }
    let xpoint1 = points[points.length - 1][1] - Math.floor(this.grid[0].length / 2)
    let ypoint1 = Math.floor(this.grid.length / 2) - points[points.length - 1][0]
    let xpoint2= points[0][1] - Math.floor(this.grid[0].length / 2)
    let ypoint2 = Math.floor(this.grid.length / 2) - points[0][0]
    ctx.beginPath()
    ctx.moveTo(y_axis + cell_size * xpoint1, x_axis + cell_size * ypoint1 * -1)
    ctx.lineTo(y_axis + cell_size * xpoint2, x_axis + cell_size * ypoint2 * -1)
    ctx.stroke()
  }
}

// ------------------------------------------
// Draws basic design of canvas background
// ------------------------------------------

function background() {
  // --- Sets width and height of canvas to match game window ---
  canvas.width = window.innerWidth 
  canvas.height = window.innerHeight

  // --- Draws blue rectangles at the sides of canvas ---
  rect_width = canvas.width / 8
  rect_height = canvas.height

  ctx.fillStyle = l_blue
  ctx.fillRect(0, 0, rect_width, rect_height) // --> ctx.fillRect(x-position, y-position, width, height)
  ctx.fillRect(canvas.width - rect_width, 0, rect_width, rect_height)
}

// ------------------------------------------
// Sends requests to node.js server
// ------------------------------------------

async function makeRequest() {
  try {
    response = await fetch("https://e1dcadc4-f1c2-4693-b0c3-c05045575379-00-3995o9r035od.picard.replit.dev/")
    data = await response.json()
    console.log(data)
  }
  catch (error) {
    console.log("Error:" + error)
  }
}

// ------------------------------------------
// Draws title display of the game
// ------------------------------------------

function load_title() {

  // --- Checks if the user is clicking on a button on the title display ---
  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY]

    if (pos[0] >= box1_width && pos[0] <= box1_width * 2 + border_width && pos[1] >= box1_y && pos[1] <= box1_y + box_height + border_width) { 
      window.removeEventListener('resize', load_title)
      canvas.removeEventListener('click', click)
      load_login() // Loads the login screen
    }
    else if (pos[0] >= box2_x && pos[0] <= box2_x + box2_width + border_width && pos[1] >= box2_y && pos[1] <= box2_y + box_height + border_width) {
      window.close() // Exits the game
    }
      
    else if (pos[0] >= tempbox_x && pos[0] <= tempbox_x + tempbox_width && pos[1] >= tempbox_y && pos[1] <= tempbox_y + box_height) {
      window.removeEventListener('resize', load_title)
      canvas.removeEventListener('click', click)
      username = "Josh"
      year = "Year 11"
      load_menu()
    }
  }

  background()

  // --- Draws the white boxes ---
  box1_y = canvas.height * 0.65
  box1_width = canvas.width / 3 // Also used as the Box 1 starting x-position 
  box2_x = canvas.width / 5.5
  box2_y = canvas.height * 0.80
  box2_width = canvas.width * 0.12
  box_height = canvas.height * 0.1

  tempbox_x = canvas.width - box2_x - box2_width
  tempbox_y = box2_y
  tempbox_width = box2_width

  ctx.fillStyle = white
  ctx.fillRect(box1_width, box1_y, box1_width, box_height)
  ctx.fillRect(box2_x, box2_y, box2_width, box_height)

  ctx.fillStyle = d_blue
  ctx.fillRect(tempbox_x, tempbox_y, tempbox_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = blue
  ctx.fillRect(box1_width, box1_y, box1_width, border_width)
  ctx.fillRect(box1_width * 2 - border_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y + box_height - border_width, box1_width, border_width)

  ctx.fillRect(box2_x, box2_y, box2_width, border_width)
  ctx.fillRect(box2_x + box2_width - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y + box_height - border_width, box2_width, border_width)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.1
  left_height = canvas.height / 1.19
  desc_height = canvas.height / 3
  increment = canvas.height * 0.04

  right_width = canvas.width - left_width
  right_height = canvas.height / 1.17

  ctx.fillStyle = d_blue
  ctx.font = "bold 55px Courier New"
  ctx.textAlign = "center"
  ctx.fillText("Puzzlometry", centre_width, canvas.height / 5)

  ctx.font = "18px Comic Sans MS"
  ctx.fillText("Puzzlometry is a maths puzzle game aimed at Year 9-11 maths students.", centre_width, desc_height)
  ctx.fillText("The aim is to solve maths related puzzles of various topics.", centre_width, desc_height + increment)
   ctx.fillText("The student can improve their score by completing puzzles", centre_width, desc_height + increment * 2)
   ctx.fillText("in as few attempts as possible.", centre_width, desc_height + increment * 3)
   ctx.fillText("Increasing your score will increase the puzzle difficulty.", centre_width, desc_height + increment * 4)
  ctx.fillText("Created by Joshua Abbott", centre_width, desc_height + increment * 6)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Start Game", centre_width, canvas.height / 1.41)
  ctx.fillText("Exit", left_width, left_height)
  ctx.fillText("Game", left_width, left_height + increment)

  ctx.fillStyle = l_blue
  ctx.fillText("GO!", right_width, right_height)

  window.addEventListener('resize', load_title) // Redraws screen when window is resized 

  canvas.addEventListener('click', click) // Detects if the user clicks on the screen
}

// ------------------------------------------
// Draws username entry screen
// ------------------------------------------

function load_login() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= box2_x && pos[0] <= box2_x + box2_width + border_width && pos[1] >= box2_y && pos[1] <= box2_y + box_height + border_width) {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove() // Removes textbox if it exists when 'Go Back' box is pressed
      }
      window.removeEventListener('resize', load_login)
      canvas.removeEventListener('click', click)
      load_title() // Goes back to the title display
    }

    else if (pos[0] >= box1_width && pos[0] <= box1_width * 2 + border_width && pos[1] >= box1_y && pos[1] <= box1_y + box_height + border_width) { 

      // --- Sets properties of the 'Enter Your Name' textbox ---
       function addInput(x, y) {
          var input = document.createElement('input');
          input.type = 'text';
          input.id = "textbox"
          input.style.height = box_height * 0.815 + 'px'
          input.style.width = box1_width * 0.97 + 'px'
          input.style.position = 'fixed';
          input.style.left = x + 17 + 'px';
          input.style.top = y + 17 + 'px';
          input.style.textAlign = 'center'
          input.onkeydown = handleEnter;
          document.body.appendChild(input);
          input.focus();
       }

      // --- Updates 'Enter Your Name' box when user enters text into textbox
       function handleEnter(mouse) {
           var keyCode = mouse.keyCode;
           if (keyCode === 13) { // If user presses the 'Enter' key
               ctx.fillStyle = white
               ctx.fillRect(box1_width + border_width, box1_y + border_width, box1_width - border_width * 2, box_height - border_width * 2)
               drawText(this.value, canvas.width / 2, canvas.height / 1.78)
               document.body.removeChild(this);
               username = this.value // Sets username to entered text
           }
       }

       function drawText(txt, x, y) {
           ctx.fillStyle = d_blue
           ctx.fillText(txt, x, y);
       }

       text = document.getElementById('textbox')
       if (text == null) {
       addInput(box1_width, box1_y) // Adds textbox to screen if it doesn't already exist
       }

    }

    else if (pos[0] >= box3_x && pos[0] <= box3_x + box3_width + border_width && pos[1] >= box3_y && pos[1] <= box3_y + box_height + border_width) {
      if (name_validation(username) == true) {
        text = document.getElementById('textbox')
        if (text != null) {
          text.remove() 
        }
        window.removeEventListener('resize', load_login)
        canvas.removeEventListener('click', click)

        if (username == "Josh") {
          year = "Year 11"
          load_login2()
        }
        else {
          load_signup()
        }
      }
    }

    else {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove() // Removes textbox if user clicks anywhere else on screen
      }
    }
  }

  // --- Validates the name entered by the user ---
  function name_validation(name) {

    characters = "-!#£$%'^&)(*+,./:;<=>?@]\[_`}|{~" // Special character list

    if (name != "") { // Checks if the 'name' string is blank or not
      for (let i = 0; i < name.length; i++) {
        if (isNaN(name[i]) == false) { // Checks if the 'name' string contains numbers
          return false
        }
        for (let j = 0; j < characters.length; j++) {
          if (name[i] == characters[j]) { // Checks if the 'name' string contains special characters
            return false
          }
        }
      }
      return true
    }
    else {
      return false
    }
  }

  background()

  // --- Draws the white boxes ---
  box1_y = canvas.height / 2
  box1_width = canvas.width / 3 // Also used as the Box 1 starting x-position 
  box2_x = canvas.width / 5.5
  box2_y = canvas.height * 0.80
  box2_width = canvas.width * 0.12
  box3_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  box3_y = box2_y
  box3_width = box2_width
  box_height = canvas.height * 0.1

  ctx.fillStyle = white
  ctx.fillRect(box1_width, box1_y, box1_width, box_height)
  ctx.fillRect(box2_x, box2_y, box2_width, box_height)
  ctx.fillRect(box3_x, box2_y, box2_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = l_blue
  ctx.fillRect(box1_width, box1_y, box1_width, border_width)
  ctx.fillRect(box1_width * 2 - border_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y + box_height - border_width, box1_width, border_width)

  ctx.fillStyle = blue
  ctx.fillRect(box2_x, box2_y, box2_width, border_width)
  ctx.fillRect(box2_x + box2_width - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y + box_height - border_width, box2_width, border_width)

  ctx.fillRect(box3_x, box2_y, box2_width, border_width)
  ctx.fillRect(box3_x + box2_width - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box3_x, box2_y, border_width, box_height)
  ctx.fillRect(box3_x, box2_y + box_height - border_width, box2_width, border_width)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.1
  left_height = canvas.height / 1.19
  right_width = canvas.width - left_width
  right_height = canvas.height / 1.17
  centre_height = canvas.height / 2.3
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.font = "bold 55px Courier New"
  ctx.textAlign = "center"
  ctx.fillText("Puzzlometry", centre_width, canvas.height / 5)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Enter", centre_width, centre_height)
  ctx.fillText("Your Name:", centre_width, centre_height + increment)
  ctx.fillText("Go", left_width, left_height)
  ctx.fillText("Back", left_width, left_height + increment)
  ctx.fillText("Continue", right_width, right_height)

  window.addEventListener('resize', load_login)

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws password entry screen
// ------------------------------------------

function load_login2() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= box2_x && pos[0] <= box2_x + box2_width + border_width && pos[1] >= box2_y && pos[1] <= box2_y + box_height + border_width) {
      if (text != null) {
        text.remove() // Removes textbox if it exists when 'Go Back' box is pressed
      }
      window.removeEventListener('resize', load_login2)
      canvas.removeEventListener('click', click)
      username = ""
      password_1 = ""
      load_login() // Goes back to the username login page
    }

    else if (pos[0] >= box1_width && pos[0] <= box1_width * 2 + border_width && pos[1] >= box1_y && pos[1] <= box1_y + box_height + border_width) { 

        // --- Sets properties of the 'Enter Your Password' textbox ---
         function addInput(x, y) {
            var input = document.createElement('input');
            input.type = 'text';
            input.id = "textbox"
            input.style.height = box_height * 0.815 + 'px'
            input.style.width = box1_width * 0.97 + 'px'
            input.style.position = 'fixed';
            input.style.left = x + 17 + 'px';
            input.style.top = y + 17 + 'px';
            input.style.textAlign = 'center'
            input.onkeydown = handleEnter;
            document.body.appendChild(input);
            input.focus();
         }

        // --- Updates 'Enter Your Password' box when user enters text into textbox
         function handleEnter(mouse) {
             var keyCode = mouse.keyCode;
             if (keyCode === 13) { // If user presses the 'Enter' key
                 ctx.fillStyle = white
                 ctx.fillRect(box1_width + border_width, box1_y + border_width, box1_width - border_width * 2, box_height - border_width * 2)
                 drawText(this.value, canvas.width / 2, canvas.height / 1.78)
                 document.body.removeChild(this);
                 password_1 = this.value // Sets password to entered text
             }
         }

         function drawText(txt, x, y) {
             ctx.fillStyle = d_blue
             ctx.fillText(txt, x, y);
         }

         text = document.getElementById('textbox')
         if (text == null) {
         addInput(box1_width, box1_y) // Adds textbox to screen if it doesn't already exist
         }

    }

    else if (pos[0] >= box3_x && pos[0] <= box3_x + box3_width + border_width && pos[1] >= box3_y && pos[1] <= box3_y + box_height + border_width) {
      if (password_1 == "P4ssword!") {
        text = document.getElementById('textbox')
        if (text != null) {
          text.remove() 
        }
        window.removeEventListener('resize', load_login2)
        canvas.removeEventListener('click', click)
        load_menu() // Loads main menu
      }
    }

    else {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove() // Removes textbox if user clicks anywhere else on screen
      }
    }
  }
  
  background()

  // --- Draws the white boxes ---
  box1_y = canvas.height / 2
  box1_width = canvas.width / 3 // Also used as the Box 1 starting x-position 
  box2_x = canvas.width / 5.5
  box2_y = canvas.height * 0.80
  box2_width = canvas.width * 0.12
  box3_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  box3_y = box2_y
  box3_width = box2_width
  box_height = canvas.height * 0.1

  ctx.fillStyle = white
  ctx.fillRect(box1_width, box1_y, box1_width, box_height)
  ctx.fillRect(box2_x, box2_y, box2_width, box_height)
  ctx.fillRect(box3_x, box2_y, box2_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = l_blue
  ctx.fillRect(box1_width, box1_y, box1_width, border_width)
  ctx.fillRect(box1_width * 2 - border_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y + box_height - border_width, box1_width, border_width)

  ctx.fillStyle = blue
  ctx.fillRect(box2_x, box2_y, box2_width, border_width)
  ctx.fillRect(box2_x + box2_width - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y, border_width, box_height)
  ctx.fillRect(box2_x, box2_y + box_height - border_width, box2_width, border_width)

  ctx.fillRect(box3_x, box2_y, box2_width, border_width)
  ctx.fillRect(box3_x + box2_width - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box3_x, box2_y, border_width, box_height)
  ctx.fillRect(box3_x, box2_y + box_height - border_width, box2_width, border_width)

  // --- Draws the top blue bar ---

  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.1
  left_height = canvas.height / 1.19
  right_width = canvas.width - left_width
  right_height = canvas.height / 1.17
  centre_height = canvas.height / 2.3
  top_height = canvas.height / 8
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"
  ctx.font = "bold 35px Courier New"
  ctx.fillText("Log In.", left_width, top_height)
  ctx.fillText("Username: " + username, right_width, top_height)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Enter", centre_width, centre_height)
  ctx.fillText("Your Password:", centre_width, centre_height + increment)
  ctx.fillText("Go", left_width, left_height)
  ctx.fillText("Back", left_width, left_height + increment)
  ctx.fillText("Continue", right_width, right_height)

  window.addEventListener('resize', load_login2)

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws password creation screen
// ------------------------------------------

function load_signup() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    // --- Sets properties of the 'Enter Your Password' textbox ---
     function addInput(x, y) {
        var input = document.createElement('input');
        input.type = 'text';
        input.id = "textbox"
        input.style.height = box_height * 0.815 + 'px'
        input.style.width = box2_width * 0.97 + 'px'
        input.style.position = 'fixed';
        input.style.left = x + 17 + 'px';
        input.style.top = y + 17 + 'px';
        input.style.textAlign = 'center'
        input.onkeydown = handleEnter;
        document.body.appendChild(input);
        input.focus();
     }

    if (pos[0] >= box3_x && pos[0] <= box3_x + box3_width + border_width && pos[1] >= box3_y && pos[1] <= box3_y + box_height + border_width) {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove()
      }
      window.removeEventListener('resize', load_signup)
      canvas.removeEventListener('click', click)
      username = ""
      password_1 = ""
      password_2 = ""
      load_login() // Goes back to the username login page
    }

    else if (pos[0] >= box1_width && pos[0] <= box1_width * 2 + border_width && pos[1] >= box1_y && pos[1] <= box1_y + box_height + border_width) { 

      // --- Updates 'Enter Your Password' box when user enters text into textbox
       function handleEnter(mouse) {
           var keyCode = mouse.keyCode;
           if (keyCode === 13) { // If user presses the 'Enter' key
               ctx.fillStyle = white
               ctx.fillRect(box1_width + border_width, box1_y + border_width, box1_width - border_width * 2, box_height - border_width * 2)
               drawText(this.value, canvas.width / 2, canvas.height / 2.48)
               document.body.removeChild(this);
               password_1 = this.value // Sets password to entered text
           }
       }

       function drawText(txt, x, y) {
           ctx.fillStyle = d_blue
           ctx.fillText(txt, x, y);
       }

       text = document.getElementById('textbox')
       if (text == null) {
       addInput(box1_width, box1_y) // Adds textbox to screen if it doesn't already exist
       }
       else {
         text.remove()
       }

    }

    else if (pos[0] >= box2_width && pos[0] <= box2_width * 2 + border_width && pos[1] >= box2_y && pos[1] <= box2_y + box_height + border_width) { 

      // --- Updates 'Enter Your Password' box when user enters text into textbox
       function handleEnter(mouse) {
           var keyCode = mouse.keyCode;
           if (keyCode === 13) { // If user presses the 'Enter' key
               ctx.fillStyle = white
               ctx.fillRect(box2_width + border_width, box2_y + border_width, box2_width - border_width * 2, box_height - border_width * 2)
               drawText(this.value, canvas.width / 2, canvas.height / 1.53)
               document.body.removeChild(this);
               password_2 = this.value // Sets password to entered text
           }
       }

       function drawText(txt, x, y) {
           ctx.fillStyle = d_blue
           ctx.fillText(txt, x, y);
       }

       text = document.getElementById('textbox')
       if (text == null) {
       addInput(box2_width, box2_y) // Adds textbox to screen if it doesn't already exist
       }
       else {
         text.remove()
       }
    }

    else if (pos[0] >= box4_x && pos[0] <= box4_x + box4_width + border_width && pos[1] >= box4_y && pos[1] <= box4_y + box_height + border_width) {
      if (pass_validation(password_1, password_2) == true) {
        text = document.getElementById('textbox')
        if (text != null) {
          text.remove()
        }
        window.removeEventListener('resize', load_signup)
        canvas.removeEventListener('click', click)
        load_signup2() // Loads year selection menu
      }
    }

    else {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove() // Removes textbox if user clicks anywhere else on screen
      }
    }
  }

  // --- Validates the passwords entered by the user
  function pass_validation(pass1, pass2) {

    characters = "-!#£$%'^&)(*+,./:;<=>?@]\[_`}|{~"

    if (pass1 == pass2) {
      if (pass1.length >= 8) {
        if (pass1 != pass1.toUpperCase() && pass1 != pass1.toLowerCase()) {
          for (let i = 0; i < pass1.length; i++) {
            if (isNaN(pass1[i]) == false) {
              for (let a = 0; a < pass1.length; a++) {
                for (let b = 0; b < characters.length; b++) {
                  if (pass1[a] == characters[b]) {
                    return true
                  }
                }
              }
              return false
            }
          }
          return false
        }
        else {
          return false
        }
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  background()

  // --- Draws the white boxes ---
  box1_y = canvas.height / 2.9
  box1_width = canvas.width / 3 // Also used as the Box 1 starting x-position 
  box2_y = box1_y + canvas.height * 0.25
  box2_width = box1_width // Also used as the Box 2 starting x-position
  box3_x = canvas.width / 5.5
  box3_y = canvas.height * 0.80
  box3_width = canvas.width * 0.12
  box4_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  box4_y = box3_y
  box4_width = box3_width
  box_height = canvas.height * 0.1

  ctx.fillStyle = white
  ctx.fillRect(box1_width, box1_y, box1_width, box_height)
  ctx.fillRect(box2_width, box2_y, box2_width, box_height)
  ctx.fillRect(box3_x, box3_y, box3_width, box_height)
  ctx.fillRect(box4_x, box3_y, box3_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = l_blue
  ctx.fillRect(box1_width, box1_y, box1_width, border_width)
  ctx.fillRect(box1_width * 2 - border_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y + box_height - border_width, box1_width, border_width)

  ctx.fillRect(box2_width, box2_y, box2_width, border_width)
  ctx.fillRect(box2_width * 2 - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_width, box2_y + box_height - border_width, box1_width, border_width)

  ctx.fillStyle = blue
  ctx.fillRect(box3_x, box3_y, box3_width, border_width)
  ctx.fillRect(box3_x + box3_width - border_width, box3_y, border_width, box_height)
  ctx.fillRect(box3_x, box3_y, border_width, box_height)
  ctx.fillRect(box3_x, box3_y + box_height - border_width, box3_width, border_width)

  ctx.fillRect(box4_x, box3_y, box3_width, border_width)
  ctx.fillRect(box4_x + box3_width - border_width, box3_y, border_width, box_height)
  ctx.fillRect(box4_x, box3_y, border_width, box_height)
  ctx.fillRect(box4_x, box3_y + box_height - border_width, box3_width, border_width)

  // --- Draws the top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.1
  left_height = canvas.height / 1.19
  right_width = canvas.width - left_width
  right_height = canvas.height / 1.17
  centre_height = canvas.height / 3.5
  centre_height2 = canvas.height / 1.86
  top_height = canvas.height / 8
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"
  ctx.font = "bold 35px Courier New"
  ctx.fillText("Sign Up.", left_width, top_height)
  ctx.fillText("Username: " + username, right_width, top_height)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Choose", centre_width, centre_height)
  ctx.fillText("Your Password:", centre_width, centre_height + increment)
  ctx.fillText("Enter It", centre_width, centre_height2)
  ctx.fillText("Again:", centre_width, centre_height2 + increment)
  ctx.fillText("Go", left_width, left_height)
  ctx.fillText("Back", left_width, left_height + increment)
  ctx.fillText("Continue", right_width, right_height)

  window.addEventListener('resize', load_signup)

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws year selection screen
// ------------------------------------------

function load_signup2() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= box4_x && pos[0] <= box4_x + box4_width + border_width && pos[1] >= box4_y && pos[1] <= box4_y + box_height + border_width) {
      window.removeEventListener('resize', load_signup2)
      canvas.removeEventListener('click', click)
      password_1 = ""
      password_2 = ""
      year = ""
      load_signup() // Goes back to the sign up page
    }

    else if (pos[0] >= box1_width && pos[0] <= box1_width * 2 + border_width && pos[1] >= box1_y && pos[1] <= box1_y + box_height + border_width) {
      year = "Year 9"

      ctx.fillStyle = white
      ctx.fillRect(box2_width + border_width, box2_y + border_width, box2_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(box3_width + border_width, box3_y + border_width, box3_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText("Year 10", centre_width, centre_height + increment * 6.7)
      ctx.fillText("Year 11", centre_width, centre_height + increment * 10.4)

      ctx.fillStyle = l_blue
      ctx.fillRect(box1_width, box1_y, box1_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText("Year 9", centre_width, centre_height + increment * 3)
      
    }

    else if (pos[0] >= box2_width && pos[0] <= box2_width * 2 + border_width && pos[1] >= box2_y && pos[1] <= box2_y + box_height + border_width) {
      year = "Year 10"

      ctx.fillStyle = white
      ctx.fillRect(box1_width + border_width, box1_y + border_width, box1_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(box3_width + border_width, box3_y + border_width, box3_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText("Year 9", centre_width, centre_height + increment * 3)
      ctx.fillText("Year 11", centre_width, centre_height + increment * 10.4)

      ctx.fillStyle = l_blue
      ctx.fillRect(box2_width, box2_y, box2_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText("Year 10", centre_width, centre_height + increment * 6.7)

    }

    else if (pos[0] >= box3_width && pos[0] <= box3_width * 2 + border_width && pos[1] >= box3_y && pos[1] <= box3_y + box_height + border_width) {
      year = "Year 11"

      ctx.fillStyle = white
      ctx.fillRect(box1_width + border_width, box1_y + border_width, box1_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(box2_width + border_width, box2_y + border_width, box2_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText("Year 9", centre_width, centre_height + increment * 3)
      ctx.fillText("Year 10", centre_width, centre_height + increment * 6.7)

      ctx.fillStyle = l_blue
      ctx.fillRect(box3_width, box3_y, box3_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText("Year 11", centre_width, centre_height + increment * 10.4)

    }
      
    else if (pos[0] >= box5_x && pos[0] <= box5_x + box5_width + border_width && pos[1] >= box5_y && pos[1] <= box5_y + box_height + border_width) {
      if (year != "") {
        window.removeEventListener('resize', load_signup2)
        canvas.removeEventListener('click', click)
        load_menu() // Loads main menu
      }
    }
  }

  background()

  // --- Draws the white boxes ---
  box1_y = canvas.height / 2.9
  box1_width = canvas.width / 3 // Also used as the Box 1 starting x-position 
  box2_y = box1_y + canvas.height * 0.15
  box2_width = box1_width // Also used as the Box 2 starting x-position
  box3_y = box2_y + canvas.height * 0.15
  box3_width = box1_width // Also used as the Box 3 starting x-position
  box4_x = canvas.width / 5.5
  box4_y = canvas.height * 0.80
  box4_width = canvas.width * 0.12
  box5_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  box5_y = box4_y
  box5_width = box4_width
  box_height = canvas.height * 0.1

  ctx.fillStyle = white
  ctx.fillRect(box1_width, box1_y, box1_width, box_height)
  ctx.fillRect(box2_width, box2_y, box2_width, box_height)
  ctx.fillRect(box3_width, box3_y, box3_width, box_height)
  ctx.fillRect(box4_x, box4_y, box4_width, box_height)
  ctx.fillRect(box5_x, box5_y, box5_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = l_blue
  ctx.fillRect(box1_width, box1_y, box1_width, border_width)
  ctx.fillRect(box1_width * 2 - border_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y, border_width, box_height)
  ctx.fillRect(box1_width, box1_y + box_height - border_width, box1_width, border_width)

  ctx.fillRect(box2_width, box2_y, box2_width, border_width)
  ctx.fillRect(box2_width * 2 - border_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_width, box2_y, border_width, box_height)
  ctx.fillRect(box2_width, box2_y + box_height - border_width, box2_width, border_width)
  
  ctx.fillRect(box3_width, box3_y, box3_width, border_width)
  ctx.fillRect(box3_width * 2 - border_width, box3_y, border_width, box_height)
  ctx.fillRect(box3_width, box3_y, border_width, box_height)
  ctx.fillRect(box3_width, box3_y + box_height - border_width, box3_width, border_width)

  ctx.fillStyle = blue
  ctx.fillRect(box4_x, box4_y, box4_width, border_width)
  ctx.fillRect(box4_x + box4_width - border_width, box4_y, border_width, box_height)
  ctx.fillRect(box4_x, box4_y, border_width, box_height)
  ctx.fillRect(box4_x, box4_y + box_height - border_width, box4_width, border_width)

  ctx.fillRect(box5_x, box5_y,box5_width, border_width)
  ctx.fillRect(box5_x + box5_width - border_width, box5_y, border_width, box_height)
  ctx.fillRect(box5_x, box5_y, border_width, box_height)
  ctx.fillRect(box5_x, box5_y + box_height - border_width, box5_width, border_width)

  // --- Draws the top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.1
  left_height = canvas.height / 1.19
  right_width = canvas.width - left_width
  right_height = canvas.height / 1.17
  centre_height = canvas.height / 3.5
  top_height = canvas.height / 8
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"
  ctx.font = "bold 35px Courier New"
  ctx.fillText("Sign Up.", left_width, top_height)
  ctx.fillText("Username: " + username, right_width, top_height)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Select Your Year:", centre_width, centre_height)
  ctx.fillText("Year 9", centre_width, centre_height + increment * 3)
  ctx.fillText("Year 10", centre_width, centre_height + increment * 6.7)
  ctx.fillText("Year 11", centre_width, centre_height + increment * 10.4)
  ctx.fillText("Go", left_width, left_height)
  ctx.fillText("Back", left_width, left_height + increment)
  ctx.fillText("Continue", right_width, right_height)

  window.addEventListener('resize', load_signup2)

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws main menu of game
// ------------------------------------------

function load_menu() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= logout_x && pos[0] <= logout_x + logout_width + border_width && pos[1] >= logout_y && pos[1] <= logout_y + box_height + border_width) {
      window.removeEventListener('resize', load_menu)
      canvas.removeEventListener('click', click)
      username = ""
      password_1 = ""
      password_2 = ""
      score = 300
      load_title() // Goes back to the title page
    }
    else if (pos[0] >= lvl1_x && pos[0] <= lvl1_x + lvl1_width + border_width && pos[1] >= lvl1_y && pos[1] <= lvl1_y + box_height + border_width) {
      window.removeEventListener('resize', load_menu)
      canvas.removeEventListener('click', click)
      puzzle = new MultChoice("Algebra", score)
      puzzle.generate()
      attempts = 3
      load_puzzle()
    }
    else if (pos[0] >= lvl2_x && pos[0] <= lvl2_x + lvl2_width + border_width && pos[1] >= lvl2_y && pos[1] <= lvl2_y + box_height + border_width) {
      window.removeEventListener('resize', load_menu)
      canvas.removeEventListener('click', click)
      puzzle = new Graph("Geometry", score)
      puzzle.grid_generate()
      attempts = 3
      load_puzzle2()
    }
  }

  background()

  // --- Draws the white boxes ---
  logout_x = canvas.width / 5.5
  logout_y = canvas.height * 0.80
  logout_width = canvas.width * 0.12
  settings_x = canvas.width / 2 - canvas.width / 6
  settings_y = logout_y
  settings_width = canvas.width * 0.15
  ppage_x = canvas.width / 2 + canvas.width / 6 - settings_width
  ppage_y = logout_y
  ppage_width = settings_width
  npage_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  npage_y = logout_y
  npage_width = logout_width
  lvl1_x = settings_x
  lvl1_y = canvas.height / 2.7
  lvl1_width = settings_width
  lvl2_x = ppage_x
  lvl2_y = lvl1_y
  lvl2_width = settings_width
  box_height = canvas.height * 0.1

  ctx.fillStyle = white
  ctx.fillRect(logout_x, logout_y, logout_width, box_height)
  ctx.fillRect(settings_x, settings_y, settings_width, box_height)
  ctx.fillRect(ppage_x, ppage_y, ppage_width, box_height)
  ctx.fillRect(npage_x, npage_y, npage_width, box_height)
  ctx.fillRect(lvl1_x, lvl1_y, lvl1_width, box_height)
  ctx.fillRect(lvl2_x, lvl2_y, lvl2_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = blue
  ctx.fillRect(logout_x, logout_y, logout_width, border_width)
  ctx.fillRect(logout_x + logout_width - border_width, logout_y, border_width, box_height)
  ctx.fillRect(logout_x, logout_y, border_width, box_height)
  ctx.fillRect(logout_x, logout_y + box_height - border_width, logout_width, border_width)

  ctx.fillRect(settings_x, settings_y, settings_width, border_width)
  ctx.fillRect(settings_x + settings_width - border_width, settings_y, border_width, box_height)
  ctx.fillRect(settings_x, settings_y, border_width, box_height)
  ctx.fillRect(settings_x, settings_y + box_height - border_width, settings_width, border_width)

  ctx.fillRect(ppage_x, ppage_y, ppage_width, border_width)
  ctx.fillRect(ppage_x + ppage_width - border_width, ppage_y, border_width, box_height)
  ctx.fillRect(ppage_x, ppage_y, border_width, box_height)
  ctx.fillRect(ppage_x, ppage_y + box_height - border_width, ppage_width, border_width)

  ctx.fillRect(npage_x, npage_y, npage_width, border_width)
  ctx.fillRect(npage_x + npage_width - border_width, npage_y, border_width, box_height)
  ctx.fillRect(npage_x, npage_y, border_width, box_height)
  ctx.fillRect(npage_x, npage_y + box_height - border_width, npage_width, border_width)

  ctx.fillRect(lvl1_x, lvl1_y, lvl1_width, border_width)
  ctx.fillRect(lvl1_x + lvl1_width - border_width, lvl1_y, border_width, box_height)
  ctx.fillRect(lvl1_x, lvl1_y, border_width, box_height)
  ctx.fillRect(lvl1_x, lvl1_y + box_height - border_width, lvl1_width, border_width)

  ctx.fillRect(lvl2_x, lvl2_y, lvl2_width, border_width)
  ctx.fillRect(lvl2_x + lvl2_width - border_width, lvl2_y, border_width, box_height)
  ctx.fillRect(lvl2_x, lvl2_y, border_width, box_height)
  ctx.fillRect(lvl2_x, lvl2_y + box_height - border_width, lvl2_width, border_width)

  // --- Draws top and bottom blue bars ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)
  ctx.fillRect(canvas.width / 8, canvas.height * 0.75, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  centre_width = canvas.width / 2
  left_width = canvas.width / 4.15
  left_width2 = canvas.width / 2.45
  right_width = canvas.width - left_width
  right_width2 = canvas.width - left_width2
  bottom_height = canvas.height / 1.19
  top_height = canvas.height / 8
  mid_height = canvas.height / 3
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"
  ctx.font = "bold 35px Courier New"
  ctx.fillText(username, left_width, top_height)
  ctx.fillText(year, centre_width, top_height)
  ctx.fillText("Score: " + score.toString(), right_width, top_height)

  ctx.font = "bold 25px Courier New"
  ctx.fillText("Algebra", left_width2, mid_height)
  ctx.fillText("Geometry", right_width2, mid_height)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Log", left_width, bottom_height)
  ctx.fillText("Out", left_width, bottom_height + increment)
  ctx.fillText("Settings", left_width2, bottom_height)
  ctx.fillText("Menu", left_width2, bottom_height + increment)
  ctx.fillText("Previous", right_width2, bottom_height)
  ctx.fillText("Page", right_width2, bottom_height + increment)
  ctx.fillText("Next", right_width, bottom_height)
  ctx.fillText("Page", right_width, bottom_height + increment)
  ctx.fillText("Start", left_width2, mid_height + increment * 2)
  ctx.fillText("Level", left_width2, mid_height + increment * 3)
  ctx.fillText("Start", right_width2, mid_height + increment * 2)
  ctx.fillText("Level", right_width2, mid_height + increment * 3)

  window.addEventListener('resize', load_menu)

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws first puzzle screen
// ------------------------------------------

function load_puzzle() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= exit_x && pos[0] <= exit_x + exit_width + border_width && pos[1] >= exit_y && pos[1] <= exit_y + box_height + border_width) {
      window.removeEventListener('resize', load_puzzle)
      canvas.removeEventListener('click', click)
      load_menu()
    }
      
    else if (pos[0] >= ch1_x && pos[0] <= ch1_x + ch1_width + border_width && pos[1] >= ch1_y && pos[1] <= ch1_y + box_height + border_width) {
      choice = "1"

      ctx.fillStyle = white
      ctx.fillRect(ch2_x + border_width, ch2_y + border_width, ch2_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch3_x + border_width, ch3_y + border_width, ch3_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch4_x + border_width, ch4_y + border_width, ch4_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[1], width_c2, height_c2)
      ctx.fillText(puzzle.choices[2], width_c3, height_c3)
      ctx.fillText(puzzle.choices[3], width_c4, height_c4)
      
      ctx.fillStyle = l_blue
      ctx.fillRect(ch1_x, ch1_y, ch1_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[0], width_c1, height_c1)
    }
      
    else if (pos[0] >= ch2_x && pos[0] <= ch2_x + ch2_width + border_width && pos[1] >= ch2_y && pos[1] <= ch2_y + box_height + border_width) {
      choice = "2"

      ctx.fillStyle = white
      ctx.fillRect(ch1_x + border_width, ch1_y + border_width, ch1_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch3_x + border_width, ch3_y + border_width, ch3_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch4_x + border_width, ch4_y + border_width, ch4_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[0], width_c1, height_c1)
      ctx.fillText(puzzle.choices[2], width_c3, height_c3)
      ctx.fillText(puzzle.choices[3], width_c4, height_c4)

      ctx.fillStyle = l_blue
      ctx.fillRect(ch2_x, ch2_y, ch2_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[1], width_c2, height_c2)
    }
      
    else if (pos[0] >= ch3_x && pos[0] <= ch3_x + ch3_width + border_width && pos[1] >= ch3_y && pos[1] <= ch3_y + box_height + border_width) {
      choice = "3"

      ctx.fillStyle = white
      ctx.fillRect(ch1_x + border_width, ch1_y + border_width, ch1_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch2_x + border_width, ch2_y + border_width, ch2_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch4_x + border_width, ch4_y + border_width, ch4_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[0], width_c1, height_c1)
      ctx.fillText(puzzle.choices[1], width_c2, height_c2)
      ctx.fillText(puzzle.choices[3], width_c4, height_c4)

      ctx.fillStyle = l_blue
      ctx.fillRect(ch3_x, ch3_y, ch3_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[2], width_c3, height_c3)
    }
      
    else if (pos[0] >= ch4_x && pos[0] <= ch4_x + ch4_width + border_width && pos[1] >= ch4_y && pos[1] <= ch4_y + box_height + border_width) {
      choice = "4"

      ctx.fillStyle = white
      ctx.fillRect(ch1_x + border_width, ch1_y + border_width, ch1_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch2_x + border_width, ch2_y + border_width, ch2_width - border_width * 2, box_height - border_width * 2)
      ctx.fillRect(ch3_x + border_width, ch3_y + border_width, ch3_width - border_width * 2, box_height - border_width * 2)

      ctx.textAlign = "center"
      ctx.font = "25px Comic Sans MS"
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[0], width_c1, height_c1)
      ctx.fillText(puzzle.choices[1], width_c2, height_c2)
      ctx.fillText(puzzle.choices[2], width_c3, height_c3)

      ctx.fillStyle = l_blue
      ctx.fillRect(ch4_x, ch4_y, ch4_width, box_height)
      ctx.fillStyle = d_blue
      ctx.fillText(puzzle.choices[3], width_c4, height_c4)
    }
      
    else if (pos[0] >= submit_x && pos[0] <= submit_x + submit_width + border_width && pos[1] >= submit_y && pos[1] <= submit_y + box_height + border_width) {
      if (choice != "") {
        attempts -= 1
        if (choice == puzzle.answer) {
          window.removeEventListener('resize', load_puzzle)
          canvas.removeEventListener('click', click)
          load_end()
        }
        else if (attempts == 0) {
          window.removeEventListener('resize', load_puzzle)
          canvas.removeEventListener('click', click)
          load_end()
        }
        else {
          window.removeEventListener('resize', load_puzzle)
          canvas.removeEventListener('click', click)
          load_puzzle()
        choice = ""
        }
      }
    }
  }

  background()

  // --- Draws the white boxes ---
  box_height = canvas.height * 0.1
  ch1_x = canvas.width / 4
  ch1_y = canvas.height / 2.4
  ch1_width = canvas.width * 0.15
  ch2_x = canvas.width - ch1_x - ch1_width
  ch2_y = ch1_y
  ch2_width = ch1_width
  ch3_x = ch1_x
  ch3_y = canvas.height - ch1_y / 1.5 - box_height
  ch3_width = ch1_width
  ch4_x = ch2_x
  ch4_y = ch3_y
  ch4_width = ch1_width
  exit_x = canvas.width / 5.5
  exit_y = canvas.height * 0.80
  exit_width = canvas.width * 0.12
  submit_x = canvas.width - exit_x - exit_width 
  submit_y = exit_y
  submit_width = exit_width

  ctx.fillStyle = white
  ctx.fillRect(ch1_x, ch1_y, ch1_width, box_height)
  ctx.fillRect(ch2_x, ch2_y, ch2_width, box_height)
  ctx.fillRect(ch3_x, ch3_y, ch3_width, box_height)
  ctx.fillRect(ch4_x, ch4_y, ch4_width, box_height)

  ctx.fillRect(exit_x, exit_y, exit_width, box_height)
  ctx.fillRect(submit_x, submit_y, submit_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = blue
  ctx.fillRect(exit_x, exit_y, exit_width, border_width)
  ctx.fillRect(exit_x + exit_width - border_width, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y + box_height - border_width, exit_width, border_width)

  ctx.fillRect(submit_x, submit_y, submit_width, border_width)
  ctx.fillRect(submit_x + submit_width - border_width, submit_y, border_width, box_height)
  ctx.fillRect(submit_x, submit_y, border_width, box_height)
  ctx.fillRect(submit_x, submit_y + box_height - border_width, submit_width, border_width)

  ctx.fillStyle = l_blue
  ctx.fillRect(ch1_x, ch1_y, ch1_width, border_width)
  ctx.fillRect(ch1_x + ch1_width - border_width, ch1_y, border_width, box_height)
  ctx.fillRect(ch1_x, ch1_y, border_width, box_height)
  ctx.fillRect(ch1_x, ch1_y + box_height - border_width, ch1_width, border_width)

  ctx.fillRect(ch2_x, ch2_y, ch2_width, border_width)
  ctx.fillRect(ch2_x + ch2_width - border_width, ch2_y, border_width, box_height)
  ctx.fillRect(ch2_x, ch2_y, border_width, box_height)
  ctx.fillRect(ch2_x, ch2_y + box_height - border_width, ch2_width, border_width)

  ctx.fillRect(ch3_x, ch3_y, ch3_width, border_width)
  ctx.fillRect(ch3_x + ch3_width - border_width, ch3_y, border_width, box_height)
  ctx.fillRect(ch3_x, ch3_y, border_width, box_height)
  ctx.fillRect(ch3_x, ch3_y + box_height - border_width, ch3_width, border_width)

  ctx.fillRect(ch4_x, ch4_y, ch4_width, border_width)
  ctx.fillRect(ch4_x + ch4_width - border_width, ch4_y, border_width, box_height)
  ctx.fillRect(ch4_x, ch4_y, border_width, box_height)
  ctx.fillRect(ch4_x, ch4_y + box_height - border_width, ch4_width, border_width)

  // --- Draws top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  width_q = canvas.width / 2
  height_q = canvas.height / 3
  width_c1 = canvas.width / 3.1
  height_c1 = canvas.height / 2.12
  width_c2 = canvas.width - width_c1
  height_c2 = height_c1
  width_c3 = width_c1
  height_c3 = canvas.height / 1.46
  width_c4 = width_c2
  height_c4 = height_c3
  width_ex = canvas.width / 4.1
  height_ex = canvas.height / 1.19
  width_sub = canvas.width - width_ex
  height_sub = canvas.height / 1.17
  width_year = width_ex
  width_topic = width_q
  width_attempt = width_sub
  height_top = canvas.height / 8
  increment = canvas.height * 0.04
  
  ctx.fillStyle = d_blue
  ctx.textAlign = "center"

  ctx.font = "bold 35px Courier New"
  ctx.fillText(year, width_year, top_height)
  ctx.fillText(puzzle.type, width_topic, top_height)
  ctx.fillText("Attempts left: " + attempts.toString(), width_attempt, top_height)

  ctx.font = "bold 25px Courier New"
  ctx.fillText("Simplify: " + puzzle.question, width_q, height_q)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText(puzzle.choices[0], width_c1, height_c1)
  ctx.fillText(puzzle.choices[1], width_c2, height_c2)
  ctx.fillText(puzzle.choices[2], width_c3, height_c3)
  ctx.fillText(puzzle.choices[3], width_c4, height_c4)

  ctx.fillText("Exit", width_ex, height_ex)
  ctx.fillText("Level", width_ex, height_ex + increment)
  ctx.fillText("Submit", width_sub, height_sub)

  window.addEventListener('resize', load_puzzle) 
  
  canvas.addEventListener('click', click)
  
}

// ------------------------------------------
// Draws second puzzle screen
// ------------------------------------------

function load_puzzle2() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    // --- Sets properties of the 'Enter Coordinate' textboxes ---
     function addInput(x, y) {
        var input = document.createElement('input');
        input.type = 'text';
        input.id = "textbox"
        input.style.height = box_height * 0.815 + 'px'
        input.style.width = plot1_width * 0.815 + 'px'
        input.style.position = 'fixed';
        input.style.left = x + 17 + 'px';
        input.style.top = y + 17 + 'px';
        input.style.textAlign = 'center'
        input.onkeydown = handleEnter;
        document.body.appendChild(input);
        input.focus();
     }

    function numCheck(input, type) {
      if (isNaN(input) === false) {
        if (type == "X") {
          if (Number(input) >= -13 && Number(input) <= 13) {
            return true
          }
          else {
            return false
          }
        }
        else {
          if (Number(input) >= -11 && Number(input) <= 11) {
            return true
          }
          else {
            return false
          }
        }
      }
      else {
        return false
      }
    }

    function grid_check(puzzle) {
      for (let i = 0; i < puzzle.grid.length; i++) {
        for (let j = 0; j < puzzle.grid[i].length; j++) {
          if (puzzle.grid[i][j] != puzzle.answer[i][j]) {
            return false
          }
        }
      }
      return true
    }

    if (pos[0] >= exit_x && pos[0] <= exit_x + exit_width + border_width && pos[1] >= exit_y && pos[1] <= exit_y + box_height + border_width) {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove()
      }
      window.removeEventListener('resize', load_puzzle2)
      canvas.removeEventListener('click', click)
      load_menu()
    }

    else if (pos[0] >= plot1_x && pos[0] <= plot1_x + plot1_width + border_width && pos[1] >= plot1_y && pos[1] <= plot1_y + box_height + border_width) {
      
      // --- Updates X-coordinate textbox
       function handleEnter(mouse) {
           var keyCode = mouse.keyCode;
           if (keyCode === 13 && numCheck(this.value, "X") == true) { // If user presses the 'Enter' key
               ctx.fillStyle = white
               ctx.fillRect(plot1_x + border_width, plot1_y + border_width, plot1_width - border_width * 2, box_height - border_width * 2)
               drawText(this.value, canvas.width / 3.58, canvas.height / 2.4)
               puzzle.xcoord = this.value
               document.body.removeChild(this);
           }
       }

       function drawText(txt, x, y) {
           ctx.fillStyle = d_blue
           ctx.fillText(txt, x, y);
       }

       text = document.getElementById('textbox')
       if (text == null) {
       addInput(plot1_x, plot1_y) // Adds textbox to screen if it doesn't already exist
       }
       else {
         text.remove()
       }
    }

    else if (pos[0] >= plot2_x && pos[0] <= plot2_x + plot2_width + border_width && pos[1] >= plot2_y && pos[1] <= plot2_y + box_height + border_width) {

      // --- Updates Y-coordinate textbox
       function handleEnter(mouse) {
           var keyCode = mouse.keyCode;
           if (keyCode === 13 && numCheck(this.value, "Y") == true) { // If user presses the 'Enter' key
               ctx.fillStyle = white
               ctx.fillRect(plot2_x + border_width, plot2_y + border_width, plot2_width - border_width * 2, box_height - border_width * 2)
               drawText(this.value, canvas.width / 3.58, canvas.height / 1.76)
               puzzle.ycoord = this.value
               document.body.removeChild(this);
           }
       }

       function drawText(txt, x, y) {
           ctx.fillStyle = d_blue
           ctx.fillText(txt, x, y);
       }

       text = document.getElementById('textbox')
       if (text == null) {
       addInput(plot2_x, plot2_y) // Adds textbox to screen if it doesn't already exist
       }
       else {
         text.remove()
       }
    }

    else if (pos[0] >= plot3_x && pos[0] <= plot3_x + plot3_width + border_width && pos[1] >= plot3_y && pos[1] <= plot3_y + box_height + border_width) {
      if (puzzle.xcoord != null && puzzle.ycoord != null) {
        puzzle.grid[Math.floor(puzzle.grid.length / 2) - Number(puzzle.ycoord)][Math.floor(puzzle.grid[0].length / 2) + Number(puzzle.xcoord)] = true
        puzzle.grid_drawpoints(puzzle.grid, black)
      }
    }

    else if (pos[0] >= reset_x && pos[0] <= reset_x + reset_width + border_width && pos[1] >= reset_y && pos[1] <= reset_y + box_height + border_width) {
      puzzle.xcoord = null
      puzzle.ycoord = null
      puzzle.grid = puzzle.grid_create()
      window.removeEventListener('resize', load_puzzle2) 
      canvas.removeEventListener('click', click)
      load_puzzle2()
    }

    else if (pos[0] >= submit_x && pos[0] <= submit_x + submit_width + border_width && pos[1] >= submit_y && pos[1] <= submit_y + box_height + border_width) {
      attempts -= 1
      if (grid_check(puzzle) == true) {
        window.removeEventListener('resize', load_puzzle2)
        canvas.removeEventListener('click', click)
        load_end2()
      }
      else if (attempts == 0) {
        window.removeEventListener('resize', load_puzzle2)
        canvas.removeEventListener('click', click)
        load_end2()
      }
      else {
        puzzle.grid = puzzle.grid_create()
        window.removeEventListener('resize', load_puzzle2)
        canvas.removeEventListener('click', click)
        load_puzzle2()
      }
      
    }
      
    else {
      text = document.getElementById('textbox')
      if (text != null) {
        text.remove() // Removes textbox if user clicks anywhere else on screen
      }
    }
  }
  
  background()

  // --- Draws the white boxes ---
  box_height = canvas.height * 0.1
  spacing = canvas.height * 0.05
  exit_x = canvas.width / 5.5
  exit_y = canvas.height * 0.80
  exit_width = canvas.width * 0.12
  submit_x = canvas.width - exit_x - exit_width 
  submit_y = exit_y
  submit_width = exit_width
  plot1_x = canvas.width / 4
  plot1_y = canvas.height / 2.8
  plot1_width = canvas.width * 0.06
  plot2_x = plot1_x
  plot2_y = plot1_y + box_height + spacing
  plot2_width = plot1_width
  plot3_x = exit_x
  plot3_y = plot2_y + box_height + spacing
  plot3_width = exit_width
  reset_x = submit_x
  reset_y = plot3_y
  reset_width = exit_width

  ctx.fillStyle = white
  ctx.fillRect(exit_x, exit_y, exit_width, box_height)
  ctx.fillRect(submit_x, submit_y, submit_width, box_height)
  ctx.fillRect(plot1_x, plot1_y, plot1_width, box_height)
  ctx.fillRect(plot2_x, plot2_y, plot2_width, box_height)
  ctx.fillRect(plot3_x, plot3_y, plot3_width, box_height)
  ctx.fillRect(reset_x, reset_y, reset_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = l_blue
  ctx.fillRect(plot1_x, plot1_y, plot1_width, border_width)
  ctx.fillRect(plot1_x + plot1_width - border_width, plot1_y, border_width, box_height)
  ctx.fillRect(plot1_x, plot1_y, border_width, box_height)
  ctx.fillRect(plot1_x, plot1_y + box_height - border_width, plot1_width, border_width)

  ctx.fillRect(plot2_x, plot2_y, plot2_width, border_width)
  ctx.fillRect(plot2_x + plot2_width - border_width, plot2_y, border_width, box_height)
  ctx.fillRect(plot2_x, plot2_y, border_width, box_height)
  ctx.fillRect(plot2_x, plot2_y + box_height - border_width, plot2_width, border_width)

  ctx.fillRect(plot3_x, plot3_y, plot3_width, border_width)
  ctx.fillRect(plot3_x + plot3_width - border_width, plot3_y, border_width, box_height)
  ctx.fillRect(plot3_x, plot3_y, border_width, box_height)
  ctx.fillRect(plot3_x, plot3_y + box_height - border_width, plot3_width, border_width)

  ctx.fillRect(reset_x, reset_y, reset_width, border_width)
  ctx.fillRect(reset_x + reset_width - border_width, reset_y, border_width, box_height)
  ctx.fillRect(reset_x, reset_y, border_width, box_height)
  ctx.fillRect(reset_x, reset_y + box_height - border_width, reset_width, border_width)

  ctx.fillStyle = blue
  ctx.fillRect(exit_x, exit_y, exit_width, border_width)
  ctx.fillRect(exit_x + exit_width - border_width, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y + box_height - border_width, exit_width, border_width)

  ctx.fillRect(submit_x, submit_y, submit_width, border_width)
  ctx.fillRect(submit_x + submit_width - border_width, submit_y, border_width, box_height)
  ctx.fillRect(submit_x, submit_y, border_width, box_height)
  ctx.fillRect(submit_x, submit_y + box_height - border_width, submit_width, border_width)

  // --- Draws top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  width_q = canvas.width / 2
  height_q = canvas.height / 3.5
  width_ex = canvas.width / 4.1
  height_ex = canvas.height / 1.19
  width_sub = canvas.width - width_ex
  height_sub = canvas.height / 1.17
  width_xplot = canvas.width / 7
  height_xplot = canvas.height / 2.6
  width_yplot = width_xplot
  height_yplot = canvas.height / 1.9
  width_pplot = width_ex
  height_pplot = canvas.height / 1.44
  width_reset = canvas.width - width_pplot 
  height_reset = height_pplot
  width_year = width_ex
  width_topic = width_q
  width_attempt = width_sub
  height_top = canvas.height / 8
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue

  ctx.textAlign = "left"
  ctx.font = "bold 25px Courier New"
  ctx.fillText("Enter", width_xplot, height_xplot)
  ctx.fillText("X-coordinate:", width_xplot, height_xplot + increment)
  ctx.fillText("Enter", width_yplot, height_yplot)
  ctx.fillText("Y-coordinate:", width_yplot, height_yplot + increment)

  ctx.textAlign = "center"

  ctx.fillText("Plot points to reflect the red shape in the " + puzzle.line, width_q, height_q)

  ctx.font = "bold 35px Courier New"
  ctx.fillText(year, width_year, top_height)
  ctx.fillText(puzzle.type, width_topic, top_height)
  ctx.fillText("Attempts left: " + attempts.toString(), width_attempt, top_height)
  
  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Plot", width_pplot, height_pplot)
  ctx.fillText("Point", width_pplot, height_pplot + increment)
  ctx.fillText("Reset", width_reset, height_reset)
  ctx.fillText("Grid", width_reset, height_reset + increment)
  ctx.fillText("Exit", width_ex, height_ex)
  ctx.fillText("Level", width_ex, height_ex + increment)
  ctx.fillText("Submit", width_sub, height_sub)

  // --- Draws Grid ---
  grid_x = canvas.width / 3
  grid_y = canvas.height / 3
  grid_width = grid_x + canvas.width / 3
  grid_height = grid_y + canvas.height / 1.7
  cell_size = grid_width / 50
  x_axis = grid_height / 2 + grid_y / 2
  y_axis = grid_width / 2 + grid_x / 2 + cell_size / 2

  ctx.strokeStyle = black

  for (let x = grid_x; x < grid_width; x = x + cell_size) {
    for (let y = grid_y; y < grid_height; y = y + cell_size) {
      ctx.beginPath()
      ctx.rect(x, y, cell_size, cell_size)
      ctx.stroke()
    }
  }

  ctx.strokeStyle = d_blue
  ctx.lineWidth = 4

  ctx.beginPath()
  ctx.moveTo(grid_x, x_axis)
  ctx.lineTo(grid_width + cell_size, x_axis)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(y_axis, grid_y)
  ctx.lineTo(y_axis, grid_height)
  ctx.stroke()

  puzzle.grid_drawpoints(puzzle.question, red)
  puzzle.grid_lines(puzzle.qpoints, red)

  window.addEventListener('resize', load_puzzle2) 

  canvas.addEventListener('click', click)

}

// ------------------------------------------
// Draws algebra puzzle answer screen 
// ------------------------------------------

function load_end() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= exit_x && pos[0] <= exit_x + exit_width + border_width && pos[1] >= exit_y && pos[1] <= exit_y + box_height + border_width) {
      choice = ""
      window.removeEventListener('resize', load_end)
      canvas.removeEventListener('click', click)
      load_menu()
    }
    else if (pos[0] >= next_x && pos[0] <= next_x + next_width + border_width && pos[1] >= next_y && pos[1] <= next_y + box_height + border_width) {
      choice = ""
      window.removeEventListener('resize', load_end)
      canvas.removeEventListener('click', click)
      puzzle = new MultChoice("Algebra", score)
      puzzle.generate()
      attempts = 3
      load_puzzle()
    }
  }

  function new_score(score, attempts) {
    if (attempts == 0) {
      score -= 10
      s_change = "-10"
    }
    else if (attempts == 1) {
      score += 10
      s_change = "+10"
    }
    else {
      score += 20
      s_change = "+20"
    } 
    s_values = [score, s_change]
    return s_values
  }
  
  background()

  s_values = new_score(score, attempts) 
  
  score = s_values[0]
  s_change = s_values[1]

  // --- Draws the white boxes ---
  box_height = canvas.height * 0.1
  exit_x = canvas.width / 5.5
  exit_y = canvas.height * 0.80
  exit_width = canvas.width * 0.2
  next_x = canvas.width - exit_x - canvas.width * 0.12
  next_y = exit_y
  next_width = canvas.width * 0.12

  ctx.fillStyle = white
  ctx.fillRect(exit_x, exit_y, exit_width, box_height)
  ctx.fillRect(next_x, next_y, next_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = blue
  ctx.fillRect(exit_x, exit_y, exit_width, border_width)
  ctx.fillRect(exit_x + exit_width - border_width, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y + box_height - border_width, exit_width, border_width)

  ctx.fillRect(next_x, next_y, next_width, border_width)
  ctx.fillRect(next_x + next_width - border_width, next_y, border_width, box_height)
  ctx.fillRect(next_x, next_y, border_width, box_height)
  ctx.fillRect(next_x, next_y + box_height - border_width, next_width, border_width)

  // --- Draws top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  width_ex = canvas.width / 3.5
  height_ex = canvas.height / 1.19
  width_next = canvas.width - canvas.width / 4.1
  height_next = canvas.height / 1.17
  width_ans = canvas.width / 3.5
  width_score = canvas.width - width_ans
  height_mid = canvas.height / 3
  width_year = width_ex
  width_topic = canvas.width / 2
  width_attempt = width_next
  height_top = canvas.height / 8
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"

  ctx.font = "bold 35px Courier New"
  ctx.fillText(year, width_year, height_top)
  ctx.fillText(puzzle.type, width_topic, height_top)
  ctx.fillText("Attempts left: " + attempts.toString(), width_attempt, height_top)
  
  ctx.font = "bold 25px Courier New"
  ctx.fillText("Question:", width_ans, height_mid)
  ctx.fillText("Correct Answer:", width_ans, height_mid + increment * 5)
  ctx.fillText("Changes In Score:", width_score, height_mid)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText(puzzle.question, width_ans, height_mid + increment * 2)
  ctx.fillText(puzzle.choices[Number(puzzle.answer) - 1], width_ans, height_mid + increment * 7)
  ctx.fillText(s_change, width_score, height_mid + increment * 2)
  ctx.fillText("= " + score.toString(), width_score, height_mid + increment * 4)
  
  ctx.fillText("Return To", width_ex, height_ex)
  ctx.fillText("Main Menu", width_ex, height_ex + increment)
  ctx.fillText("Next Puzzle", width_next, height_next)

  window.addEventListener('resize', load_end) 
  
  canvas.addEventListener('click', click)
  
}

// ------------------------------------------
// Draws geometry puzzle answer screen 
// ------------------------------------------

function load_end2() {

  function click(mouse) {
    pos = [mouse.clientX, mouse.clientY] // Current x and y positions of the mouse

    if (pos[0] >= exit_x && pos[0] <= exit_x + exit_width + border_width && pos[1] >= exit_y && pos[1] <= exit_y + box_height + border_width) {
      window.removeEventListener('resize', load_end2)
      canvas.removeEventListener('click', click)
      load_menu()
    }

    else if (pos[0] >= next_x && pos[0] <= next_x + next_width + border_width && pos[1] >= next_y && pos[1] <= next_y + box_height + border_width) {
      window.removeEventListener('resize', load_end2)
      canvas.removeEventListener('click', click)
      puzzle = new Graph("Geometry", score)
      puzzle.grid_generate()
      attempts = 3
      load_puzzle2()
    }
  }

  function new_score(score, attempts) {
    if (attempts == 0) {
      score -= 10
      s_change = "-10"
    }
    else if (attempts == 1) {
      score += 10
      s_change = "+10"
    }
    else {
      score += 20
      s_change = "+20"
    } 
    s_values = [score, s_change]
    return s_values
  }
  
  background()

  s_values = new_score(score, attempts)  // *** Write up error ***

  score = s_values[0]
  s_change = s_values[1]

  // --- Draws the white boxes ---
  box_height = canvas.height * 0.1
  exit_x = canvas.width / 7.8
  exit_y = canvas.height * 0.80
  exit_width = canvas.width * 0.2
  next_x = canvas.width - canvas.width / 5.5 - canvas.width * 0.12
  next_y = exit_y
  next_width = canvas.width * 0.12

  ctx.fillStyle = white
  ctx.fillRect(exit_x, exit_y, exit_width, box_height)
  ctx.fillRect(next_x, next_y, next_width, box_height)

  // --- Draws blue borders of white boxes ---
  border_width = canvas.height * 0.01

  ctx.fillStyle = blue
  ctx.fillRect(exit_x, exit_y, exit_width, border_width)
  ctx.fillRect(exit_x + exit_width - border_width, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y, border_width, box_height)
  ctx.fillRect(exit_x, exit_y + box_height - border_width, exit_width, border_width)

  ctx.fillRect(next_x, next_y, next_width, border_width)
  ctx.fillRect(next_x + next_width - border_width, next_y, border_width, box_height)
  ctx.fillRect(next_x, next_y, border_width, box_height)
  ctx.fillRect(next_x, next_y + box_height - border_width, next_width, border_width)

  // --- Draws top blue bar ---
  ctx.fillStyle = l_blue
  ctx.fillRect(canvas.width / 8, canvas.height / 5, canvas.width - canvas.width / 4, canvas.height * 0.02)

  // --- Draws text on screen ---
  width_info = canvas.width / 2
  height_info = canvas.height / 3.5
  width_ex = canvas.width / 4.3
  height_ex = canvas.height / 1.19
  width_next = canvas.width - canvas.width / 4.1
  height_next = canvas.height / 1.17
  width_year = canvas.width / 3.5
  width_topic = canvas.width / 2
  width_attempt = width_next
  height_top = canvas.height / 8
  width_score = canvas.width * 0.78
  height_mid = canvas.height / 2.5
  increment = canvas.height * 0.04

  ctx.fillStyle = d_blue
  ctx.textAlign = "center"

  ctx.font = "bold 35px Courier New"
  ctx.fillText(year, width_year, height_top)
  ctx.fillText(puzzle.type, width_topic, height_top)
  ctx.fillText("Attempts left: " + attempts.toString(), width_attempt, height_top)

  ctx.font = "bold 25px Courier New"
  ctx.fillText("The green shape shows the correct answer.", width_info, height_info)
  ctx.fillText("Changes In Score:", width_score, height_mid)

  ctx.font = "25px Comic Sans MS"
  ctx.fillText("Return To", width_ex, height_ex)
  ctx.fillText("Main Menu", width_ex, height_ex + increment)
  ctx.fillText("Next Puzzle", width_next, height_next)
  ctx.fillText(s_change, width_score, height_mid + increment * 2)
  ctx.fillText("= " + score.toString(), width_score, height_mid + increment * 4)

  // --- Draws Grid ---
  grid_x = canvas.width / 3
  grid_y = canvas.height / 3
  grid_width = grid_x + canvas.width / 3
  grid_height = grid_y + canvas.height / 1.7
  cell_size = grid_width / 50
  x_axis = grid_height / 2 + grid_y / 2
  y_axis = grid_width / 2 + grid_x / 2 + cell_size / 2

  ctx.strokeStyle = black

  for (let x = grid_x; x < grid_width; x = x + cell_size) {
    for (let y = grid_y; y < grid_height; y = y + cell_size) {
      ctx.beginPath()
      ctx.rect(x, y, cell_size, cell_size)
      ctx.stroke()
    }
  }

  ctx.strokeStyle = d_blue
  ctx.lineWidth = 4

  ctx.beginPath()
  ctx.moveTo(grid_x, x_axis)
  ctx.lineTo(grid_width + cell_size, x_axis)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(y_axis, grid_y)
  ctx.lineTo(y_axis, grid_height)
  ctx.stroke()

  puzzle.grid_drawpoints(puzzle.question, red)
  puzzle.grid_lines(puzzle.qpoints, red)

  puzzle.grid_getpoints()
  if (puzzle.points.length != 0) {
    puzzle.grid_drawpoints(puzzle.grid, black)
    puzzle.grid_lines(puzzle.points, black)
  }

  puzzle.grid_drawpoints(puzzle.answer, green)
  puzzle.grid_lines(puzzle.apoints, green)

  window.addEventListener('resize', load_end2) 

  canvas.addEventListener('click', click)
  
}

// -- Sets up canvas on screen --
const canvas = document.getElementById("game_window")
const ctx = canvas.getContext("2d")

// --- Colours ---
const white = "#ffffff"
const blue = "#3d85c6ff"
const d_blue = "#02286F" // Dark blue
const l_blue = "#9fc5e8ff" // Light blue
const black = "#000000"
const red = "#ff0000"
const green = "#00ff00"

// --- Global Variables ---
username = ""
password_1 = ""
password_2 = ""
year = ""
score = 300
choice = ""
attempts = 3

load_title() // Loads title display 