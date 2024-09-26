HTML: Creates a 3x3 grid for the game board, along with a restart button and a message element that shows the result.
symbols Display (CSS):

Added styles for X and O using pseudo-elements (::before), which will make the symbols visible when applied.
The CSS class x will display an "X" and the class o will display an "O" inside the cells.
Increased the font size to make the symbols large and readable inside the cells (font-size: 4rem;).
JavaScript:
Handles the game logic (alternating turns between "X" and "O").
Checks for winning combinations after every move.
Handles draw conditions.
Updates the UI to reflect the winner or draw.
Track continuous wins: If the player wins a certain number of times in a row (e.g., 3 times), they earn a prize.![screencapture-127-0-0-1-5500-index-html-2024-09-26-17_07_45](https://github.com/user-attachments/assets/12cdc2ef-bb21-4f20-8ec6-142c0de9d8db)

The startGame() function is used to reset the board when the game is restarted.
