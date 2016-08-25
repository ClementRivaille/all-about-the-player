class GUIBehavior extends Sup.Behavior {
  private messages: Sup.Actor;
  private queueCount: number = 0;
  private nextDialog: number = 0;
  private dialogs: Array<string>;
  
  private positions = {off:-6, on: -4};
  private move: number = 0;

  private pureGameplay: boolean = false;

  awake() {
    // Initialize messages text box
    this.messages = this.actor.getChild('messages');
    this.messages.textRenderer.setText('');
    this.messages.setLocalY(this.positions.off);
    
    this.dialogs = DIALOGS;
  }

  update() {
    // Animates messages between positions
    if (this.move !== 0) {
      this.messages.moveLocalY(this.move);
      if (comparePositions(this.messages.getLocalY(), this.positions.on) || comparePositions(this.messages.getLocalY(), this.positions.off)) {
        this.move = 0;
      }
    }
  }

  printDialog() {
    if (!this.pureGameplay) {
      // Display next validation message
      this.messages.textRenderer.setText(this.dialogs[this.nextDialog]);
      this.nextDialog = Math.min(this.nextDialog + 1, this.dialogs.length -1);
      // Little animation
      this.messages.setLocalY(this.positions.off);
      this.move = 0.1;
    }
    else {
      // On pure gameplay mode, only say 'WIN'
      this.messages.textRenderer.setText('WIN');
    }
    
    // Wait before removing text
    this.queueCount += 1;
    Sup.setTimeout(3000, () => {
      // Manage several stimultaneous timers, only the last one will hide the text
      this.queueCount -= 1;
      if (this.queueCount <= 0) {
        // Move text downward
        this.move = -0.1;
      }
    })
  }
}
Sup.registerBehavior(GUIBehavior);

/** Utilitary function to compare position with an error margin */
function comparePositions(pos1: number, pos2: number) {
  return Math.abs(pos1 - pos2) < 0.001;
}
