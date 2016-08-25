
/**
* Animate buttons and register inputs
*/
class ButtonBehavior extends Sup.Behavior {
  public name: string;
  public key: string;
  private pressed = 
    {key: false,
     click: false};
  
  private pad: PadBehavior;

  awake() {
    // Actor's name define button animation, and even corresponding input
    this.name = this.name ? this.name : this.actor.getName();
    this.key = this.key ? this.key : this.name.toUpperCase();
    
    // Get Pad
    this.pad = this.actor.getParent().getBehavior(PadBehavior);
  }

  update() {
    // Detect a click
    let mouseRay = new Sup.Math.Ray();
    mouseRay.setFromCamera(Sup.getActor('Camera').camera, Sup.Input.getMousePosition());
    let mouseOver = mouseRay.intersectActor(this.actor).length;
    
    
    // Pushed animation when pressed, otherwise default
    if (Sup.Input.wasKeyJustPressed(this.key) || (mouseOver && Sup.Input.wasMouseButtonJustPressed(0))) {
      this.actor.spriteRenderer.setAnimation(this.name + '_pushed');
      
      // Notify pad
      this.pad.input(this.name);
      
      // Determine if keyboard or mouse has activated the button
      this.pressed.key = this.pressed.key || Sup.Input.wasKeyJustPressed(this.key);
      this.pressed.click = this.pressed.click || (mouseOver && Sup.Input.wasMouseButtonJustPressed(0));
      
    }
    else if (Sup.Input.wasKeyJustReleased(this.key) || (this.pressed.click && Sup.Input.wasMouseButtonJustReleased(0))) {
      // Update pressed status
      this.pressed.key = Sup.Input.wasKeyJustReleased(this.key) ? false : this.pressed.key;
      this.pressed.click = (this.pressed.click && Sup.Input.wasMouseButtonJustReleased(0)) ? false : this.pressed.click;
      
      // Reset default animation if not pressed
      if (!(this.pressed.key || this.pressed.click))
        this.actor.spriteRenderer.setAnimation(this.name);
    }
    
  }
}
Sup.registerBehavior(ButtonBehavior);