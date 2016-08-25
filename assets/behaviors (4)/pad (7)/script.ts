/**
* Detects Konami Code, and engage Pure Gameplay Mode
*/
class PadBehavior extends Sup.Behavior {
  private score: number = 0;
  private code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'B', 'A'];
  private next = 0;
  private gui: GUIBehavior;
  
  awake() {
    this.gui = Sup.getActor('GUI').getBehavior(GUIBehavior);
  }


  update() {
    
  }

  input(key: string) {
    // Check with next key in Konami code
    if (key === this.code[this.next]) {
      // Move code forward
      this.next = (this.next +1 ) % this.code.length;
      // If code complete, register victory
      if (this.next === 0) {  
        this.gui.printDialog();
        this.score += 1;
      }
    }
    else {
      // Reinit code
      this.next = key === this.code[0] ? 1 : 0;
    }
  }
}
Sup.registerBehavior(PadBehavior);
