/**
* Detects Konami Code, and engage Pure Gameplay Mode
*/
class PadBehavior extends Sup.Behavior {
  private score: number = 0;
  private code = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right', 'B', 'A'];
  private next = 0;
  private gui: GUIBehavior;
  
  // Pure Gameplay indicators
  private pgUnlocked: boolean = false;
  private pgKeys = {
    start: false,
    select: false
  };
  
  awake() {
    this.gui = Sup.getActor('GUI').getBehavior(GUIBehavior);
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
        
        if (this.score === 10) {
          this.pgUnlocked = true;
          this.gui.unlockPureGameplay();
        }
      }
    }
    else {
      // Reinit code
      this.next = key === this.code[0] ? 1 : 0;
    }
    
    // Pure gameplay is activated on pressing start and select stimultaneously
    if (key === 'start' || key === 'select') {
      this.pgKeys[key] = true;
      Sup.log(this.pgKeys);
      
      if (this.pgUnlocked && this.pgKeys.start && this.pgKeys.select) {
        this.gui.switchPureGameplay();
        this.pgKeys.start = false;
        this.pgKeys.select = false;
      }
    }
  }
  
  released(key: string) {
    Sup.log(key + ' released');
    if (key === 'start' || key === 'select') {
      this.pgKeys[key] = false;
    }
  }
}
Sup.registerBehavior(PadBehavior);
