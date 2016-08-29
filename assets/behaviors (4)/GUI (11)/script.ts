class GUIBehavior extends Sup.Behavior {
  private messages: Sup.Actor;
  private queueCount: number = 0;
  private nextDialog: number = 0;
  private dialogs: Array<string>;
  
  private positions = {off:-6, on: -4};
  private move: number = 0;

  private pureGameplay: boolean = false;
  private pgInstructions: Sup.Actor;

  awake() {
    // Initialize messages text box
    this.messages = this.actor.getChild('messages');
    this.messages.textRenderer.setText('');
    this.messages.setLocalY(this.positions.off);
    
    this.dialogs = DIALOGS;
    
    // Part of GUI notifying Pure Gameplay activation, initially invisible
    this.pgInstructions = this.actor.getChild('pure-gameplay');
    this.pgInstructions.textRenderer.setOpacity(0);
  }

  update() {
    // Animates messages between positions
    if (this.move !== 0) {
      this.messages.moveLocalY(this.move);
      if (this.messages.getLocalY() > this.positions.on || this.messages.getLocalY() < this.positions.off) {
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
        if (!this.pureGameplay)
          this.move = -0.1;
        else
          this.messages.textRenderer.setText('');
      }
    })
  }
  
  unlockPureGameplay() {
    // Indicates how to use Pure Gameplay
    this.pgInstructions.textRenderer.setOpacity(1);
  }
  
  /** Pure gameplay turns everything invisible */
  switchPureGameplay() {
    this.pureGameplay = !this.pureGameplay;
    
    // Pad and buttons
    let pad = Sup.getActor('pad');
    pad.spriteRenderer.setOpacity(this.pureGameplay ? 0 : 1);
    let buttons = pad.getChildren();
    for (let button of buttons) {
      button.spriteRenderer.setOpacity(this.pureGameplay ? 0 :1);
    }
    
    // Texts
    for (let text of this.actor.getChildren()) {
      text.textRenderer.setOpacity(this.pureGameplay ? 0 : 1);
    }
    
    // Messages are still displayed though
    this.messages.textRenderer.setOpacity(1);
    this.messages.setLocalY(this.pureGameplay ? 0 : this.positions.off);
    // Remove written text, and cancel eventual animation
    this.messages.textRenderer.setText('');
    this.move = 0;
    
    // Pure gameplay notification
    this.pgInstructions.textRenderer.setOpacity(1);
    this.pgInstructions.textRenderer.setText('Pure Gameplay ' + (this.pureGameplay ? 'activated' : 'deactivated'));
    Sup.setTimeout(1000, () => this.pgInstructions.textRenderer.setText(''));
  }
}
Sup.registerBehavior(GUIBehavior);
