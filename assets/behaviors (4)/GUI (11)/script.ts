class GUIBehavior extends Sup.Behavior {
  private messages: Sup.Actor;
  private queueCount: number = 0;
  private nextDialog: number = 0;
  private dialogs: Array<string>;

  private pureGameplay: boolean = false;

  awake() {
    this.messages = this.actor.getChild('messages');
    this.messages.textRenderer.setText('');
    
    this.dialogs = DIALOGS;
  }

  printDialog() {
    if (!this.pureGameplay) {
      // Display next validation message
      this.messages.textRenderer.setText(this.dialogs[this.nextDialog]);
      this.nextDialog = Math.min(this.nextDialog + 1, this.dialogs.length -1);
    }
    else {
      // On pure gameplay mode, only say 'WIN'
      this.messages.textRenderer.setText('WIN');
    }
    
    // Wait before removing text
    this.queueCount += 1;
    Sup.setTimeout(3000, () => {
      this.queueCount -= 1;
      if (this.queueCount <= 0) {
        this.messages.textRenderer.setText('');
      }
    })
  }
}
Sup.registerBehavior(GUIBehavior);
