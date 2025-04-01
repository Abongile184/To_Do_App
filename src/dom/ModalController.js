class ModalController {
  constructor() {
    this.modalContainer = document.getElementById('modal-container');
    if (!this.modalContainer) {
      this.modalContainer = document.createElement('div');
      this.modalContainer.id = 'modal-container';
      document.body.appendChild(this.modalContainer);
    }
    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
  }

  open() {
    this.modalContainer.classList.remove('out');
    this.modalContainer.classList.add('seven');
    document.body.classList.add('modal-active');
    document.body.addEventListener('click', this.handleBodyClick, true);
  }

  handleBodyClick(e) {
    // Prevent closing if the click was on the modal itself or its content
    if (e.target.closest('.modal')) return;
    this.close();   
  }

  handleAnimationEnd() {
    // Remove the modal only after the animation ends
    this.modalContainer.removeEventListener('animationend', this.handleAnimationEnd);
    this.modalContainer.remove();
  }

  close() {
    this.modalContainer.classList.add('out');
    document.body.classList.remove('modal-active');
    document.body.removeEventListener('click', this.handleBodyClick, true);
    this.modalContainer.addEventListener('animationend', this.handleAnimationEnd);
  }


}

  export default ModalController;